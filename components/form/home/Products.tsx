import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductCard from "@/components/card/product/ProductCard";

const Products = ({ productsData }: { productsData: any[] }) => {
  const [active, setActive] = useState("newArrivals");

  const newArrivals = productsData
    .slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    );

  const bestSeller = productsData
    .slice()
    .sort((a: any, b: any) => b.sales - a.sales);

  const onSale = productsData
    .slice()
    .filter((product: any) => product.vouchers?.length > 0)
    .sort((a: any, b: any) => b.vouchers.length - a.vouchers.length);

  const getProducts = () => {
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
      <div className="flex">
        <p className="jost text-[30px] font-normal text-dark100_light500">
          PRODUCTS
        </p>
        <div className="border-b-2 border-primary-100 ml-auto">
          <p className="font-medium text-dark100_light500 text-[14px] mt-5">
            See all
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex mt-4">
          <div
            className={`font-normal jost text-[20px] cursor-pointer mr-12 ${
              active === "newArrivals"
                ? "text-primary-100"
                : "text-dark100_light500"
            }`}
            onClick={() => setActive("newArrivals")}
          >
            NEW ARRIVALS
          </div>
          <div
            className={`font-normal jost text-[20px] cursor-pointer mr-12 ${
              active === "bestSeller"
                ? "text-primary-100"
                : "text-dark100_light500"
            }`}
            onClick={() => setActive("bestSeller")}
          >
            BEST SELLER
          </div>
          <div
            className={`font-normal jost text-[20px] cursor-pointer ${
              active === "onSale" ? "text-primary-100" : "text-dark100_light500"
            }`}
            onClick={() => setActive("onSale")}
          >
            ON SALE
          </div>
        </div>
      </div>
      {/* <Swiper
        spaceBetween={20}
        slidesPerView={4}
        // navigation={true}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        className="mt-[30px] w-full "
      > */}
      <div className="flex w-full overflow-x-auto space-x-7 mt-4">
        {getProducts().map((product) => (
          <div key={product._id} className="min-w-[250px]">
            {/* Adjust width to your needs */}
            <ProductCard key={product._id} item={product} />
          </div>
        ))}
      </div>

      {/* </Swiper> */}
    </div>
  );
};

export default Products;