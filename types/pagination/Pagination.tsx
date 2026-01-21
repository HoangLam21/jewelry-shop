// "use client";
// import React, { useState } from "react";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious
// } from "@/components/ui/pagination";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { PaginationProps } from ".";
// import { Button } from "@/components/ui/button";

// interface pagination {
//   paginationUI: PaginationProps;
// }

// const PaginationUI: React.FC<pagination> = ({ paginationUI }) => {
//   const {
//     currentPage,
//     setCurrentPage,
//     indexOfFirstItem,
//     indexOfLastItem,
//     totalPages,
//     dataLength
//   } = paginationUI;

//   let displayedPages: any[] = [];
//   let edgePage = 3;
//   if (totalPages <= 5) {
//     // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả các trang
//     displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1);
//   } else {
//     if (currentPage > 3) {
//       let distancePage = totalPages - currentPage;
//       if (distancePage >= 3) {
//         // Nếu trang hiện tại không là 4 trang cuối cùng
//         if (currentPage > edgePage) {
//           displayedPages = [
//             currentPage,
//             currentPage + 1,
//             currentPage + 2,
//             "...",
//             totalPages
//           ];
//           edgePage = edgePage + 3;
//         }
//       } else {
//         displayedPages = ["...", totalPages - 2, totalPages - 1, totalPages];
//       }
//     } else {
//       displayedPages = [1, 2, 3, "...", totalPages];
//     }
//   }

//   return (
//     <div className="flex flex-row bg-transparent w-full justify-between items-center">
//       {totalPages > 0 ? (
//         <div className="flex items-center justify-start text-light-650 text-opacity-40 dark:text-dark-400 dark:text-opacity-80 text-[14px] font-normal">
//           Show {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, dataLength)}{" "}
//           of {dataLength} results
//         </div>
//       ) : (
//         <div className="flex items-center justify-start text-light-650 text-opacity-40 dark:text-dark-400 dark:text-opacity-80 text-[14px] font-normal">
//           Show {dataLength} results
//         </div>
//       )}
//       <div className="flex w-fit h-fit">
//         <Pagination className="mx-auto flex w-full justify-end">
//           <PaginationContent className="flex flex-row items-center justify-end gap-6">
//             <PaginationItem>
//               <Button
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="flex w-fit h-fit bg-transparent hover:bg-transparent shadow-none p-0"
//               >
//                 <Icon
//                   icon="carbon:previous-outline"
//                   width={20}
//                   height={20}
//                   className="dark:text-dark-450 text-light-500"
//                 />
//               </Button>
//             </PaginationItem>

//             {displayedPages.map((page, index) => {
//               if (page === "...") {
//                 return (
//                   <PaginationItem key={`ellipsis`}>
//                     <span className="text-light-500 dark:text-dark-450 text-[14px] font-normal">
//                       ...
//                     </span>
//                   </PaginationItem>
//                 );
//               } else {
//                 return (
//                   <PaginationItem key={page}>
//                     <PaginationLink
//                       href="#"
//                       onClick={() => {
//                         setCurrentPage(page);
//                       }}
//                       className={`${
//                         currentPage === page
//                           ? "active bg-light-600 bg-opacity-30 dark:bg-dark-450 dark:bg-opacity-30 rounded-full items-center justify-center h-fit w-fit px-2 py-1"
//                           : "items-center justify-center h-fit w-fit"
//                       }`}
//                     >
//                       <p className="text-light-500 dark:text-dark-450 text-[14px] font-normal">
//                         {page}
//                       </p>
//                     </PaginationLink>
//                   </PaginationItem>
//                 );
//               }
//             })}

//             <PaginationItem>
//               <Button
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="flex w-fit h-fit bg-transparent hover:bg-transparent shadow-none p-0"
//               >
//                 <Icon
//                   icon="carbon:next-outline"
//                   width={20}
//                   height={20}
//                   className="dark:text-dark-450 text-light-500"
//                 />
//               </Button>
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       </div>
//     </div>
//   );
// };

// export default PaginationUI;

"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PaginationProps } from ".";
import { Button } from "@/components/ui/button";

interface pagination {
  paginationUI: PaginationProps;
}

const PaginationUI: React.FC<pagination> = ({ paginationUI }) => {
  const {
    currentPage,
    setCurrentPage,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    dataLength,
  } = paginationUI;

  let displayedPages: any[] = [];
  let edgePage = 3;

  if (totalPages <= 5) {
    displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage > 3) {
      const distancePage = totalPages - currentPage;
      if (distancePage >= 3) {
        if (currentPage > edgePage) {
          displayedPages = [
            currentPage,
            currentPage + 1,
            currentPage + 2,
            "...",
            totalPages,
          ];
          edgePage = edgePage + 3;
        }
      } else {
        displayedPages = ["...", totalPages - 2, totalPages - 1, totalPages];
      }
    } else {
      displayedPages = [1, 2, 3, "...", totalPages];
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full bg-white dark:bg-dark-300 px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Results Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {totalPages > 0 ? (
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {indexOfFirstItem + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {Math.min(indexOfLastItem, dataLength)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {dataLength}
            </span>{" "}
            results
          </span>
        ) : (
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {dataLength}
            </span>{" "}
            results
          </span>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination className="mx-0">
          <PaginationContent className="flex items-center gap-1">
            {/* Previous Button */}
            <PaginationItem>
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0 bg-white dark:bg-dark-400 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Icon
                  icon="heroicons:chevron-left-20-solid"
                  width={18}
                  height={18}
                  className="text-gray-700 dark:text-gray-300"
                />
              </Button>
            </PaginationItem>

            {/* Page Numbers */}
            {displayedPages.map((page, index) => {
              if (page === "...") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <span className="flex h-9 w-9 items-center justify-center text-gray-500 dark:text-gray-400">
                      •••
                    </span>
                  </PaginationItem>
                );
              } else {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      className={`h-9 w-9 rounded-lg border transition-all ${
                        currentPage === page
                          ? "bg-primary-100 border-primary-100 text-white shadow-lg shadow-primary-100/30 font-semibold"
                          : "bg-white dark:bg-dark-400 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
            })}

            {/* Next Button */}
            <PaginationItem>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0 bg-white dark:bg-dark-400 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Icon
                  icon="heroicons:chevron-right-20-solid"
                  width={18}
                  height={18}
                  className="text-gray-700 dark:text-gray-300"
                />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaginationUI;
