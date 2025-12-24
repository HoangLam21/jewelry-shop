import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import MyButton from "@/components/shared/button/MyButton";
import Image from "next/image";
import { useRouter } from "next/navigation";

const swiper = ({ productsData }: { productsData: any[] }) => {
  const router = useRouter();

  const sortedProducts = productsData
    .sort(
      (a: any, b: any) =>
        new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    )
    .slice(0, 3);

  const handleNavigateProductDetail = (id: string) => {
    router.push(`/product/${id}`);
  };
  return (
    <div>
      <Swiper
        cssMode={true}
        navigation={true}
        mousewheel={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="w-[95%] h-auto p-2 overflow-hidden "
      >
        {sortedProducts.map((item, index) => (
          <SwiperSlide className="px-[3%]" key={index}>
            <div className="w-[90%] flex justify-between items-center">
              <div className="flex justify-center w-[50%]">
                <div>
                  <p className="jost text-[83px] text-black font-light">
                    NEW ITEMS
                  </p>
                  <p className="jost text-[20px] font-normal text-primary-100 mt-2">
                    {item.name}
                  </p>
                  <div className="w-44 mt-5">
                    <MyButton
                      title="SHOP NOW"
                      background="background-light500_dark100"
                      rounded="none"
                      text_color="text-dark500_light100"
                      text="text-sm"
                      onClick={() => handleNavigateProductDetail(item._id)}
                      width={""}
                    ></MyButton>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Image
                  src={item.files[0].url}
                  alt=""
                  width={256}
                  height={256}
                  className="w-[256px] h-[256px] rounded-full absolute mt-[339px] mr-80"
                  onClick={() =>
                    handleNavigateProductDetail(item._id.toString())
                  }
                ></Image>
                <Image
                  src={item.files[0].url}
                  alt=""
                  width={420}
                  height={595}
                  className="w-[420px] h-[595px] rounded-t-full"
                  onClick={() =>
                    handleNavigateProductDetail(item._id.toString())
                  }
                ></Image>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default swiper;