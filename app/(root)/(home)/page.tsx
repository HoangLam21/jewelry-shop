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

export default function Page() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [productsData, setProductsData] = useState<ProductResponse[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([]);
  const [vouchersData, setVouchersData] = useState<Voucher[]>([]);

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
      // Chỉ fetch nếu user đã đăng nhập
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

  useEffect(() => {
    let isMounted = true;
    const getAllProducts = async () => {
      try {
        const data = await fetchProducts();
        const categories = await fetchCategory();
        const vouchers = await fetchVoucher();
        if (isMounted) {
          setProductsData(data);
          console.log(data);
          setCategoriesData(categories);
          setVouchersData(vouchers);
          // console.log(vouchers);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    getAllProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="px-[2%]">
        <Swiper productsData={productsData} />
        <FeaturesSession />
        <Categories categoriesData={categoriesData} />
      </div>

      <Sale vouchersData={vouchersData} />
      <div className="px-[2%]">
        <Products productsData={productsData} />
        <Collections />
      </div>
    </>
  );
}
