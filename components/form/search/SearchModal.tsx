import React, { useState } from "react";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";

const removeDiacritics = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

interface SearchModalProps {
  onClose: () => void;
  productsData: any[];
}

const SearchModal = ({ onClose, productsData }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredProducts = productsData.filter((product) =>
    removeDiacritics(product.name.toLowerCase()).includes(
      removeDiacritics(searchQuery.toLowerCase())
    )
  );

  const handleNavigateProductDetail = (id: string) => {
    onClose();
    router.push(`/product/${id}`);
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex mt-20 justify-center bg-black bg-opacity-50 z-50">
      <div className="p-5 w-full background-light700_dark300 text-dark100_light500">
        <div className="flex items-center border-b pb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full p-2 border rounded"
          />
          <button className="" onClick={onClose}>
            <Icon
              icon="material-symbols:close-rounded"
              width="24"
              height="24"
            />
          </button>
        </div>
        <div className="mt-4 h-[500px] overflow-auto">
          {filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            <ul>
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleNavigateProductDetail(product._id)}
                  className="py-2 flex cursor-pointer"
                >
                  <img
                    src={product.files[0].url}
                    width={30}
                    height={50}
                    className="w-[40px] h-[70px] object-cover"
                  />
                  <div className="ml-4">
                    {" "}
                    <p>{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
