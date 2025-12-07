import LabelInformation from "@/components/shared/label/LabelInformation";
import TitleSession from "@/components/shared/label/TitleSession";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { StaffData } from "@/constants/data";
import Link from "next/link";
import { PaginationProps } from "@/types/pagination";
import TableSearch from "@/components/shared/table/TableSearch";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import LabelStatus from "@/components/shared/label/LabelStatus";
import {
  getAllImportsOfStaff,
  getStaffById,
} from "@/lib/service/staff.service";
import { Staff } from "@/dto/StaffDTO";
import { Import } from "@/dto/ImportDTO";
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
const StaffInformation = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const [staff, setStaff] = useState<Staff | null>(null); // Store staff data safely
  const [importOfStaff, setImportOfStaff] = useState<any[]>([]); // Store staff data safely
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        if (id) {
          const foundItem = await getStaffById(id);
          setStaff(foundItem);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nhân viên:", error);
      }
    };

    const fetchImportOfStaffData = async () => {
      try {
        if (id) {
          const foundItem = await getAllImportsOfStaff(id);
          setImportOfStaff(foundItem);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin import của nhân viên:", error);
      }
    };

    fetchStaffData();
    fetchImportOfStaffData();
  }, [id]);

  // Render nothing if staff is not loaded yet
  if (!staff && !importOfStaff) {
    return <p>Loading staff information...</p>;
  }

  const filteredInvoices = importOfStaff.flatMap((item: any) =>
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

  const handleSort = () => {
    console.log("this is sort");
  };

  const renderRow = (item: any, index: number) => (
    <tr
      key={index} // Nếu không có id thì dùng index làm key
      className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
    >
      <td className="px-4 py-2">
        <div className="flex items-center">
          <div className="w-[100px] h-[105px] overflow-hidden">
            <Image
              src={item.productImage || "/assets/images/avatar.jpg"}
              alt={item.productName || "Product Image"}
              layout="responsive"
              width={100}
              height={105}
              className="rounded-md object-cover"
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-2">{item.productName}</td>
      <td className="px-4 py-2">{item.material || "N/A"}</td>
      <td className="px-4 py-2">{item.size || "N/A"}</td>
      <td className="px-4 py-2">{item.quantity || "0"}</td>
      <td className="px-4 py-2">{item.unitPrice || "0"} VND</td>
      <td className="px-4 py-2">{item.importStatus ? "Done" : "Pending"}</td>
    </tr>
  );

  return (
    <div className="w-full flex flex-col p-4 rounded-md shadow-md">
      {/* General Information */}
      <TitleSession
        icon="flowbite:profile-card-outline"
        title="General Information"
      />
      <div className="w-full p-6 flex flex-col gap-6 ">
        <div className="w-full flex">
          <div className="w-1/5">
            <Image
              alt="avatar"
              src={staff?.avatar || "/assets/images/avatar.jpg"}
              width={115}
              height={130}
              className="rounded-md"
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <LabelInformation
                content={staff?.fullName || ""}
                title="Fullname"
              />
              <LabelInformation
                content={format(new Date(staff?.birthday || new Date()), "PPP")}
                title="Date of Birth"
              />
              <LabelInformation content={staff?.gender || ""} title="Gender" />
            </div>
            <div className="flex flex-col gap-5">
              <LabelInformation content={staff?._id || ""} title="ID" />
              <LabelInformation content={staff?.email || ""} title="Email" />
              <LabelInformation
                content={staff?.phoneNumber || ""}
                title="Phone Number"
              />
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          <LabelInformation content={staff?.address || ""} title="Address" />
          <LabelInformation content={staff?.district || ""} title="City" />
          <LabelInformation content={staff?.province || ""} title="Country" />
        </div>
        <LabelInformation
          content={staff?.experience || ""}
          title="Experience"
        />
      </div>
      {/* Number of sales invoices */}
      <TitleSession icon="humbleicons:money" title="Number of sales invoices" />
      <div className="flex flex-col gap-6 w-full pt-6">
        <TableSearch onSearch={setSearchQuery} onSort={handleSort} />
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

export default StaffInformation;
