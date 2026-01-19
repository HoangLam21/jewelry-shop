// "use client";
// import LabelInformation from "@/components/shared/label/LabelInformation";
// import TitleSession from "@/components/shared/label/TitleSession";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { PaginationProps } from "@/types/pagination";
// import TableSearch from "@/components/shared/table/TableSearch";
// import Table from "@/components/shared/table/Table";
// import PaginationUI from "@/types/pagination/Pagination";
// import { CategoryResponse } from "@/dto/CategoryDTO";
// import { getDetailCategory } from "@/lib/service/category.service";
// import { defaultCategory } from "./CategoryList";

// interface productProp {
//   _id: string;
//   fullName: string;
//   cost: number;
// }

// const columns = [
//   { header: "ID", accessor: "id" },
//   {
//     header: "Name",
//     accessor: "name",
//     className: "hidden lg:table-cell",
//   },
//   {
//     header: "Price",
//     accessor: "cost",
//     className: "hidden md:table-cell",
//   },
// ];

// const CategoryInformation = () => {
//   const { id } = useParams() as { id: string };
//   const [detail, setDetail] = useState<CategoryResponse>(defaultCategory); // Store Provider data safely
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 8;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (id) {
//           const result = await getDetailCategory(id);
//           const data: CategoryResponse = {
//             _id: result._id,
//             name: result.name,
//             hot: result.hot,
//             description: result.description,
//             products: result.products.map((item: any, index: number) => ({
//               _id: item._id,
//               fullName: item.name ? item.name : "Unknown name",
//               cost: item.cost ? item.cost : 0,
//             })),
//             createAt: result.createdAt,
//           };
//           console.log(result);
//           setDetail(data);
//         }
//       } catch (error) {
//         console.error("Lỗi khi lấy thông tin nhân viên:", error);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (!detail) {
//     return <p>Loading category information...</p>;
//   }

//   const [sortConfig, setSortConfig] = useState<{
//     key: SortableKeys;
//     direction: "ascending" | "descending";
//   }>({
//     key: "id",
//     direction: "ascending",
//   });
//   type SortableKeys = "id" | "name" | "createAt";

//   const getValueByKey = (item: CategoryResponse, key: SortableKeys) => {
//     switch (key) {
//       case "id":
//         return item._id;
//       case "name":
//         return item.name;
//       case "createAt":
//         return new Date(item.createAt);
//       default:
//         return "";
//     }
//   };

//   if (!detail) {
//     return <p>Loading category information...</p>;
//   }

//   const formatCurrency = (value: number): string => {
//     return new Intl.NumberFormat("vi-VN").format(value) + " vnd";
//   };

//   const filteredproducts = detail.products.filter((item) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       item.fullName.toLowerCase().includes(query) ||
//       formatCurrency(item.cost).toLowerCase().includes(query) ||
//       item._id.toString().includes(query)
//     );
//   });

//   const totalPages = Math.ceil(filteredproducts.length / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const dataLength = filteredproducts.length;
//   const itemsPerPage = 8;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const paginatedproducts = filteredproducts.slice(
//     startIndex,
//     startIndex + rowsPerPage
//   );

//   const paginationUI: PaginationProps = {
//     currentPage,
//     setCurrentPage,
//     indexOfLastItem,
//     indexOfFirstItem,
//     totalPages,
//     dataLength,
//   };
//   const requestSort = (key: SortableKeys) => {
//     let direction: "ascending" | "descending" = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };
//   const handleSort = (key: SortableKeys) => {
//     requestSort(key);
//   };

//   const renderRow = (product: productProp) => (
//     <tr
//       key={product._id}
//       className="border-t border-gray-300 text-sm dark:text-dark-360"
//     >
//       <td className="px-4 py-2 hidden md:table-cell">{product._id}</td>
//       <td className="px-4 py-2">{product.fullName}</td>
//       <td className="hidden px-4 py-2 lg:table-cell">
//         {formatCurrency(product.cost)}
//       </td>
//     </tr>
//   );
//   return (
//     <div className="w-full flex flex-col p-4 rounded-md shadow-md">
//       {/* General Information */}

//       <TitleSession
//         icon="flowbite:profile-card-outline"
//         title="General Information"
//       />

//       <div className="w-full p-6 flex flex-col gap-6 ">
//         <div className="w-full flex">
//           <div className="w-full grid grid-cols-2 gap-5">
//             <div className="flex flex-col gap-5">
//               <LabelInformation content={detail._id} title="ID" />
//               <LabelInformation content={detail.name} title="Name" />
//               <LabelInformation
//                 content={detail.hot ? "Best category" : "Normal"}
//                 title="Hot"
//               />
//             </div>
//             <div className="flex flex-col gap-5">
//               <LabelInformation
//                 content={detail.description || "No description"}
//                 title="Description"
//               />
//               <LabelInformation
//                 content={new Date(detail.createAt).toDateString()}
//                 title="Create at"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <TitleSession icon="humbleicons:money" title="Number of salesitems" />

//       <div className="flex flex-col gap-6 w-full pt-6">
//         <TableSearch
//           onSearch={setSearchQuery}
//           onSort={(searchQuery: string) =>
//             handleSort(searchQuery as SortableKeys)
//           }
//         />
//         <div className="flex flex-col gap-6 w-full">
//           <Table
//             columns={columns}
//             data={paginatedproducts}
//             renderRow={renderRow}
//             onSort={(searchQuery: string) =>
//               handleSort(searchQuery as SortableKeys)
//             }
//           />
//           <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
//             <PaginationUI paginationUI={paginationUI} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryInformation;
"use client";
import LabelInformation from "@/components/shared/label/LabelInformation";
import TitleSession from "@/components/shared/label/TitleSession";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PaginationProps } from "@/types/pagination";
import TableSearch from "@/components/shared/table/TableSearch";
import Table from "@/components/shared/table/Table";
import PaginationUI from "@/types/pagination/Pagination";
import { CategoryResponse } from "@/dto/CategoryDTO";
import { getDetailCategory } from "@/lib/service/category.service";
import { defaultCategory } from "./CategoryList";

interface ProductProp {
  _id: string;
  fullName: string;
  cost: number;
}

interface ProductFromAPI {
  _id: string;
  name: string;
  cost: number;
}

interface CategoryDetailResponse {
  _id: string;
  name: string;
  hot: boolean;
  description?: string;
  products: ProductFromAPI[];
  createdAt: string;
}

type SortableKeys = "id" | "name" | "createAt";

interface SortConfig {
  key: SortableKeys;
  direction: "ascending" | "descending";
}

const columns = [
  { header: "ID", accessor: "id" },
  {
    header: "Name",
    accessor: "name",
    className: "hidden lg:table-cell",
  },
  {
    header: "Price",
    accessor: "cost",
    className: "hidden md:table-cell",
  },
];

const CategoryInformation = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [detail, setDetail] = useState<CategoryResponse>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "ascending",
  });

  const rowsPerPage = 8;
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const result: CategoryDetailResponse = await getDetailCategory(id);
        const data: CategoryResponse = {
          _id: result._id,
          name: result.name,
          hot: result.hot,
          description: result.description || "",
          products: result.products.map(
            (item: ProductFromAPI): ProductProp => ({
              _id: item._id,
              fullName: item.name || "Unknown name",
              cost: item.cost || 0,
            })
          ),
          createAt: new Date(result.createdAt), // Convert string to Date
        };
        console.log(result);
        setDetail(data);
      } catch (error) {
        console.error("Error fetching category information:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        alert(`Error fetching category: ${errorMessage}`);
      }
    };

    fetchData();
  }, [id]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN").format(value) + " vnd";
  };

  const getValueByKey = (
    item: CategoryResponse,
    key: SortableKeys
  ): string | Date => {
    switch (key) {
      case "id":
        return item._id;
      case "name":
        return item.name;
      case "createAt":
        return new Date(item.createAt);
      default:
        return "";
    }
  };

  const requestSort = (key: SortableKeys) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSort = (key: SortableKeys) => {
    requestSort(key);
  };

  const filteredProducts: ProductProp[] = detail.products.filter(
    (item: ProductProp) => {
      const query = searchQuery.toLowerCase();
      return (
        item.fullName.toLowerCase().includes(query) ||
        formatCurrency(item.cost).toLowerCase().includes(query) ||
        item._id.toString().includes(query)
      );
    }
  );

  const totalPages: number = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex: number = (currentPage - 1) * rowsPerPage;
  const dataLength: number = filteredProducts.length;
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const paginatedProducts: ProductProp[] = filteredProducts.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const paginationUI: PaginationProps = {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    totalPages,
    dataLength,
  };

  const renderRow = (product: ProductProp) => (
    <tr
      key={product._id}
      className="border-t border-gray-300 text-sm dark:text-dark-360"
    >
      <td className="px-4 py-2 hidden md:table-cell">{product._id}</td>
      <td className="px-4 py-2">{product.fullName}</td>
      <td className="hidden px-4 py-2 lg:table-cell">
        {formatCurrency(product.cost)}
      </td>
    </tr>
  );

  if (!detail || !id) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500">Loading category information...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-4 rounded-md shadow-md">
      {/* General Information */}
      <TitleSession
        icon="flowbite:profile-card-outline"
        title="General Information"
      />

      <div className="w-full p-6 flex flex-col gap-6">
        <div className="w-full flex">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <LabelInformation content={detail._id} title="ID" />
              <LabelInformation content={detail.name} title="Name" />
              <LabelInformation
                content={detail.hot ? "Best category" : "Normal"}
                title="Hot"
              />
            </div>
            <div className="flex flex-col gap-5">
              <LabelInformation
                content={detail.description || "No description"}
                title="Description"
              />
              <LabelInformation
                content={new Date(detail.createAt).toDateString()}
                title="Create at"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <TitleSession icon="humbleicons:money" title="Number of sales items" />

      <div className="flex flex-col gap-6 w-full pt-6">
        <TableSearch
          onSearch={(query: string) => setSearchQuery(query)}
          onSort={(searchQuery: string) =>
            handleSort(searchQuery as SortableKeys)
          }
        />
        <div className="flex flex-col gap-6 w-full">
          <Table
            columns={columns}
            data={paginatedProducts}
            renderRow={renderRow}
            onSort={(key: string) => handleSort(key as SortableKeys)}
          />
          <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
            <PaginationUI paginationUI={paginationUI} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryInformation;
