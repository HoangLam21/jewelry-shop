import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper/modules";
import MyButton from "@/components/shared/button/MyButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductResponse } from "@/dto/ProductDTO";

interface ProductsProps {
  productsData: ProductResponse[]; // Sửa từ ProductsData thành productsData
}

const ProductSwiper = ({ productsData }: ProductsProps) => {
  const router = useRouter();

  const sortedProducts = productsData
    .sort(
      (
        a: ProductResponse,
        b: ProductResponse // Sửa từ any thành ProductResponse
      ) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    )
    .slice(0, 3);

  const handleNavigateProductDetail = (id: string) => {
    router.push(`/product/${id}`);
  };

  // Normalize URL to use https for Cloudinary
  const normalizeImageUrl = (url: string): string => {
    if (!url) return url;
    // Replace http:// with https:// for Cloudinary URLs
    return url.replace(/^http:\/\//, "https://");
  };

  return (
    <div className="w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        mousewheel={true}
        keyboard={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        className="w-full h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px] xl:h-[800px] [&_.swiper-button-next]:bg-white/90 [&_.swiper-button-next]:dark:bg-gray-800/90 [&_.swiper-button-next]:w-10 [&_.swiper-button-next]:h-10 [&_.swiper-button-next]:md:w-12 [&_.swiper-button-next]:md:h-12 [&_.swiper-button-next]:rounded-full [&_.swiper-button-next]:shadow-lg [&_.swiper-button-next]:backdrop-blur-sm [&_.swiper-button-next]:hover:bg-white [&_.swiper-button-next]:hover:scale-110 [&_.swiper-button-next]:transition-all [&_.swiper-button-next]:hidden [&_.swiper-button-next]:sm:flex [&_.swiper-button-next]:after:text-sm [&_.swiper-button-next]:after:text-gray-800 [&_.swiper-button-next]:after:dark:text-gray-200 [&_.swiper-button-next]:after:font-bold [&_.swiper-button-prev]:bg-white/90 [&_.swiper-button-prev]:dark:bg-gray-800/90 [&_.swiper-button-prev]:w-10 [&_.swiper-button-prev]:h-10 [&_.swiper-button-prev]:md:w-12 [&_.swiper-button-prev]:md:h-12 [&_.swiper-button-prev]:rounded-full [&_.swiper-button-prev]:shadow-lg [&_.swiper-button-prev]:backdrop-blur-sm [&_.swiper-button-prev]:hover:bg-white [&_.swiper-button-prev]:hover:scale-110 [&_.swiper-button-prev]:transition-all [&_.swiper-button-prev]:hidden [&_.swiper-button-prev]:sm:flex [&_.swiper-button-prev]:after:text-sm [&_.swiper-button-prev]:after:text-gray-800 [&_.swiper-button-prev]:after:dark:text-gray-200 [&_.swiper-button-prev]:after:font-bold [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet]:opacity-60 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:md:w-3 [&_.swiper-pagination-bullet]:md:h-3 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:bg-primary-100 [&_.swiper-pagination-bullet-active]:dark:bg-primary-200 [&_.swiper-pagination-bullet-active]:opacity-100 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:md:w-8 [&_.swiper-pagination-bullet-active]:rounded-full"
      >
        {sortedProducts.map((item, index) => (
          <SwiperSlide key={index} className="h-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8 xl:gap-12 w-full">
                {/* Text Content */}
                <div className="flex justify-center items-center lg:items-start w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
                  <div className="space-y-3 sm:space-y-4 max-w-xl">
                    <div className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-primary-100/10 dark:bg-primary-200/10 rounded-full mb-2">
                      <span className="text-xs font-semibold text-primary-100 dark:text-primary-200 tracking-wider">
                        NEW ARRIVAL
                      </span>
                    </div>

                    <h2 className="jost text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 dark:text-white font-light tracking-wide leading-tight">
                      NEW ITEMS
                    </h2>

                    <p className="jost text-sm sm:text-base md:text-lg lg:text-xl font-medium text-primary-100 dark:text-primary-200 line-clamp-2">
                      {item.name}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 hidden sm:block">
                      Discover our latest collection featuring premium quality
                      and modern design.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-4 sm:mt-6">
                      <div className="w-full sm:w-40">
                        <MyButton
                          title="SHOP NOW"
                          background="background-light500_dark100"
                          rounded="none"
                          text_color="text-dark500_light100"
                          text="text-xs font-semibold tracking-wide"
                          onClick={() => handleNavigateProductDetail(item._id)}
                          width={""}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Content */}
                <div className="flex justify-center lg:justify-end w-full lg:w-1/2 relative order-1 lg:order-2">
                  <div className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px]">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-purple-500/20 dark:from-primary-200/20 dark:to-purple-400/20 rounded-t-full blur-3xl -z-10 scale-110"></div>

                    {/* Main Image */}
                    <div className="relative z-10 group">
                      <Image
                        src={normalizeImageUrl(item.files[0].url)}
                        alt={item.name}
                        width={320}
                        height={450}
                        className="w-full h-auto max-h-[280px] sm:max-h-[320px] md:max-h-[360px] lg:max-h-[400px] aspect-[320/450] rounded-t-full object-cover cursor-pointer hover:scale-105 transition-all duration-500 shadow-2xl ring-4 ring-white/50 dark:ring-gray-800/50 group-hover:shadow-primary-100/50 dark:group-hover:shadow-primary-200/50"
                        onClick={() =>
                          handleNavigateProductDetail(item._id.toString())
                        }
                        priority={index === 0}
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-t-full transition-all duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-semibold text-xs sm:text-sm bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                          Quick View
                        </span>
                      </div>
                    </div>

                    {/* Decorative Circle Image */}
                    <div className="absolute bottom-0 -left-4 sm:-left-6 md:-left-8 z-0 hidden sm:block">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl"></div>
                        <Image
                          src={normalizeImageUrl(item.files[0].url)}
                          alt=""
                          width={160}
                          height={160}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover cursor-pointer hover:scale-110 transition-all duration-500 shadow-xl opacity-80 hover:opacity-100 ring-2 ring-white/30 dark:ring-gray-700/30"
                          onClick={() =>
                            handleNavigateProductDetail(item._id.toString())
                          }
                        />
                      </div>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg animate-pulse">
                      NEW
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSwiper;
