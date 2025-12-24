import { useCart } from "@/contexts/CartContext";
import { addToCart } from "@/lib/services/cart.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductCard = ({ item }: { item: any }) => {
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
    }
  };

  const handleNavigateProductDetail = (id: string) => {
    router.push(`/product/${id}`);
  };

  return (
    <div
      className="relative w-[260px] h-[454px] transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={item.files[0].url}
        alt={item.name}
        onClick={() => handleNavigateProductDetail(item._id)}
        className="w-full h-[350px] mt-2 object-cover"
      />
      <h2 className="text-[20px] jost font-normal uppercase text-dark100_light500">
        {item.name}
      </h2>
      <p className="text-[#939393]">
        {item.variants?.map((variant: any, index: any) => (
          <span key={index}>
            {variant.material}
            {index < item.variants.length - 1 && ", "}
          </span>
        ))}
      </p>
      <p className="text-primary-100 text-[20px] text-right w-full">
        {item.cost} vnđ
      </p>

      {isHovered && (
        <button
          className="absolute w-full bottom-24 left-1/2 transform -translate-x-1/2 bg-primary-100 text-white px-4 py-2 shadow-md transition-all hover:bg-primary-200"
          onClick={() => setIsModalOpen(true)}
        >
          Add to cart
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-dark100_light500 background-light800_dark400 p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-[24px] text-dark100_light500 font-bold jost mb-4">
              Choose Material and Size
            </h3>
            <div className="mb-4">
              <p className="font-semibold text-[20px] jost">Material:</p>
              {item.variants
                .filter(
                  (variant: any) =>
                    variant.sizes.some((size: any) => size.stock > 0) // Kiểm tra nếu bất kỳ size nào của material có stock > 0
                )
                .map((variant: any) => (
                  <button
                    key={variant.material}
                    className={`px-4 py-2 m-2 rounded ${
                      selectedMaterial === variant.material
                        ? "bg-primary-100 text-white"
                        : "bg-gray-200 dark:bg-gray-950"
                    }`}
                    onClick={() => setSelectedMaterial(variant.material)}
                  >
                    {variant.material}
                  </button>
                ))}
            </div>

            {selectedMaterial && (
              <div className="mb-4">
                <p className="font-semibold text-[20px] jost">Size:</p>
                {item.variants
                  .find((variant: any) => variant.material === selectedMaterial)
                  ?.sizes.filter((size: any) => size.stock > 0)
                  .map((size: any) => (
                    <button
                      key={size._id}
                      className={`px-4 py-2 m-2 rounded ${
                        selectedSize === size.size
                          ? "bg-primary-100 text-white"
                          : "bg-gray-200 dark:bg-gray-950"
                      }`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </button>
                  ))}
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded dark:bg-gray-950"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary-100 text-white px-4 py-2 rounded"
                onClick={handleAddToCart}
                disabled={!selectedMaterial || !selectedSize}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;