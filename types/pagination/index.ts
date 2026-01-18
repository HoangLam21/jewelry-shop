import React from "react";

export interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  indexOfLastItem: number;
  indexOfFirstItem: number;
  totalPages: number;
  dataLength: number;
}

export interface TableProps {
  indexOfLastItem: number;
  indexOfFirstItem: number;
  filterInput: string;
  inputValue: string;
}

