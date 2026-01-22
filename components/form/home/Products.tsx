import React, { useState } from "react";
import ProductCard from "@/components/card/product/ProductCard";
import { ProductResponse } from "@/dto/ProductDTO";

interface ProductsProps {
  productsData: ProductResponse[];
}

const Products = ({ productsData }: ProductsProps) => {
  const [active, setActive] = useState<"newArrivals" | "bestSeller" | "onSale">(
    "newArrivals"
  );

  const newArrivals = productsData
    .slice()
    .sort(
      (a: ProductResponse, b: ProductResponse) =>
        new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    );

  const bestSeller = productsData
    .slice()
    .sort(
      (a: ProductResponse, b: ProductResponse) =>
        (b.sales || 0) - (a.sales || 0)
    );

  const onSale = productsData
    .slice()
    .filter(
      (product: ProductResponse) =>
        product.vouchers && product.vouchers.length > 0
    )
    .sort(
      (a: ProductResponse, b: ProductResponse) =>
        (b.vouchers?.length || 0) - (a.vouchers?.length || 0)
    );

  const getProducts = (): ProductResponse[] => {
    switch (active) {
      case "newArrivals":
        return newArrivals;
      case "bestSeller":
        return bestSeller;
      case "onSale":
        return onSale;
      default:
        return newArrivals;
    }
  };

  return (
    <div className="mt-[150px] w-[95%] mx-auto">
      <div className="flex items-center mb-6">
        <p className="jost text-[30px] font-normal text-dark100_light500">
          PRODUCTS
        </p>
        <div className="border-b-2 border-primary-100 ml-auto cursor-pointer hover:opacity-80 transition-opacity">
          <p className="font-medium text-dark100_light500 text-[14px] mt-5 pb-1">
            See all
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap gap-6 sm:gap-8 md:gap-12">
          <button
            className={`font-normal jost text-base sm:text-lg md:text-[20px] cursor-pointer transition-colors relative ${
              active === "newArrivals"
                ? "text-primary-100"
                : "text-dark100_light500 hover:text-primary-100/70"
            }`}
            onClick={() => setActive("newArrivals")}
          >
            NEW ARRIVALS
            {active === "newArrivals" && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-100"></span>
            )}
          </button>
          <button
            className={`font-normal jost text-base sm:text-lg md:text-[20px] cursor-pointer transition-colors relative ${
              active === "bestSeller"
                ? "text-primary-100"
                : "text-dark100_light500 hover:text-primary-100/70"
            }`}
            onClick={() => setActive("bestSeller")}
          >
            BEST SELLER
            {active === "bestSeller" && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-100"></span>
            )}
          </button>
          <button
            className={`font-normal jost text-base sm:text-lg md:text-[20px] cursor-pointer transition-colors relative ${
              active === "onSale"
                ? "text-primary-100"
                : "text-dark100_light500 hover:text-primary-100/70"
            }`}
            onClick={() => setActive("onSale")}
          >
            ON SALE
            {active === "onSale" && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-100"></span>
            )}
          </button>
        </div>
      </div>

      <div className="flex w-full overflow-x-auto space-x-4 sm:space-x-6 md:space-x-7 pb-4 scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-gray-200 dark:scrollbar-track-dark-300">
        {getProducts().map((product) => (
          <div
            key={product._id}
            className="min-w-[200px] sm:min-w-[230px] md:min-w-[250px] flex-shrink-0"
          >
            <ProductCard item={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
