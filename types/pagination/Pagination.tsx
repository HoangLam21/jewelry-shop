"use client";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
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
    dataLength
  } = paginationUI;

  let displayedPages: any[] = [];
  let edgePage = 3;
  if (totalPages <= 5) {
    // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả các trang
    displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage > 3) {
      let distancePage = totalPages - currentPage;
      if (distancePage >= 3) {
        // Nếu trang hiện tại không là 4 trang cuối cùng
        if (currentPage > edgePage) {
          displayedPages = [
            currentPage,
            currentPage + 1,
            currentPage + 2,
            "...",
            totalPages
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
    <div className="flex flex-row bg-transparent w-full justify-between items-center">
      {totalPages > 0 ? (
        <div className="flex items-center justify-start text-light-650 text-opacity-40 dark:text-dark-400 dark:text-opacity-80 text-[14px] font-normal">
          Show {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, dataLength)}{" "}
          of {dataLength} results
        </div>
      ) : (
        <div className="flex items-center justify-start text-light-650 text-opacity-40 dark:text-dark-400 dark:text-opacity-80 text-[14px] font-normal">
          Show {dataLength} results
        </div>
      )}
      <div className="flex w-fit h-fit">
        <Pagination className="mx-auto flex w-full justify-end">
          <PaginationContent className="flex flex-row items-center justify-end gap-6">
            <PaginationItem>
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex w-fit h-fit bg-transparent hover:bg-transparent shadow-none p-0"
              >
                <Icon
                  icon="carbon:previous-outline"
                  width={20}
                  height={20}
                  className="dark:text-dark-450 text-light-500"
                />
              </Button>
            </PaginationItem>

            {displayedPages.map((page, index) => {
              if (page === "...") {
                return (
                  <PaginationItem key={`ellipsis`}>
                    <span className="text-light-500 dark:text-dark-450 text-[14px] font-normal">
                      ...
                    </span>
                  </PaginationItem>
                );
              } else {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={() => {
                        setCurrentPage(page);
                      }}
                      className={`${
                        currentPage === page
                          ? "active bg-light-600 bg-opacity-30 dark:bg-dark-450 dark:bg-opacity-30 rounded-full items-center justify-center h-fit w-fit px-2 py-1"
                          : "items-center justify-center h-fit w-fit"
                      }`}
                    >
                      <p className="text-light-500 dark:text-dark-450 text-[14px] font-normal">
                        {page}
                      </p>
                    </PaginationLink>
                  </PaginationItem>
                );
              }
            })}

            <PaginationItem>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex w-fit h-fit bg-transparent hover:bg-transparent shadow-none p-0"
              >
                <Icon
                  icon="carbon:next-outline"
                  width={20}
                  height={20}
                  className="dark:text-dark-450 text-light-500"
                />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationUI;



