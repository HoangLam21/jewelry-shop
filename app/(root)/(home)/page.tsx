"use client";
import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Swiper from "@/components/form/home/Swiper";
import FeaturesSession from "@/components/form/home/FeaturesSession";
import Categories from "@/components/form/home/Categories";
import Products from "@/components/form/home/Products";
import Collections from "@/components/form/home/Collections";
import Sale from "@/components/form/home/Sale";
import { fetchProducts } from "@/lib/services/product.service";
import { getCurrentCustomer } from "@/lib/services/customer.service";
import { fetchCategory } from "@/lib/services/category.service";
import { fetchVoucher } from "@/lib/services/voucher.service";
import { useUser } from "@clerk/nextjs";
import { CategoryResponse } from "@/dto/CategoryDTO";
import { ProductResponse } from "@/dto/ProductDTO";
import { Voucher } from "@/dto/VoucherDTO";

// Skeleton Components
const SwiperSkeleton = () => (
  <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg mb-8"></div>
);

const CategoriesSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
    ))}
  </div>
);

const ProductsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
    ))}
  </div>
);

const SaleSkeleton = () => (
  <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg mb-8"></div>
);

export default function Page() {
  const { user, isLoaded } = useUser();
  const [productsData, setProductsData] = useState<ProductResponse[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([]);
  const [vouchersData, setVouchersData] = useState<Voucher[]>([]);

  const [loading, setLoading] = useState({
    products: true,
    categories: true,
    vouchers: true,
  });

  // Fetch user data
  useEffect(() => {
    const fetchAndSaveUser = async () => {
      if (!isLoaded || !user) {
        return;
      }

      try {
        const customerData = await getCurrentCustomer();
        localStorage.setItem("userData", JSON.stringify(customerData));
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchAndSaveUser();
  }, [user, isLoaded]);

  // Fetch all data - Optimized with parallel requests
  useEffect(() => {
    let isMounted = true;

    const getAllData = async () => {
      try {
        // Gọi tất cả API song song
        const [productsResult, categoriesResult, vouchersResult] =
          await Promise.allSettled([
            fetchProducts(),
            fetchCategory(),
            fetchVoucher(),
          ]);

        if (!isMounted) return;

        // Xử lý products
        if (productsResult.status === "fulfilled") {
          setProductsData(productsResult.value);
          console.log("Producttt", productsResult.value);
          setLoading((prev) => ({ ...prev, products: false }));
        } else {
          console.error("Error loading products:", productsResult.reason);
          setLoading((prev) => ({ ...prev, products: false }));
        }

        // Xử lý categories
        if (categoriesResult.status === "fulfilled") {
          setCategoriesData(categoriesResult.value);
          setLoading((prev) => ({ ...prev, categories: false }));
        } else {
          console.error("Error loading categories:", categoriesResult.reason);
          setLoading((prev) => ({ ...prev, categories: false }));
        }

        // Xử lý vouchers
        if (vouchersResult.status === "fulfilled") {
          setVouchersData(vouchersResult.value);
          setLoading((prev) => ({ ...prev, vouchers: false }));
        } else {
          console.error("Error loading vouchers:", vouchersResult.reason);
          setLoading((prev) => ({ ...prev, vouchers: false }));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Set tất cả loading về false nếu có lỗi
        setLoading({
          products: false,
          categories: false,
          vouchers: false,
        });
      }
    };

    getAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="px-[2%]">
        {loading.products ? (
          <SwiperSkeleton />
        ) : (
          <Swiper productsData={productsData} />
        )}

        <FeaturesSession />

        {loading.categories ? (
          <CategoriesSkeleton />
        ) : (
          <Categories categoriesData={categoriesData} />
        )}
      </div>

      {loading.vouchers ? (
        <SaleSkeleton />
      ) : (
        <Sale vouchersData={vouchersData} />
      )}

      <div className="px-[2%]">
        {loading.products ? (
          <ProductsSkeleton />
        ) : (
          <Products productsData={productsData} />
        )}

        <Collections />
      </div>
    </>
  );
}
