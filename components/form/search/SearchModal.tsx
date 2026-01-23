// import { useState } from "react";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// const removeDiacritics = (str: string) => {
//   return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// };

// interface SearchModalProps {
//   onClose: () => void;
//   productsData: any[];
// }

// const SearchModal = ({ onClose, productsData }: SearchModalProps) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();

//   const filteredProducts = productsData.filter((product) =>
//     removeDiacritics(product.name.toLowerCase()).includes(
//       removeDiacritics(searchQuery.toLowerCase())
//     )
//   );

//   const handleNavigateProductDetail = (id: string) => {
//     onClose();
//     router.push(`/product/${id}`);
//   };
//   return (
//     <div className="fixed top-0 left-0 w-full h-full flex mt-20 justify-center bg-black bg-opacity-50 z-50">
//       <div className="p-5 w-full background-light700_dark300 text-dark100_light500">
//         <div className="flex items-center border-b pb-3">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search products..."
//             className="w-full p-2 border rounded"
//           />
//           <button className="" onClick={onClose}>
//             <Icon
//               icon="material-symbols:close-rounded"
//               width="24"
//               height="24"
//             />
//           </button>
//         </div>
//         <div className="mt-4 h-[500px] overflow-auto">
//           {filteredProducts.length === 0 ? (
//             <p>No products found</p>
//           ) : (
//             <ul>
//               {filteredProducts.map((product) => (
//                 <li
//                   key={product._id}
//                   onClick={() => handleNavigateProductDetail(product._id)}
//                   className="py-2 flex cursor-pointer"
//                 >
//                   <Image
//                     src={product.files?.[0]?.url || "/placeholder.jpg"}
//                     alt={product.name}
//                     width={40}
//                     height={70}
//                     className="object-cover rounded-md"
//                   />

//                   <div className="ml-4">
//                     {" "}
//                     <p>{product.name}</p>
//                     <p className="text-sm text-gray-500">
//                       {product.description}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchModal;

import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  const handleNavigateProductDetail = (slug: string) => {
    onClose();
    // Sử dụng slug thay vì id
    router.push(`/product/${slug}`);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex mt-20 justify-center bg-black bg-opacity-50 z-50">
      <div className="p-5 w-full max-w-3xl background-light700_dark300 text-dark100_light500 rounded-lg shadow-xl">
        {/* Header với Search Input */}
        <div className="flex items-center gap-3 border-b border-gray-300 dark:border-gray-700 pb-3">
          <Icon
            icon="lucide:search"
            className="text-gray-500 text-xl flex-shrink-0"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            autoFocus
            className="w-full p-2 bg-transparent text-dark100_light500 outline-none placeholder:text-gray-400"
          />
          <button
            className="hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full p-1 transition-colors"
            onClick={onClose}
          >
            <Icon icon="lucide:x" className="text-gray-500 text-2xl" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 h-[500px] overflow-auto custom-scrollbar">
          {searchQuery.trim() === "" ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Icon icon="lucide:search" className="text-6xl mb-4 opacity-20" />
              <p>Start typing to search products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Icon
                icon="lucide:package-x"
                className="text-6xl mb-4 opacity-20"
              />
              <p>No products found</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleNavigateProductDetail(product.slug)}
                  className="p-3 flex gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={product.files?.[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark100_light500 truncate group-hover:text-primary-100 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <p className="text-primary-100 font-bold mt-2">
                      {product.cost.toLocaleString()} VND
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex items-center">
                    <Icon
                      icon="lucide:chevron-right"
                      className="text-gray-400 group-hover:text-primary-100 group-hover:translate-x-1 transition-all"
                    />
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
