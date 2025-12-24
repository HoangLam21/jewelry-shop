"use client";
import AddProduct from "@/components/admin/product/AddProduct";
import ProductList, {
  ProductData
} from "@/components/admin/product/ProductList";
import Headers from "@/components/shared/header/Headers";
import React, { useState } from "react";

const Page = () => {
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [list, setList] = useState<ProductData[]>([]);
  const handleExport = () => {};

  const handleAddProduct = () => {
    setOpenAddProduct(true);
  };

  const handleBack = (value: boolean) => {
    setOpenAddProduct(value);
  };
  return (
    <>
      <div className="w-full h-full p-4 flex flex-col gap-4">
        <Headers
          title="Products"
          firstIcon="clarity:export-line"
          titleFirstButton="Export"
          secondIcon="mingcute:add-line"
          titleSecondButton="Add Products"
          onClickFirstButton={handleExport}
          onClickSecondButton={handleAddProduct}
          type={2}
        ></Headers>
        <ProductList list={list} setList={setList} />
      </div>

      {openAddProduct && <AddProduct onBack={handleBack} setList={setList} />}
    </>
  );
};

export default Page;
