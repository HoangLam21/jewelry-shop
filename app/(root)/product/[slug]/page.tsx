/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MyButton from "@/components/shared/button/MyButton";
import DetailProduct from "@/components/form/product/DetailProduct";
import RelatedProduct from "@/components/form/product/RelatedProduct";
import { getProductBySlug } from "@/lib/services/product.service";
import { useCart } from "@/contexts/CartContext";
import { useBuyNow } from "@/contexts/BuyNowContext";
import { X, Minus, Plus } from "lucide-react";
import { getReviewById, calculateRatingStats } from "@/lib/services/rating.service";

interface Variant {
  material: string;
  sizes: Size[];
  addOn: number;
  _id: string;
}

interface Size {
  _id: string;
  size: string;
  stock: number;
}

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const Page = () => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>() as { slug: string };
  const [product, setProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuy, setIsBuy] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [ratingStats, setRatingStats] = useState<RatingStats>({
    averageRating: 0,
    totalReviews: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });
  const { dispatch } = useCart();
  const { dispatchBuyNow } = useBuyNow();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);

        // Fetch reviews để tính ratingStats
        if (data?._id) {
          try {
            const reviews = await getReviewById(data._id);
            const stats = calculateRatingStats(reviews);
            setRatingStats(stats);
            console.log("[Product Page] Rating stats calculated:", stats);
          } catch (reviewError) {
            console.error("Error fetching reviews:", reviewError);
            // Giữ nguyên giá trị mặc định nếu không fetch được reviews
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    getProduct();
  }, [slug]);

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity: number) => Math.max(1, prevQuantity - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity: number) => prevQuantity + 1);
  };

  const handleAddToCart = () => {
    if (!selectedMaterial || !selectedSize) {
      alert("Please select both material and size before adding to cart!");
      return;
    }

    if (!product) return;

    const cartItem = {
      _id: product._id,
      name: product.name,
      images: product.files?.[0]?.url || "",
      cost: product.cost,
      quantity: 1,
      vouchers: product.vouchers || [],
      variants: product.variants || [],
      selectedMaterial,
      selectedSize,
    };

    dispatch({
      type: "ADD_TO_CART",
      payload: cartItem,
    });
    alert("Added to cart successfully!");
    setIsModalOpen(false);
    setSelectedMaterial("");
    setSelectedSize("");
  };

  const handleBuyNow = () => {
    if (!selectedMaterial || !selectedSize) {
      alert("Please select both material and size!");
      return;
    }

    if (!product) return;

    const buyNowItem = {
      _id: product._id,
      name: product.name,
      images: product.files?.[0]?.url || "",
      cost: product.cost,
      quantity,
      vouchers: product.vouchers || [],
      variants: product.variants || [],
      selectedMaterial,
      selectedSize,
    };

    dispatchBuyNow({
      type: "BUY_NOW",
      payload: buyNowItem,
    });
    router.push("/checkout/buy");
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
      </div>
    );
  }

  const availableVariants =
    product.variants?.filter((variant: Variant) =>
      variant.sizes.some((size: Size) => size.stock > 0)
    ) || [];

  return (
    <div className="w-full h-full p-4 flex flex-col gap-16">
      <div className="w-full flex gap-8 h-auto lg:h-[692px] flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[692px] items-center">
          <Image
            src={product.files[0].url}
            alt="product image"
            width={692}
            height={692}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-dark100_light500">
            {product.name}
          </h1>

          {/* Rating and Sales Info */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < Math.floor(ratingStats.averageRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                      }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-lg font-semibold text-dark100_light500">
                {ratingStats.averageRating.toFixed(1)}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {ratingStats.totalReviews}{" "}
              {ratingStats.totalReviews === 1 ? "review" : "reviews"}
            </span>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.sales || 0} sold
            </span>
          </div>

          <p className="text-3xl sm:text-4xl font-bold text-primary-100">
            {product.cost.toLocaleString()} VND
          </p>

          <p className="text-base text-dark100_light500 leading-relaxed">
            {product.description}
          </p>

          <div>
            <p className="underline text-xl font-semibold text-dark100_light500 mb-2">
              COLLECTIONS
            </p>
            <p className="text-base text-dark100_light500">
              {product.collections}
            </p>
          </div>

          <div>
            <p className="underline text-xl font-semibold text-dark100_light500 mb-4">
              VARIANTS
            </p>
            <div className="flex flex-col gap-4">
              {product.variants.map((variant: Variant, index: number) => (
                <div
                  key={variant._id}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <p className="font-bold text-dark100_light500 mb-2">
                    Material: {variant.material}
                  </p>
                  <p className="text-dark100_light500 mb-1">Sizes:</p>
                  <ul className="list-disc list-inside">
                    {variant.sizes.map((size: Size) => (
                      <li key={size._id} className="text-dark100_light500">
                        {size.size} - Stock: {size.stock}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-between gap-4 mt-4 flex-col sm:flex-row">
            <MyButton
              title="BUY NOW"
              width="w-full sm:w-1/2"
              event={() => setIsBuy(true)}
              background="bg-primary-100"
              text_color="text-white"
            />
            <MyButton
              title="ADD TO CART"
              width="w-full sm:w-1/2"
              event={() => setIsModalOpen(true)}
              background="bg-black"
              text_color="text-white"
            />
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="text-dark100_light500 background-light800_dark400 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold jost">Choose Options</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedMaterial("");
                  setSelectedSize("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="font-semibold text-lg mb-3">Material:</p>
              <div className="flex flex-wrap gap-2">
                {availableVariants.map((variant: Variant) => (
                  <button
                    key={variant.material}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all ${selectedMaterial === variant.material
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

            {selectedMaterial && (
              <div className="mb-6 animate-in slide-in-from-top-2 duration-200">
                <p className="font-semibold text-lg mb-3">Size:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants
                    ?.find((v: Variant) => v.material === selectedMaterial)
                    ?.sizes.filter((s: Size) => s.stock > 0)
                    .map((size: Size) => (
                      <button
                        key={size._id}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all ${selectedSize === size.size
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

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 bg-gray-300 dark:bg-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedMaterial("");
                  setSelectedSize("");
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-primary-100 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                onClick={handleAddToCart}
                disabled={!selectedMaterial || !selectedSize}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Now Modal */}
      {isBuy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="text-dark100_light500 background-light800_dark400 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold jost">Choose Options</h3>
              <button
                onClick={() => {
                  setIsBuy(false);
                  setSelectedMaterial("");
                  setSelectedSize("");
                  setQuantity(1);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="font-semibold text-lg mb-3">Material:</p>
              <div className="flex flex-wrap gap-2">
                {availableVariants.map((variant: Variant) => (
                  <button
                    key={variant.material}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all ${selectedMaterial === variant.material
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

            {selectedMaterial && (
              <>
                <div className="mb-6 animate-in slide-in-from-top-2 duration-200">
                  <p className="font-semibold text-lg mb-3">Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants
                      ?.find((v: Variant) => v.material === selectedMaterial)
                      ?.sizes.filter((s: Size) => s.stock > 0)
                      .map((size: Size) => (
                        <button
                          key={size._id}
                          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${selectedSize === size.size
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

                <div className="mb-6">
                  <p className="font-semibold text-lg mb-3">Quantity:</p>
                  <div className="flex items-center gap-4">
                    <button
                      className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                      onClick={handleDecreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-medium w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                      onClick={handleIncreaseQuantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 bg-gray-300 dark:bg-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setIsBuy(false);
                  setSelectedMaterial("");
                  setSelectedSize("");
                  setQuantity(1);
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-primary-100 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                onClick={handleBuyNow}
                disabled={!selectedMaterial || !selectedSize}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Components */}
      <DetailProduct
        item={product}
        productId={product._id}
        ratingStats={ratingStats}
      />
      <RelatedProduct categoryItem={product.category} />
    </div>
  );
};

export default Page;