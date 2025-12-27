"use client";
import ProductCard from "@/components/card/product/ProductCard";
import FilterProduct from "@/components/form/product/FilterProduct";
import { fetchProducts } from "@/lib/services/product.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>(productsData);
  const [sortOption, setSortOption] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    let isMounted = true;
    const getAllProducts = async () => {
      try {
        const data = await fetchProducts();
        if (isMounted) {
          setProductsData(data);
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

  const handleSortChange = (option: string) => {
    setSortOption(option);
    let sortedData = [...filteredData];
    if (option === "price-asc") {
      sortedData.sort((a, b) => a.cost - b.cost);
    } else if (option === "price-desc") {
      sortedData.sort((a, b) => b.cost - a.cost);
    } else if (option === "bestseller") {
      sortedData.sort((a, b) => b.sales - a.sales);
    } else if (option === "rating") {
      sortedData.sort((a, b) => b.rating - a.rating);
    }
    setFilteredData(sortedData);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="bg-[#EDF1F3] dark:bg-dark-200 h-[250px] flex justify-center items-center">
        <div>
          <h1 className="text-dark100_light500 font-light text-[84px]">SHOP</h1>
          <div className="flex justify-center items-center">
            <Link href="/">
              <span className="text-dark100_light500">Home</span>
            </Link>
            <Icon
              icon="solar:alt-arrow-right-line-duotone"
              width="24"
              height="16"
            />
            <Link href="/shop">
              <span className="text-primary-100">Shop</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full block md:flex mt-5">
        <div className="w-full p-4 md:w-[25%] px-14">
          <FilterProduct
            productsData={productsData}
            setFilteredData={setFilteredData}
          />
        </div>
        <div className="w-full md:w-[75%] px-16">
          <div className="flex justify-end items-center mb-5">
            <span className="text-base font-medium mr-3 text-[#939393]">
              Sort By:
            </span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border bg-transparent rounded-md text-dark100_light500"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="bestseller">Best Seller</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-8 justify-center ">
            {displayedItems.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-5">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-primary-100 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
