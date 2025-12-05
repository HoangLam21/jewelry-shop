"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface SwiperProductProps {
  urlImage: string[]; // Danh sách hình ảnh
  width?: string; // Chiều rộng hình ảnh
  height?: string; // Chiều cao hình ảnh
}

const SwiperProduct = ({ urlImage, width, height }: SwiperProductProps) => {
  const [isPrevDisabled, setIsPrevDisabled] = useState(true); // prevDisabled
  const [isNextDisabled, setIsNextDisabled] = useState(false); // nextDisabled

  const handleSlideChange = (swiper: any) => {
    // Kiểm tra nếu đang ở slide đầu tiên
    if (swiper.isBeginning) {
      setIsPrevDisabled(true); // Disable prev
    } else {
      setIsPrevDisabled(false); // Enable prev
    }

    // Kiểm tra nếu đang ở slide cuối cùng
    if (swiper.isEnd) {
      setIsNextDisabled(true); // Disable next
    } else {
      setIsNextDisabled(false); // Enable next
    }
  };
  const imageWidth = width ? `w-[${width}px]` : "w-[80px]";
  const imageHeight = height ? `h-[${height}px]` : "h-[80px]";
  return (
    <div className="swiper-container relative">
      <Swiper
        className="mySwiper"
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next"
        }} // Sử dụng class cho các nút
        modules={[Navigation]}
        slidesPerView={2}
        spaceBetween={16}
        onSlideChange={handleSlideChange}
      >
        {urlImage.map((item, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <div className={`flex ${imageWidth} ${imageHeight}`}>
              <Image
                src={item}
                alt={`urlImage-${index}`}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <div
        className="swiper-button-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10"
        onClick={(e) => isPrevDisabled && e.preventDefault()}
      >
        <Icon
          icon="ooui:previous-ltr"
          width={28}
          height={28}
          className="text-primary-100"
        />
      </div>
      <div
        className="swiper-button-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10"
        onClick={(e) => isNextDisabled && e.preventDefault()}
      >
        <Icon
          icon="ooui:previous-rtl"
          width={28}
          height={28}
          className="text-primary-100"
        />
      </div>
    </div>
  );
};

export default SwiperProduct;
