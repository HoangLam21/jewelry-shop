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
import { getCustomerById } from "@/lib/services/customer.service";
import { fetchCategory } from "@/lib/services/category.service";
import { fetchVoucher } from "@/lib/services/voucher.service";

export default function Page() {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [vouchersData, setVouchersData] = useState<any[]>([]);
  useEffect(() => {
    const fetchAndSaveUser = async () => {
      try {
        const userId = "6776bd0974de08ccc866a4ab";
        if (userId) {
          const customerData = await getCustomerById(userId);
          localStorage.setItem("userData", JSON.stringify(customerData));
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchAndSaveUser();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getAllProducts = async () => {
      try {
        const data = await fetchProducts();
        const categories = await fetchCategory();
        const vouchers = await fetchVoucher();
        if (isMounted) {
          setProductsData(data);
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
