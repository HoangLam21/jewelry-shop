"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
    // Redirect admin/staff đến /admin CHỈ KHI vừa login (từ sign-in hoặc callback)
    // Không redirect nếu admin navigate từ trang khác đến home
    if (isLoaded && user && typeof window !== "undefined") {
      const userRole = user.publicMetadata?.role as string | undefined;
      
      if (userRole === "admin" || userRole === "staff") {
        // Chỉ redirect nếu referrer thực sự là từ sign-in hoặc auth/callback
        // Nếu không có referrer hoặc referrer là từ trang khác, thì KHÔNG redirect
        const referrer = document.referrer;
        const isFromSignIn = referrer && (referrer.includes("/sign-in") || referrer.includes("/auth/callback"));
        
        if (isFromSignIn) {
          console.log(`[Home] User is ${userRole}, redirecting to /admin (just logged in from: ${referrer})`);
          // Sử dụng window.location để force redirect
          window.location.href = "/admin";
          return;
        } else {
          // Admin đã navigate từ trang khác, cho phép ở lại home
          console.log(`[Home] User is ${userRole}, staying on home page (referrer: ${referrer || 'none'})`);
        }
      }
    }
  }, [user, isLoaded]);

  useEffect(() => {
    const fetchAndSaveUser = async () => {
      if (!isLoaded || !user) {
        return;
      }

      // Chỉ fetch customer data nếu user là customer
      // Admin và Staff không cần customer data và sẽ bị 403 nếu gọi API này
      const userRole = user.publicMetadata?.role as string | undefined;
      
      // Nếu role không phải customer, skip (không gọi API)
      if (userRole && userRole !== "customer") {
        // Admin/Staff không cần customer data, skip
        console.log(`[Home] User is ${userRole}, skipping customer data fetch`);
        return;
      }

      // Chỉ gọi API nếu:
      // 1. Role là "customer" HOẶC
      // 2. Role chưa được set (có thể là customer mới đăng ký)
      try {
        const customerData = await getCurrentCustomer();
        localStorage.setItem("userData", JSON.stringify(customerData));
      } catch (error: any) {
        // Bắt lỗi 403 (Forbidden) - Admin/Staff không thể gọi API này
        if (error?.message?.includes("Forbidden") || error?.message?.includes("403")) {
          console.log(`[Home] User is not a customer, skipping customer data fetch`);
          return;
        }
        console.error("Error fetching customer data:", error);
        // Không throw error để không block trang
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
