"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCategoryById } from "@/lib/services/category.service";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/card/product/ProductCard";
import { CategoryResponse } from "@/dto/CategoryDTO";
import { ProductResponse } from "@/dto/ProductDTO";

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "bestseller"
  | "rating";

const Page = () => {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [productsData, setProductsData] = useState<ProductResponse[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (!id) return;

    const getProduct = async () => {
      try {
        const data = await getCategoryById(id);
        setCategory(data);
        setProductsData(data.products || []);
        console.log(data);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    getProduct();
  }, [id]);

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);

    const sortedData: ProductResponse[] = (() => {
      const data = [...productsData];

      switch (option) {
        case "price-asc":
          return data.sort(
            (a: ProductResponse, b: ProductResponse) => a.cost - b.cost
          );
        case "price-desc":
          return data.sort(
            (a: ProductResponse, b: ProductResponse) => b.cost - a.cost
          );
        case "bestseller":
          return data.sort(
            (a: ProductResponse, b: ProductResponse) =>
              (b.sales || 0) - (a.sales || 0)
          );
        // case "rating":
        //   return data.sort((a: ProductResponse, b: ProductResponse) => (b.rating || 0) - (a.rating || 0));
        default:
          return data;
      }
    })();

    setProductsData(sortedData);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages: number = Math.ceil(productsData.length / itemsPerPage);
  const displayedItems: ProductResponse[] = productsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#EDF1F3] dark:bg-dark-200 h-[250px] flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-dark100_light500 font-light text-5xl sm:text-6xl md:text-7xl lg:text-[84px]">
            CATEGORY
          </h1>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Link href="/" className="hover:text-primary-100 transition-colors">
              <span className="text-dark100_light500">Home</span>
            </Link>
            <ChevronRight className="w-5 h-5 text-dark100_light500" />
            <Link
              href="/category"
              className="hover:text-primary-100 transition-colors"
            >
              <span className="text-dark100_light500">Category</span>
            </Link>
            <ChevronRight className="w-5 h-5 text-dark100_light500" />
            <span className="text-primary-100">
              {category?.name || "Loading..."}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-8 md:px-16 py-8">
        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-dark100_light500">
            <span className="text-lg font-medium">
              {productsData.length} Products
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-300 rounded-lg text-dark100_light500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="bestseller">Best Seller</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {displayedItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              No products found in this category
            </p>
            <Link href="/products">
              <button className="mt-4 px-6 py-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200 transition-colors">
                Browse All Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayedItems.map((item: ProductResponse) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                currentPage === 1
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-700 text-dark100_light500 hover:bg-primary-100 hover:text-white"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index: number) => {
              const pageNumber = index + 1;
              // Show first, last, current, and pages around current
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentPage === pageNumber
                        ? "bg-primary-100 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-dark100_light500 hover:bg-primary-100 hover:text-white"
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={index} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                currentPage === totalPages
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-700 text-dark100_light500 hover:bg-primary-100 hover:text-white"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
