"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  defaultDetailProduct,
  ProductData
} from "@/components/admin/product/ProductList";
import { fetchProducts } from "@/lib/services/product.service";
import { ProductResponse } from "@/dto/ProductDTO";
import { fetchProduct } from "@/lib/service/product.service";
import { formatCurrency } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SwiperProductDetail from "@/components/shared/swiper/SwiperProductDetail";

const jewelryRelatedProduct = [
  {
    id: 1,
    name: "Rings",
    image: "/assets/images/793249C01_RGB.jpg"
  },
  {
    id: 2,
    name: "Necklaces",
    image: "/assets/images/B89C2414.jpg"
  },
  {
    id: 3,
    name: "Bracelets",
    image: "/assets/images/193569C00_RGB.jpg"
  },
  {
    id: 4,
    name: "Earrings",
    image: "/assets/images/793249C01_RGB.jpg"
  },
  {
    id: 5,
    name: "Watches",
    image: "/assets/images/793249C01_RGB.jpg"
  },
  {
    id: 6,
    name: "Brooches",
    image: "/assets/images/793249C01_RGB.jpg"
  },
  {
    id: 7,
    name: "Charms",
    image: "/assets/images/793249C01_RGB.jpg"
  }
];

interface props {
  categoryItem: string;
}

const RelatedProduct = ({ categoryItem }: props) => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const [relatedProduct, setRelatedProduct] = useState<ProductData[]>([
    defaultDetailProduct
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: ProductResponse[] = await fetchProduct();
        if (result) {
          const data: ProductData[] = result.map((item) => ({
            id: item._id,
            image: item.files[0].url,
            imageInfo: item.files,
            productName: item.name,
            price: formatCurrency(item.cost),
            collection: item.collections,
            description: item.description,
            vouchers: item.vouchers?.[item.vouchers.length - 1]?._id || "",
            provider: item.provider ? item.provider._id : "",
            category: item.category,
            variants: item.variants
          }));

          const relatedItems = data.filter(
            (item) => item.category === categoryItem && item.id !== id
          );
          if (relatedItems.length === 0) {
            setRelatedProduct(data.slice(0, 6));
          } else if (relatedItems.length > 0 && relatedItems.length < 3) {
            const combinedItem = [...relatedItems, ...data.slice(0, 4)];
            setRelatedProduct(combinedItem);
          }
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        const errorMessage = err?.message || "An unexpected error occurred.";
        alert(`Error fetching data: ${errorMessage}`);
      }
    };

    fetchData();
  }, []);
  const router = useRouter();
  const handleLink = () => {
    router.push(`/product/`);
  };
  return (
    <div className="flex gap-6 flex-col w-[95%] mx-auto">
      <div className="flex">
        <p className="jost text-[30px] font-normal text-dark100_light500">
          RELATED PRODUCTS
        </p>
        <div
          className="border-b-2 border-primary-100 ml-auto cursor-pointer"
          onClick={handleLink}
        >
          <p className="font-medium text-dark100_light500 text-[14px] mt-5">
            See all
          </p>
        </div>
      </div>

      <SwiperProductDetail
        relatedProduct={relatedProduct}
        width="280"
        height="320"
      />
    </div>
  );
};

export default RelatedProduct;
