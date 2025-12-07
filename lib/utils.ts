import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: string | number): string => {
  const numericPrice =
    typeof price === "string" ? Number(price.replace(/[^\d.-]/g, "")) : price;

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    currencyDisplay: "code",
  }).format(numericPrice);
};

export type SortableKeys<T> = keyof T;

export interface SortConfig<T> {
  key: SortableKeys<T>;
  direction: "ascending" | "descending";
}

export const getValueByKey = <T>(item: T, key: SortableKeys<T>) => {
  return item[key];
};

export const sortData = <T>(data: T[], sortConfig: SortConfig<T>): T[] => {
  return [...data].sort((a, b) => {
    const aValue = getValueByKey(a, sortConfig.key);
    const bValue = getValueByKey(b, sortConfig.key);

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
};

export const filterData = <T>(
  data: T[],
  query: string,
  searchableKeys: SortableKeys<T>[]
): T[] => {
  const lowerCaseQuery = query.toLowerCase();

  return data.filter((item) =>
    searchableKeys.some((key) =>
      String(getValueByKey(item, key)).toLowerCase().includes(lowerCaseQuery)
    )
  );
};

export const formatDate = (date: Date | string): string => {
  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) // Check for a valid date
    ? parsedDate.toISOString()
    : ""; // Return empty string if invalid date
};

export const generateRandomID = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value) + " vnd";
};

export const parseCurrency = (formattedValue: string): number => {
  return Number(
    formattedValue
      .replace(/\./g, "") // Loại bỏ dấu chấm (phân cách hàng nghìn)
      .replace(/[^\d-]/g, "") // Loại bỏ các ký tự không phải số và dấu `-`
  );
};
