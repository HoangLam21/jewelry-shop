// "use client";
// import AddProduct from "@/components/admin/product/AddProduct";
// import ProductList, {
//   ProductData,
// } from "@/components/admin/product/ProductList";
// import Headers from "@/components/shared/header/Headers";
// import React, { useState } from "react";

// const Page = () => {
//   const [openAddProduct, setOpenAddProduct] = useState(false);
//   const [list, setList] = useState<ProductData[]>([]);
//   const handleExport = () => {};

//   const handleAddProduct = () => {
//     setOpenAddProduct(true);
//   };

//   const handleBack = (value: boolean) => {
//     setOpenAddProduct(value);
//   };
//   return (
//     <>
//       <div className="w-full h-full p-4 flex flex-col gap-4">
//         <Headers
//           title="Products"
//           firstIcon="clarity:export-line"
//           titleFirstButton="Export"
//           secondIcon="mingcute:add-line"
//           titleSecondButton="Add Products"
//           onClickFirstButton={handleExport}
//           onClickSecondButton={handleAddProduct}
//           type={2}
//         ></Headers>
//         <ProductList list={list} setList={setList} />
//       </div>

//       {openAddProduct && <AddProduct onBack={handleBack} setList={setList} />}
//     </>
//   );
// };

// export default Page;

"use client";
import AddProduct from "@/components/admin/product/AddProduct";
import ProductList, {
  ProductData,
} from "@/components/admin/product/ProductList";
import Headers from "@/components/shared/header/Headers";
import { fetchProduct } from "@/lib/service/product.service";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const Page = () => {
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [list, setList] = useState<ProductData[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Fetch fresh product data
      const products = await fetchProduct();

      if (!products || products.length === 0) {
        alert("No product data available to export.");
        setIsExporting(false);
        return;
      }

      // Prepare data for export
      const productData = products.map((item: any, index: number) => {
        // Calculate total stock across all variants
        const totalStock =
          item.variants?.reduce((sum: number, variant: any) => {
            const variantStock = variant.sizes?.reduce(
              (sizeSum: number, size: any) => sizeSum + (size.stock || 0),
              0
            );
            return sum + (variantStock || 0);
          }, 0) || 0;

        // Get available materials and sizes
        const materials =
          item.variants?.map((v: any) => v.material).join(", ") || "N/A";
        const sizes =
          item.variants?.[0]?.sizes?.map((s: any) => s.size).join(", ") ||
          "N/A";

        return {
          No: index + 1,
          "Product ID": item._id,
          "Product Name": item.name,
          Category: item.category?.name || "Uncategorized",
          Collection: item.collections || "N/A",
          "Price (VND)": item.cost.toLocaleString("vi-VN"),
          Provider: item.provider?.name || "N/A",
          Materials: materials,
          "Available Sizes": sizes,
          "Total Stock": totalStock,
          Vouchers: item.vouchers?.length || 0,
          "Has Images": item.files?.length > 0 ? "Yes" : "No",
        };
      });

      // Create workbook
      const ws = XLSX.utils.json_to_sheet(productData);

      // Set column widths
      const wscols = [
        { wch: 5 }, // No
        { wch: 25 }, // Product ID
        { wch: 30 }, // Product Name
        { wch: 15 }, // Category
        { wch: 15 }, // Collection
        { wch: 15 }, // Price
        { wch: 20 }, // Provider
        { wch: 25 }, // Materials
        { wch: 20 }, // Available Sizes
        { wch: 12 }, // Total Stock
        { wch: 10 }, // Vouchers
        { wch: 10 }, // Has Images
      ];
      ws["!cols"] = wscols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `products_catalog_${timestamp}.xlsx`;

      // Write file
      XLSX.writeFile(wb, filename);

      // Success notification
      setTimeout(() => {
        alert(
          `Successfully exported ${products.length} products to ${filename}\n\n` +
            `Total Stock: ${productData.reduce((sum: any, p: any) => sum + p["Total Stock"], 0)} units`
        );
        setIsExporting(false);
      }, 500);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
      setIsExporting(false);
    }
  };

  const handleAddProduct = () => {
    setOpenAddProduct(true);
  };

  const handleBack = (value: boolean) => {
    setOpenAddProduct(value);
  };

  return (
    <>
      <div className="w-full h-full p-4 sm:p-6 flex flex-col gap-6">
        <Headers
          title="Products"
          firstIcon={
            isExporting ? "line-md:loading-twotone-loop" : "clarity:export-line"
          }
          titleFirstButton={isExporting ? "Exporting..." : "Export Catalog"}
          secondIcon="mingcute:add-line"
          titleSecondButton="Add Product"
          onClickFirstButton={handleExport}
          onClickSecondButton={handleAddProduct}
          type={2}
        />
        <ProductList list={list} setList={setList} />
      </div>

      {openAddProduct && <AddProduct onBack={handleBack} setList={setList} />}
    </>
  );
};

export default Page;
