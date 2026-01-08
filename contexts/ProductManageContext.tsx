"use client";
import { createContext, useContext, useState } from "react";

export interface SelectionListProduct {
  id: string;
  name: string;
}

const collectionData: SelectionListProduct[] = [
  { name: "Spring", id: "Spring" },
  { name: "Summer", id: "Summer" },
  { name: "Autumn", id: "Autumn" },
  { name: "Winter", id: "Winter" },
  { name: "None", id: "" }
];

// Tạo kiểu cho context
interface ProductManageContextType {
  providerList: SelectionListProduct[];
  setProviderList: React.Dispatch<React.SetStateAction<SelectionListProduct[]>>;
  voucherList: SelectionListProduct[];
  setVoucherList: React.Dispatch<React.SetStateAction<SelectionListProduct[]>>;
  collectionList: SelectionListProduct[];
  setCollectionList: React.Dispatch<
    React.SetStateAction<SelectionListProduct[]>
  >;
}

// Tạo context
const ProductManageContext = createContext<
  ProductManageContextType | undefined
>(undefined);

// Provider component
export const ProductManageProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [providerList, setProviderList] = useState<SelectionListProduct[]>([]);
  const [voucherList, setVoucherList] = useState<SelectionListProduct[]>([]);
  const [collectionList, setCollectionList] =
    useState<SelectionListProduct[]>(collectionData);
  
  return (
    <ProductManageContext.Provider
      value={{
        providerList,
        setProviderList,
        voucherList,
        setVoucherList,
        collectionList,
        setCollectionList
      }}
    >
      {children}
    </ProductManageContext.Provider>
  );
};

// Hook để sử dụng context
export const useProductManageContext = (): ProductManageContextType => {
  const context = useContext(ProductManageContext);
  if (!context) {
    throw new Error(
      "useProductManageContext must be used within a ProductManageProvider"
    );
  }
  return context;
};
