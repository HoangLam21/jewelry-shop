import MyButton from "@/components/shared/button/MyButton";
import { useRouter } from "next/navigation";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const Sale = ({ vouchersData }: { vouchersData: any[] }) => {
  const router = useRouter();
  const handleNavigateVoucherDetail = (id: string) => {
    console.log("click");
    router.push(`/voucher/${id}`);
  };
  return (
    <div className="bg-[#EDF1F3] dark:bg-dark-200 mt-[150px] flex">
      <div className="w-[70%] flex justify-center items-center">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className="w-full"
        >
          {vouchersData.map((voucher: any) => (
            <SwiperSlide key={voucher._id}>
              <div className="mx-[8%] h-72 ">
                <div className="flex">
                  <hr className="w-16 border-2 dark:border-dark-100 border-light-500 mt-5 mr-2" />
                  <p className="text-dark100_light500 jost font-light text-[30px]">
                    {voucher.discount}% OFF
                  </p>
                </div>

                <p className="jost text-[83px] text-dark100_light500 font-light">
                  {voucher.name}
                </p>
                <div className="w-44 mt-5 mx-auto">
                  <MyButton
                    title="SHOP SALE"
                    background="background-light500_dark100"
                    rounded="none"
                    text_color="text-dark500_light100"
                    text="text-sm"
                    onClick={() => handleNavigateVoucherDetail(voucher._id)}
                    width=""
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="w-[30%]">
        <img
          src="/assets/images/b8f853f6c53f6d0b10f11436826fd0bb.jpg"
          alt=""
          className="w-[430px] h-[600px] object-cover"
        />
      </div>
    </div>
  );
};

export default Sale;