"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { ProductData } from "@/components/admin/product/ProductList";
import { useRouter } from "next/navigation";

interface SwiperProductProps {
  relatedProduct: ProductData[];
  width?: string; // Chiều rộng hình ảnh
  height?: string; // Chiều cao hình ảnh
}

const SwiperProductDetail = ({
  relatedProduct,
  width,
  height
}: SwiperProductProps) => {
  const [isPrevDisabled, setIsPrevDisabled] = useState(true); // prevDisabled
  const [isNextDisabled, setIsNextDisabled] = useState(false); // nextDisabled

  const handleSlideChange = (swiper: any) => {
    if (swiper.isBeginning) {
      setIsPrevDisabled(true);
    } else {
      setIsPrevDisabled(false);
    }

    if (swiper.isEnd) {
      setIsNextDisabled(true);
    } else {
      setIsNextDisabled(false);
    }
  };
  const imageWidth = width ? `w-[${width}px]` : "w-[80px]";
  const imageHeight = height ? `h-[${height}px]` : "h-[80px]";
  const router = useRouter();
  const handleLink = (id: string) => {
    router.push(`/product/${id}`);
  };
  return (
    <div className="swiper-container1 relative">
      <Swiper
        className="mySwiper1"
        navigation={{
          prevEl: ".swiper-button-prev1",
          nextEl: ".swiper-button-next1"
        }} // Sử dụng class cho các nút
        modules={[Navigation]}
        slidesPerView={5}
        spaceBetween={32}
        onSlideChange={handleSlideChange}
      >
        {relatedProduct.map((item, index) => (
          <SwiperSlide
            key={index}
            className="swiper-slide1"
            style={{ width: "auto", marginRight: 0 }}
          >
            <div
              className={`flex ${imageWidth} ${imageHeight}`}
              onClick={() => handleLink(item.id)}
            >
              <Image
                src={item.image}
                alt={`urlImage-${index}`}
                width={Number(width)}
                height={Number(height)}
                className="rounded-lg object-cover"
              />
            </div>
            <p className=" text-lg jost capitalize font-nomal mt-2 text-dark100_light500">
              {item.price}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <div
        className="swiper-button-prev1 absolute top-1/2 left-0 transform -translate-y-1/2 z-10"
        onClick={(e) => isPrevDisabled && e.preventDefault()}
      >
        <Icon
          icon="ooui:previous-ltr"
          width={40}
          height={40}
          className="text-primary-100"
        />
      </div>
      <div
        className="swiper-button-next1 absolute top-1/2 right-0 transform -translate-y-1/2 z-10"
        onClick={(e) => isNextDisabled && e.preventDefault()}
      >
        <Icon
          icon="ooui:previous-rtl"
          width={40}
          height={40}
          className="text-primary-100"
        />
      </div>
    </div>
  );
};

export default SwiperProductDetail;
