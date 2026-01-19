// "use client";
// import ProductCard from "@/components/card/product/ProductCard";
// import FilterProduct from "@/components/form/product/FilterProduct";
// import { fetchProducts } from "@/lib/services/product.service";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// const Page = () => {
//   const [productsData, setProductsData] = useState<any[]>([]);
//   const [filteredData, setFilteredData] = useState<any[]>(productsData);
//   const [sortOption, setSortOption] = useState<string>("default");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 9;

//   useEffect(() => {
//     let isMounted = true;
//     const getAllProducts = async () => {
//       try {
//         const data = await fetchProducts();
//         if (isMounted) {
//           setProductsData(data);
//         }
//       } catch (error) {
//         console.error("Error loading posts:", error);
//       }
//     };
//     getAllProducts();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const handleSortChange = (option: string) => {
//     setSortOption(option);
//     let sortedData = [...filteredData];
//     if (option === "price-asc") {
//       sortedData.sort((a, b) => a.cost - b.cost);
//     } else if (option === "price-desc") {
//       sortedData.sort((a, b) => b.cost - a.cost);
//     } else if (option === "bestseller") {
//       sortedData.sort((a, b) => b.sales - a.sales);
//     } else if (option === "rating") {
//       sortedData.sort((a, b) => b.rating - a.rating);
//     }
//     setFilteredData(sortedData);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const displayedItems = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div>
//       <div className="bg-[#EDF1F3] dark:bg-dark-200 h-[250px] flex justify-center items-center">
//         <div>
//           <h1 className="text-dark100_light500 font-light text-[84px]">SHOP</h1>
//           <div className="flex justify-center items-center">
//             <Link href="/">
//               <span className="text-dark100_light500">Home</span>
//             </Link>
//             <Icon
//               icon="solar:alt-arrow-right-line-duotone"
//               width="24"
//               height="16"
//             />
//             <Link href="/shop">
//               <span className="text-primary-100">Shop</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//       <div className="w-full block md:flex mt-5">
//         <div className="w-full p-4 md:w-[25%] px-14">
//           <FilterProduct
//             productsData={productsData}
//             setFilteredData={setFilteredData}
//           />
//         </div>
//         <div className="w-full md:w-[75%] px-16">
//           <div className="flex justify-end items-center mb-5">
//             <span className="text-base font-medium mr-3 text-[#939393]">
//               Sort By:
//             </span>
//             <select
//               value={sortOption}
//               onChange={(e) => handleSortChange(e.target.value)}
//               className="px-3 py-2 border bg-transparent rounded-md text-dark100_light500"
//             >
//               <option value="default">Default</option>
//               <option value="price-asc">Price: Low to High</option>
//               <option value="price-desc">Price: High to Low</option>
//               <option value="bestseller">Best Seller</option>
//               <option value="rating">Rating</option>
//             </select>
//           </div>
//           <div className="flex flex-wrap gap-8 justify-center ">
//             {displayedItems.map((item) => (
//               <ProductCard key={item._id} item={item} />
//             ))}
//           </div>
//           {/* Pagination */}
//           <div className="flex justify-center mt-5">
//             {Array.from({ length: totalPages }, (_, index) => (
//               <button
//                 key={index}
//                 className={`mx-1 px-3 py-2 rounded ${
//                   currentPage === index + 1
//                     ? "bg-primary-100 text-white"
//                     : "bg-gray-200"
//                 }`}
//                 onClick={() => handlePageChange(index + 1)}
//               >
//                 {index + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;
"use client";
import ProductCard from "@/components/card/product/ProductCard";
import FilterProduct from "@/components/form/product/FilterProduct";
import { fetchProducts } from "@/lib/services/product.service";
import { ProductResponse } from "@/dto/ProductDTO";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type SortOption = "default" | "price-asc" | "price-desc" | "bestseller";
// | "rating";

const Page = () => {
  const [productsData, setProductsData] = useState<ProductResponse[]>([]);
  const [filteredData, setFilteredData] = useState<ProductResponse[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  useEffect(() => {
    let isMounted = true;
    const getAllProducts = async () => {
      try {
        const data = await fetchProducts();
        if (isMounted) {
          setProductsData(data);
          setFilteredData(data); // Initialize filteredData with all products
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    getAllProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);

    const sortFunctions: Record<
      SortOption,
      (a: ProductResponse, b: ProductResponse) => number
    > = {
      default: () => 0,
      "price-asc": (a, b) => a.cost - b.cost,
      "price-desc": (a, b) => b.cost - a.cost,
      bestseller: (a, b) => (b.sales || 0) - (a.sales || 0),
      // "rating": (a, b) => (b.rating || 0) - (a.rating || 0),
    };

    const sortedData: ProductResponse[] = [...filteredData].sort(
      sortFunctions[option]
    );
    setFilteredData(sortedData);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages: number = Math.ceil(filteredData.length / itemsPerPage);
  const displayedItems: ProductResponse[] = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#EDF1F3] dark:bg-dark-200 h-[250px] flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-dark100_light500 font-light text-5xl sm:text-6xl md:text-7xl lg:text-[84px]">
            SHOP
          </h1>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Link href="/" className="hover:text-primary-100 transition-colors">
              <span className="text-dark100_light500">Home</span>
            </Link>
            <ChevronRight className="w-5 h-5 text-dark100_light500" />
            <Link href="/shop">
              <span className="text-primary-100">Shop</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex flex-col md:flex-row gap-6 mt-8 px-4 sm:px-6 md:px-8 pb-10">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0">
          <div className="sticky top-4">
            <FilterProduct
              productsData={productsData}
              setFilteredData={setFilteredData}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="text-dark100_light500">
              <span className="text-lg font-medium">
                {filteredData.length}{" "}
                {filteredData.length === 1 ? "Product" : "Products"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">
                Sort By:
              </span>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-300 rounded-lg text-dark100_light500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="bestseller">Best Seller</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {displayedItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No products found</p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayedItems.map((item: ProductResponse) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === 1
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-700 text-dark100_light500 hover:bg-primary-100 hover:text-white"
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index: number) => {
                const pageNumber = index + 1;
                // Show first, last, current, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === pageNumber
                          ? "bg-primary-100 text-white shadow-lg"
                          : "bg-gray-200 dark:bg-gray-700 text-dark100_light500 hover:bg-primary-100 hover:text-white"
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={index} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-700 text-dark100_light500 hover:bg-primary-100 hover:text-white"
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
