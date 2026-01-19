import MyButton from "@/components/shared/button/MyButton";
import { useRouter } from "next/navigation";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Voucher } from "@/dto/VoucherDTO";
import Image from "next/image";

interface SaleProps {
  vouchersData: Voucher[];
}

const Sale = ({ vouchersData }: SaleProps) => {
  const router = useRouter();
  const handleNavigateVoucherDetail = (id: string) => {
    console.log("click");
    router.push(`/voucher/${id}`);
  };

  return (
    <div className="bg-[#EDF1F3] dark:bg-dark-200 mt-[150px] flex flex-col lg:flex-row">
      <div className="w-full lg:w-[70%] flex justify-center items-center">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className="w-full"
        >
          {vouchersData.map((voucher: Voucher) => (
            <SwiperSlide key={voucher._id}>
              <div className="mx-[8%] h-72 py-8">
                <div className="flex items-center">
                  <hr className="w-16 border-2 dark:border-dark-100 border-light-500 mt-5 mr-2" />
                  <p className="text-dark100_light500 jost font-light text-[30px]">
                    {voucher.discount}% OFF
                  </p>
                </div>

                <p className="jost text-4xl sm:text-5xl md:text-6xl lg:text-[83px] text-dark100_light500 font-light my-4">
                  {voucher.name}
                </p>
                <div className="w-44 mt-5 mx-auto lg:mx-0">
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
      <div className="w-full lg:w-[30%] hidden lg:block">
        <Image
          src="/assets/images/90bb64145d53a1ca709c0336d0ddc70a.jpg"
          alt="Sale banner"
          width={430}
          height={600}
          className="w-full lg:w-[430px] h-[400px] lg:h-[600px] object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default Sale;
