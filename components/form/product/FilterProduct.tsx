"use client";
import React, { useEffect, useState } from "react";

interface Filter {
  type: string;
  value: string;
  label: string;
}

const FilterProduct = ({ productsData, setFilteredData }: any) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);

  const handleFilterChange = (type: string, value: string) => {
    setSelectedFilters((prevFilters) => {
      const existingFilter = prevFilters.find((filter) => filter.type === type);

      if (existingFilter) {
        if (value === "") {
          return prevFilters.filter((filter) => filter.type !== type);
        }
        return prevFilters.map((filter) =>
          filter.type === type
            ? { ...filter, value, label: `${type}: ${value}` }
            : filter
        );
      }

      if (value !== "") {
        return [...prevFilters, { type, value, label: `${type}: ${value}` }];
      }

      return prevFilters;
    });
  };

  const removeFilter = (filterToRemove: any) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.filter((filter) => filter !== filterToRemove)
    );
  };

  useEffect(() => {
    const filteredData = productsData?.filter((item: any) => {
      const matchesQuery = searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesFilters = selectedFilters.every((filter) => {
        if (filter.type === "collection") {
          return item.collections?.toLowerCase() === filter.value.toLowerCase();
        }
        if (filter.type === "material") {
          return item.variants.some(
            (variant: any) =>
              variant.material?.toLowerCase() === filter.value.toLowerCase()
          );
        }
        if (filter.type === "size") {
          return item.variants.some((variant: any) =>
            variant.sizes.some(
              (size: any) =>
                size.name?.toLowerCase() === filter.value.toLowerCase()
            )
          );
        }
        if (filter.type === "cost") {
          const cost = item.cost;
          if (filter.value === "Less than 10M") return cost < 10000000;
          if (filter.value === "10M - 20M")
            return cost >= 10000000 && cost <= 20000000;
          if (filter.value === "More than 20M") return cost > 20000000;
        }
        return false;
      });

      return matchesQuery && matchesFilters;
    });

    setFilteredData(filteredData);
  }, [searchQuery, selectedFilters, productsData, setFilteredData]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-dark-300 dark:border-gray-600 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="mb-4 p-4 rounded-md">
        <h2 className="text-[20px] text-dark100_light500 font-medium mb-2 underline">
          SELECTED FILTERS
        </h2>
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-100 text-white rounded-full text-sm flex items-center gap-2"
            >
              {filter.label}
              <button
                onClick={() => removeFilter(filter)}
                className="text-white"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 rounded-md">
        <div className="mb-4 mt-[24px]">
          <h2 className="text-[20px] text-dark100_light500 underline mb-2">
            COLLECTIONS
          </h2>
          <div className="flex flex-col gap-2 mb-4">
            {["Spring", "Summer", "Autumn", "Winter"].map((collection) => (
              <button
                key={collection}
                className={`text-left text-[16px] py-1 ${
                  selectedFilters.find(
                    (filter) =>
                      filter.type === "collection" &&
                      filter.value === collection
                  )
                    ? "text-primary-100"
                    : "text-dark100_light500"
                }`}
                onClick={() => handleFilterChange("collection", collection)}
              >
                {collection}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 mt-[24px]">
          <h2 className="text-[20px] text-dark100_light500 font-medium mb-2 underline">
            MATERIALS
          </h2>
          <div className="flex flex-col gap-2 mb-4">
            {["Wood", "Metal", "Gold", "Silver"].map((material) => (
              <button
                key={material}
                className={`py-1 text-left text-[16px] ${
                  selectedFilters.find(
                    (filter) =>
                      filter.type === "material" && filter.value === material
                  )
                    ? "text-primary-100"
                    : "text-dark100_light500"
                }`}
                onClick={() => handleFilterChange("material", material)}
              >
                {material}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 mt-[24px]">
          <h3 className="text-[20px] text-dark100_light500 font-medium mb-2 underline">
            PRICES
          </h3>
          <div className="flex flex-col gap-2 mb-4">
            {["Less than 10M", "10M - 20M", "More than 20M"].map((price) => (
              <button
                key={price}
                className={`py-1 text-left text-[16px] ${
                  selectedFilters.find(
                    (filter) => filter.type === "cost" && filter.value === price
                  )
                    ? "text-primary-100"
                    : "text-dark100_light500"
                }`}
                onClick={() => handleFilterChange("cost", price)}
              >
                {price}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterProduct;
