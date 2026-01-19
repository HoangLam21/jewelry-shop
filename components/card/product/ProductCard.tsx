import { useCart } from "@/contexts/CartContext";
import { addToCart } from "@/lib/services/cart.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProductResponse } from "@/dto/ProductDTO";
import Image from "next/image";
import { X } from "lucide-react";

interface ProductCardProps {
  item: ProductResponse;
}

interface Variant {
  material: string;
  sizes: Array<{ _id: string; size: string; stock: number }>;
  addOn: number;
  _id: string;
}

const ProductCard = ({ item }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const { dispatch } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUser(parsedData);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  const handleAddToCart = () => {
    if (selectedMaterial && selectedSize) {
      if (user) {
        addToCart(user._id, item._id, 1, selectedMaterial, selectedSize);
      } else {
        dispatch({
          type: "ADD_TO_CART",
          payload: {
            ...item,
            selectedMaterial,
            selectedSize,
            quantity: 1,
          },
        });
      }
      setIsModalOpen(false);
      setSelectedMaterial("");
      setSelectedSize("");
    }
  };

  const handleNavigateProductDetail = (id: string) => {
    router.push(`/product/${id}`);
  };

  return (
    <>
      <div
        className="relative w-full max-w-[260px] h-auto group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Background */}
        <div className="relative w-full h-[350px] overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 mb-3">
          <Image
            src={item.files[0]?.url || "/placeholder.jpg"}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onClick={() => handleNavigateProductDetail(item._id)}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

          {/* Sale Badge */}
          {item.vouchers && item.vouchers.length > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              SALE
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2 px-1">
          <h2
            className="text-lg jost font-normal uppercase text-dark100_light500 line-clamp-1 hover:text-primary-100 transition-colors"
            onClick={() => handleNavigateProductDetail(item._id)}
          >
            {item.name}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {item.variants?.map((variant: Variant, index: number) => (
              <span key={variant._id}>
                {variant.material}
                {index < item.variants.length - 1 && ", "}
              </span>
            ))}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-primary-100 text-xl font-semibold">
              {item.cost.toLocaleString()} ₫
            </p>
            {item.sales && item.sales > 0 && (
              <span className="text-xs text-gray-500">{item.sales} sold</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className={`absolute bottom-[100px] left-0 right-0 mx-4 bg-primary-100 text-white py-2.5 rounded-lg shadow-lg transition-all duration-300 font-medium hover:bg-primary-200 hover:shadow-xl transform ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          Add to Cart
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="background-light800_dark400 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 background-light800_dark400 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl text-dark100_light500 font-bold jost">
                Choose Options
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Preview */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.files[0]?.url || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-dark100_light500 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-primary-100 font-bold">
                    {item.cost.toLocaleString()} ₫
                  </p>
                </div>
              </div>

              {/* Material Selection */}
              <div>
                <p className="font-semibold text-lg jost text-dark100_light500 mb-3">
                  Material:
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.variants
                    ?.filter((variant: Variant) =>
                      variant.sizes.some((size) => size.stock > 0)
                    )
                    .map((variant: Variant) => (
                      <button
                        key={variant._id}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                          selectedMaterial === variant.material
                            ? "bg-primary-100 text-white shadow-lg scale-105"
                            : "bg-gray-200 dark:bg-gray-800 text-dark100_light500 hover:bg-gray-300 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          setSelectedMaterial(variant.material);
                          setSelectedSize("");
                        }}
                      >
                        {variant.material}
                      </button>
                    ))}
                </div>
              </div>

              {/* Size Selection */}
              {selectedMaterial && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <p className="font-semibold text-lg jost text-dark100_light500 mb-3">
                    Size:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.variants
                      ?.find(
                        (variant: Variant) =>
                          variant.material === selectedMaterial
                      )
                      ?.sizes.filter((size) => size.stock > 0)
                      .map((size) => (
                        <button
                          key={size._id}
                          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                            selectedSize === size.size
                              ? "bg-primary-100 text-white shadow-lg scale-105"
                              : "bg-gray-200 dark:bg-gray-800 text-dark100_light500 hover:bg-gray-300 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setSelectedSize(size.size)}
                        >
                          {size.size}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 background-light800_dark400 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button
                className="flex-1 bg-gray-200 dark:bg-gray-800 text-dark100_light500 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedMaterial("");
                  setSelectedSize("");
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-primary-100 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                onClick={handleAddToCart}
                disabled={!selectedMaterial || !selectedSize}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
