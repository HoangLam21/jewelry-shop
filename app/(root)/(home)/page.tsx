"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const [productsData, setProductsData] = useState<ProductResponse[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([]);
  const [vouchersData, setVouchersData] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchAndSaveUser = async () => {
      // Chỉ fetch nếu user đã đăng nhập
      if (!isLoaded || !user) {
        return;
      }

      try {
        const customerData = await getCurrentCustomer();
        localStorage.setItem("userData", JSON.stringify(customerData));
      } catch (error) {
        console.error("Error fetching customer data:", error);
        // Không throw error để không block trang nếu user chưa là customer
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
