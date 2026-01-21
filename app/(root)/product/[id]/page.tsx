// "use client";

// import Image from "next/image";
// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import MyButton from "@/components/shared/button/MyButton";
// import DetailProduct from "@/components/form/product/DetailProduct";
// import RelatedProduct from "@/components/form/product/RelatedProduct";
// import { getProductById } from "@/lib/services/product.service";
// import { useCart } from "@/contexts/CartContext";
// import { useBuyNow } from "@/contexts/BuyNowContext";
// import { ProductResponse } from "@/dto/ProductDTO";
// import { X, Minus, Plus } from "lucide-react";

// interface Voucher {
//   _id: string;
//   name: string;
//   discount: number;
// }

// interface Size {
//   _id: string;
//   size: string;
//   stock: number;
// }

// interface Variant {
//   material: string;
//   addOn: number;
//   sizes: Size[];
//   _id: string;
// }

// const Page = () => {
//   const router = useRouter();
//   const params = useParams();
//   const id = params?.id as string | undefined;

//   const [product, setProduct] = useState<ProductResponse | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [isBuy, setIsBuy] = useState<boolean>(false);
//   const [selectedMaterial, setSelectedMaterial] = useState<string>("");
//   const [selectedSize, setSelectedSize] = useState<string>("");
//   const [quantity, setQuantity] = useState<number>(1);

//   const { dispatch } = useCart();
//   const { dispatchBuyNow } = useBuyNow();

//   useEffect(() => {
//     if (!id) return;

//     const getProduct = async () => {
//       try {
//         const data = await getProductById(id);
//         setProduct(data);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };
//     getProduct();
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!selectedMaterial || !selectedSize) {
//       alert("Please select both material and size before adding to cart!");
//       return;
//     }

//     if (!product) return;

//     // Map ProductResponse to CartItem format
//     const cartItem = {
//       _id: product._id,
//       name: product.name,
//       images: product.files?.[0]?.url || "", // Map files to images
//       cost: product.cost,
//       quantity: 1,
//       vouchers: product.vouchers || [],
//       variants: product.variants || [],
//       selectedMaterial,
//       selectedSize,
//     };

//     dispatch({
//       type: "ADD_TO_CART",
//       payload: cartItem,
//     });
//     alert("Added to cart successfully!");
//     setIsModalOpen(false);
//     setSelectedMaterial("");
//     setSelectedSize("");
//   };

//   const handleDecreaseQuantity = () => {
//     setQuantity((prevQuantity: number) => Math.max(1, prevQuantity - 1));
//   };

//   const handleIncreaseQuantity = () => {
//     setQuantity((prevQuantity: number) => prevQuantity + 1);
//   };

//   const handleBuyNow = () => {
//     if (!selectedMaterial || !selectedSize) {
//       alert("Please select both material and size!");
//       return;
//     }

//     if (!product) return;

//     // Map ProductResponse to BuyNowItem format
//     const buyNowItem = {
//       _id: product._id,
//       name: product.name,
//       images: product.files?.[0]?.url || "", // Map files to images
//       cost: product.cost,
//       quantity,
//       vouchers: product.vouchers || [],
//       variants: product.variants || [],
//       selectedMaterial,
//       selectedSize,
//     };

//     dispatchBuyNow({
//       type: "BUY_NOW",
//       payload: buyNowItem,
//     });
//     router.push("/checkout/buy");
//   };

//   if (!product) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-xl text-gray-500">Loading product information...</p>
//       </div>
//     );
//   }

//   const availableVariants =
//     product.variants?.filter((variant: Variant) =>
//       variant.sizes.some((size: Size) => size.stock > 0)
//     ) || [];

//   return (
//     <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 flex flex-col gap-12 md:gap-16">
//       {/* Product Details */}
//       <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
//         {/* Product Image */}
//         <div className="w-full lg:w-1/2">
//           <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
//             <Image
//               src={product.files?.[0]?.url || "/placeholder.jpg"}
//               alt={product.name}
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 100vw, 50vw"
//               priority
//             />
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6">
//           <h1 className="text-2xl sm:text-3xl font-normal text-dark100_light500">
//             {product.name}
//           </h1>

//           <p className="text-3xl sm:text-4xl font-semibold text-primary-100">
//             {product.cost.toLocaleString()} VND
//           </p>

//           <p className="text-base text-dark100_light500 leading-relaxed">
//             {product.description}
//           </p>

//           {product.collections && (
//             <div>
//               <p className="text-xl font-medium text-dark100_light500 mb-2">
//                 COLLECTIONS
//               </p>
//               <p className="text-base text-dark100_light500">
//                 {product.collections}
//               </p>
//             </div>
//           )}

//           {product.variants && product.variants.length > 0 && (
//             <div>
//               <p className="text-xl font-medium text-dark100_light500 mb-3">
//                 VARIANTS
//               </p>
//               <div className="space-y-4">
//                 {product.variants.map((variant: Variant, index: number) => (
//                   <div
//                     key={index}
//                     className="bg-gray-50 dark:bg-dark-300 p-4 rounded-lg"
//                   >
//                     <p className="font-semibold text-dark100_light500 mb-2">
//                       Material: {variant.material}
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       {variant.sizes.map((size: Size, idx: number) => (
//                         <span
//                           key={idx}
//                           className="px-3 py-1 text-sm bg-white dark:bg-dark-400 rounded-full text-dark100_light500"
//                         >
//                           {size.size} ({size.stock} in stock)
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {product.vouchers && product.vouchers.length > 0 && (
//             <div>
//               <p className="text-xl font-medium text-dark100_light500 mb-3">
//                 VOUCHERS
//               </p>
//               <div className="space-y-2">
//                 {product.vouchers.map((voucher: Voucher) => (
//                   <div
//                     key={voucher._id}
//                     className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg"
//                   >
//                     <span className="text-red-600 dark:text-red-400 font-medium">
//                       {voucher.name} - {voucher.discount}% OFF
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <p className="text-base text-gray-600 dark:text-gray-400">
//             {product.sales || 0} sales
//           </p>

//           {/* Action Buttons */}
//           <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
//             <MyButton
//               title="BUY NOW"
//               width="w-full sm:w-1/2"
//               event={() => setIsBuy(true)}
//               background="bg-primary-100"
//               text_color="text-white"
//             />
//             <MyButton
//               title="ADD TO CART"
//               width="w-full sm:w-1/2"
//               event={() => setIsModalOpen(true)}
//               background="bg-black"
//               text_color="text-white"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Add to Cart Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="text-dark100_light500 background-light800_dark400 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-2xl font-bold jost">Choose Options</h3>
//               <button
//                 onClick={() => {
//                   setIsModalOpen(false);
//                   setSelectedMaterial("");
//                   setSelectedSize("");
//                 }}
//                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="mb-6">
//               <p className="font-semibold text-lg mb-3">Material:</p>
//               <div className="flex flex-wrap gap-2">
//                 {availableVariants.map((variant: Variant) => (
//                   <button
//                     key={variant.material}
//                     className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
//                       selectedMaterial === variant.material
//                         ? "bg-primary-100 text-white shadow-lg"
//                         : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
//                     }`}
//                     onClick={() => {
//                       setSelectedMaterial(variant.material);
//                       setSelectedSize("");
//                     }}
//                   >
//                     {variant.material}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {selectedMaterial && (
//               <div className="mb-6">
//                 <p className="font-semibold text-lg mb-3">Size:</p>
//                 <div className="flex flex-wrap gap-2">
//                   {product.variants
//                     ?.find((v: Variant) => v.material === selectedMaterial)
//                     ?.sizes.filter((s: Size) => s.stock > 0)
//                     .map((size: Size) => (
//                       <button
//                         key={size._id}
//                         className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
//                           selectedSize === size.size
//                             ? "bg-primary-100 text-white shadow-lg"
//                             : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
//                         }`}
//                         onClick={() => setSelectedSize(size.size)}
//                       >
//                         {size.size}
//                       </button>
//                     ))}
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-3 mt-6">
//               <button
//                 className="flex-1 bg-gray-300 dark:bg-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-700"
//                 onClick={() => {
//                   setIsModalOpen(false);
//                   setSelectedMaterial("");
//                   setSelectedSize("");
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="flex-1 bg-primary-100 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleAddToCart}
//                 disabled={!selectedMaterial || !selectedSize}
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Buy Now Modal */}
//       {isBuy && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="text-dark100_light500 background-light800_dark400 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-2xl font-bold jost">Choose Options</h3>
//               <button
//                 onClick={() => {
//                   setIsBuy(false);
//                   setSelectedMaterial("");
//                   setSelectedSize("");
//                   setQuantity(1);
//                 }}
//                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="mb-6">
//               <p className="font-semibold text-lg mb-3">Material:</p>
//               <div className="flex flex-wrap gap-2">
//                 {availableVariants.map((variant: Variant) => (
//                   <button
//                     key={variant.material}
//                     className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
//                       selectedMaterial === variant.material
//                         ? "bg-primary-100 text-white shadow-lg"
//                         : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
//                     }`}
//                     onClick={() => {
//                       setSelectedMaterial(variant.material);
//                       setSelectedSize("");
//                     }}
//                   >
//                     {variant.material}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {selectedMaterial && (
//               <>
//                 <div className="mb-6">
//                   <p className="font-semibold text-lg mb-3">Size:</p>
//                   <div className="flex flex-wrap gap-2">
//                     {product.variants
//                       ?.find((v: Variant) => v.material === selectedMaterial)
//                       ?.sizes.filter((s: Size) => s.stock > 0)
//                       .map((size: Size) => (
//                         <button
//                           key={size._id}
//                           className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
//                             selectedSize === size.size
//                               ? "bg-primary-100 text-white shadow-lg"
//                               : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
//                           }`}
//                           onClick={() => setSelectedSize(size.size)}
//                         >
//                           {size.size}
//                         </button>
//                       ))}
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <p className="font-semibold text-lg mb-3">Quantity:</p>
//                   <div className="flex items-center gap-4">
//                     <button
//                       className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
//                       onClick={handleDecreaseQuantity}
//                       disabled={quantity <= 1}
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                     <span className="text-xl font-medium w-12 text-center">
//                       {quantity}
//                     </span>
//                     <button
//                       className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
//                       onClick={handleIncreaseQuantity}
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}

//             <div className="flex gap-3 mt-6">
//               <button
//                 className="flex-1 bg-gray-300 dark:bg-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-700"
//                 onClick={() => {
//                   setIsBuy(false);
//                   setSelectedMaterial("");
//                   setSelectedSize("");
//                   setQuantity(1);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="flex-1 bg-primary-100 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleBuyNow}
//                 disabled={!selectedMaterial || !selectedSize}
//               >
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Additional Components */}
//       <DetailProduct item={product} />
//       <RelatedProduct categoryItem={product.category} />
//     </div>
//   );
// };

// export default Page;

"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MyButton from "@/components/shared/button/MyButton";
import DetailProduct from "@/components/form/product/DetailProduct";
import RelatedProduct from "@/components/form/product/RelatedProduct";
import { getProductById } from "@/lib/services/product.service";
import {
  getReviewById,
  calculateRatingStats,
} from "@/lib/services/rating.service";
import { useCart } from "@/contexts/CartContext";
import { useBuyNow } from "@/contexts/BuyNowContext";
import { ProductResponse } from "@/dto/ProductDTO";
import { X, Minus, Plus, Star } from "lucide-react";

interface Voucher {
  _id: string;
  name: string;
  discount: number;
}

interface Size {
  _id: string;
  size: string;
  stock: number;
}

interface Variant {
  material: string;
  addOn: number;
  sizes: Size[];
  _id: string;
}

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isBuy, setIsBuy] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Rating states
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const { dispatch } = useCart();
  const { dispatchBuyNow } = useBuyNow();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Fetch product
        const productData = await getProductById(id);
        setProduct(productData);

        // Fetch reviews and calculate stats
        const reviews = await getReviewById(id);
        const stats = calculateRatingStats(reviews);
        setRatingStats(stats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

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

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity: number) => Math.max(1, prevQuantity - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity: number) => prevQuantity + 1);
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
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 flex flex-col gap-12 md:gap-16">
      {/* Product Details */}
      <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Product Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
            <Image
              src={product.files?.[0]?.url || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-dark100_light500 mb-3">
              {product.name}
            </h1>

            {/* Rating Display */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(ratingStats.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                      }`}
                    />
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
          </div>

          <p className="text-3xl sm:text-4xl font-bold text-primary-100">
            {product.cost.toLocaleString()} VND
          </p>

          <div className="bg-gray-50 dark:bg-dark-400 rounded-lg p-4">
            <p className="text-base text-dark100_light500 leading-relaxed">
              {product.description}
            </p>
          </div>

          {product.collections && (
            <div className="bg-white dark:bg-dark-300 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                COLLECTION
              </p>
              <p className="text-base text-dark100_light500 font-medium">
                {product.collections}
              </p>
            </div>
          )}

          {product.variants && product.variants.length > 0 && (
            <div className="bg-white dark:bg-dark-300 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                AVAILABLE VARIANTS
              </p>
              <div className="space-y-3">
                {product.variants.map((variant: Variant, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-dark-400 p-3 rounded-lg"
                  >
                    <p className="font-semibold text-dark100_light500 mb-2">
                      Material: {variant.material}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variant.sizes.map((size: Size, idx: number) => (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 text-sm rounded-full ${
                            size.stock > 0
                              ? "bg-white dark:bg-dark-300 text-dark100_light500 border border-gray-200 dark:border-gray-600"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-400 line-through"
                          }`}
                        >
                          {size.size} ({size.stock})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.vouchers && product.vouchers.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                🎉 AVAILABLE VOUCHERS
              </p>
              <div className="space-y-2">
                {product.vouchers.map((voucher: Voucher) => (
                  <div
                    key={voucher._id}
                    className="bg-white dark:bg-dark-300 px-3 py-2 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {voucher.name}
                    </span>
                    <span className="text-red-700 dark:text-red-300 font-bold">
                      -{voucher.discount}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
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

      {/* Modals - giữ nguyên như cũ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="text-dark100_light500 background-light800_dark400 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold jost">Choose Options</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedMaterial("");
                  setSelectedSize("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="font-semibold text-lg mb-3">Material:</p>
              <div className="flex flex-wrap gap-2">
                {availableVariants.map((variant: Variant) => (
                  <button
                    key={variant.material}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                      selectedMaterial === variant.material
                        ? "bg-primary-100 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
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
              <div className="mb-6">
                <p className="font-semibold text-lg mb-3">Size:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants
                    ?.find((v: Variant) => v.material === selectedMaterial)
                    ?.sizes.filter((s: Size) => s.stock > 0)
                    .map((size: Size) => (
                      <button
                        key={size._id}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                          selectedSize === size.size
                            ? "bg-primary-100 text-white shadow-lg"
                            : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
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
                className="flex-1 bg-gray-300 dark:bg-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-700"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedMaterial("");
                  setSelectedSize("");
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-primary-100 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={!selectedMaterial || !selectedSize}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Now Modal - tương tự */}
      {isBuy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="text-dark100_light500 background-light800_dark400 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold jost">Choose Options</h3>
              <button
                onClick={() => {
                  setIsBuy(false);
                  setSelectedMaterial("");
                  setSelectedSize("");
                  setQuantity(1);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
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
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                      selectedMaterial === variant.material
                        ? "bg-primary-100 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
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
                <div className="mb-6">
                  <p className="font-semibold text-lg mb-3">Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants
                      ?.find((v: Variant) => v.material === selectedMaterial)
                      ?.sizes.filter((s: Size) => s.stock > 0)
                      .map((size: Size) => (
                        <button
                          key={size._id}
                          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                            selectedSize === size.size
                              ? "bg-primary-100 text-white shadow-lg"
                              : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
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
                      className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                      onClick={handleDecreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-medium w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
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
                className="flex-1 bg-gray-300 dark:bg-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-700"
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
                className="flex-1 bg-primary-100 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <DetailProduct item={product} productId={id!} ratingStats={ratingStats} />
      <RelatedProduct categoryItem={product.category} />
    </div>
  );
};

export default Page;
