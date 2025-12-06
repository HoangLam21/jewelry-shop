import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import TitleSession from "@/components/shared/label/TitleSession";
import LabelInformation from "@/components/shared/label/LabelInformation";
import TableSearch from "@/components/shared/table/TableSearch";
import Table from "@/components/shared/table/Table";
import {
  getAllImportsOfProvider,
  getProviderById,
} from "@/lib/service/provider.service";
import { Provider } from "@/dto/ProviderDTO";
import PaginationUI from "@/types/pagination/Pagination";
import { PaginationProps } from "@/types/pagination";
import TableInvoice from "@/components/shared/table/TableInvoice";

const columns = [
  { header: "Product Image", accessor: "productImage" },
  { header: "Product Name", accessor: "productName" },
  { header: "Material", accessor: "material" },
  { header: "Size", accessor: "size" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Unit Price", accessor: "unitPrice" },
  { header: "Import Status", accessor: "importStatus" },
];

const ProviderInformation = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const [provider, setProvider] = useState<Provider | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [importOfProvider, setImportOfProvider] = useState<any[]>([]);

  useEffect(() => {
    const fetchImportData = async () => {
      try {
        if (id) {
          const foundProvider = await getProviderById(id);
          setProvider(foundProvider);
          const foundImports = await getAllImportsOfProvider(id);
          setImportOfProvider(foundImports);
        }
      } catch (error) {
        console.error("Error fetching provider information:", error);
      }
    };
    fetchImportData();
  }, [id]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredInvoices = importOfProvider.flatMap((item) =>
    item.invoice.filter((invoice: any) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        invoice.productName.toLowerCase().includes(lowerCaseQuery) ||
        invoice.material.toLowerCase().includes(lowerCaseQuery) ||
        invoice.size.toLowerCase().includes(lowerCaseQuery)
      );
    })
  );

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginationUI: PaginationProps = {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    totalPages,
    dataLength: filteredInvoices.length,
  };

  const renderRow = (item: any, index: number) => {
    return (
      <tr
        key={index}
        className="border-t border-gray-300 text-sm dark:text-dark-360"
      >
        <td className="px-4 py-2">
          <div className="w-[100px] h-[105px] overflow-hidden">
            <Image
              src={item?.productImage || "/assets/images/avatar.jpg"}
              alt={item?.productName || "Product Image"}
              layout="responsive"
              width={100}
              height={105}
              className="rounded-md object-cover"
            />
          </div>
        </td>
        <td className="px-4 py-2">{item.productName || "N/A"}</td>
        <td className="px-4 py-2">{item.material || "N/A"}</td>
        <td className="px-4 py-2">{item.size || "N/A"}</td>
        <td className="px-4 py-2">{item.quantity || 0}</td>
        <td className="px-4 py-2">{item.unitPrice || 0} VND</td>
        <td className="px-4 py-2">{item.importStatus ? "Done" : "Pending"}</td>
      </tr>
    );
  };

  if (!provider) {
    return <p>Loading provider information...</p>;
  }
  const handleSort = () => {
    console.log("this is sort");
  };
  return (
    <div className="w-full flex flex-col p-4 rounded-md shadow-md">
      {/* General Information */}
      <TitleSession
        icon="flowbite:profile-card-outline"
        title="General Information"
      />
      <div className="w-full p-6 flex flex-col gap-6">
        <div className="flex">
          <div className="w-1/5">
            <Image
              alt="avatar"
              src="/assets/images/avatar.jpg"
              width={115}
              height={130}
              className="rounded-md"
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-5">
            <LabelInformation content={provider._id || ""} title="ID" />
            <LabelInformation content={provider.name || ""} title="Fullname" />
            <LabelInformation
              content={provider.representativeName || ""}
              title="Representative"
            />
            <LabelInformation
              content={provider.contact || ""}
              title="Phone Number"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <LabelInformation content={provider.address || ""} title="Address" />
          <LabelInformation content={provider.city || ""} title="City" />
          <LabelInformation content={provider.country || ""} title="Country" />
        </div>
      </div>

      {/* Number of sales invoices */}
      <TitleSession icon="humbleicons:money" title="Number of sales invoices" />
      <div className="flex flex-col gap-6 w-full pt-6">
        <TableSearch onSearch={handleSearch} />
        <div className="flex flex-col gap-6 w-full p-6">
          <TableInvoice
            columns={columns}
            data={paginatedInvoices}
            renderRow={renderRow}
            onSort={handleSort}
          />
          <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
            <PaginationUI paginationUI={paginationUI} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderInformation;
