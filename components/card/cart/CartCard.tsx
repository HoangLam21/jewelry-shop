// import React, { useEffect, useState } from "react";
// import { Icon } from "@iconify/react";
// import Image from "next/image";
// import { useCart } from "@/contexts/CartContext";
// import {
//   decreaseProductQuantity,
//   increaseProductQuantity,
//   removeProductFromCart,
// } from "@/lib/services/cart.service";

// const CartCard = ({ item, setCart }: any) => {
//   const { dispatch } = useCart();
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("userData");
//     if (userData) {
//       try {
//         const parsedData = JSON.parse(userData);
//         setUser(parsedData);
//       } catch (error) {
//         console.error("Failed to parse user data from localStorage:", error);
//       }
//     }
//   }, []);

//   const handleIncreaseQuantity = async () => {
//     if (user?._id) {
//       try {
//         await increaseProductQuantity(
//           user._id,
//           item._id,
//           item.selectedMaterial,
//           item.selectedSize
//         );
//         setCart((prevCart: any) =>
//           prevCart.map((product: any) =>
//             product?._id === item?._id &&
//             product?.selectedMaterial === item?.selectedMaterial &&
//             product?.selectedSize === item?.selectedSize
//               ? { ...product, quantity: product?.quantity + 1 }
//               : product
//           )
//         );
//         // Optionally: fetch updated cart and dispatch
//       } catch (error) {
//         console.error("Failed to increase quantity:", error);
//       }
//     } else {
//       dispatch({ type: "INCREASE_QUANTITY", payload: item._id });
//     }
//   };

//   const handleDecreaseQuantity = async () => {
//     if (user?._id) {
//       try {
//         await decreaseProductQuantity(
//           user._id,
//           item._id,
//           item.selectedMaterial,
//           item.selectedSize
//         );
//         setCart((prevCart: any) =>
//           prevCart.map((product: any) =>
//             product?._id === item?._id &&
//             product?.selectedMaterial === item?.selectedMaterial &&
//             product?.selectedSize === item?.selectedSize &&
//             product?.quantity > 1
//               ? { ...product, quantity: product?.quantity - 1 }
//               : product
//           )
//         );
//       } catch (error) {
//         console.error("Failed to decrease quantity:", error);
//       }
//     } else {
//       dispatch({ type: "DECREASE_QUANTITY", payload: item._id });
//     }
//   };

//   const handleRemoveFromCart = async () => {
//     if (user?._id) {
//       try {
//         await removeProductFromCart(
//           user._id,
//           item._id,
//           item.selectedMaterial,
//           item.selectedSize
//         );

//         setCart((prevCart: any) =>
//           prevCart.filter(
//             (product: any) =>
//               !(
//                 product._id === item._id &&
//                 product.selectedMaterial === item.selectedMaterial &&
//                 product.selectedSize === item.selectedSize
//               )
//           )
//         );
//       } catch (error) {
//         console.error("Error removing product:", error);
//       }
//     } else {
//       dispatch({ type: "REMOVE_FROM_CART", payload: item._id });
//     }
//   };

//   const selectedVariant = item.variants?.find(
//     (variant: { material: string }) =>
//       variant.material === item.selectedMaterial
//   );
//   const basePriceWithAddOn = item.cost + (selectedVariant?.addOn || 0);

//   const maxDiscount = item.vouchers?.reduce(
//     (max: number, voucher: { discount: number }) =>
//       voucher.discount > max ? voucher.discount : max,
//     0
//   );
//   const effectiveDiscount = maxDiscount || item.discount || 0;

//   const discountedPrice =
//     basePriceWithAddOn - (basePriceWithAddOn * effectiveDiscount) / 100;

//   return (
//     <>
//       <hr className="mb-4"></hr>
//       <div className="flex w-[95%] justify-between mb-4">
//         <div className="w-[35%] flex items-center">
//           <div>
//             <Image
//               src={item?.images}
//               alt={item.name}
//               width={151}
//               height={188}
//               className="object-cover w-[151px] h-[188px]"
//             />
//           </div>
//           <div className="ml-4">
//             <div className="ml-4">
//               <span className="text-[20px] font-normal jost">{item.name}</span>
//               <hr className="border-transparent" />
//               <span className="text-primary-100">{discountedPrice}</span>
//               <br />
//               <span className="text-gray-500 line-through">
//                 {basePriceWithAddOn}
//               </span>
//               <hr className="border-none"></hr>
//               <span>
//                 {item.selectedMaterial}, {item.selectedSize}
//               </span>
//             </div>
//           </div>
//         </div>
//         <div className="w-[15%] flex items-center justify-center">
//           <button
//             className="px-2 background-light700_dark300"
//             onClick={handleDecreaseQuantity}
//           >
//             -
//           </button>
//           <span className="text-[16px] font-normal jost mx-2">
//             {item.quantity}
//           </span>
//           <button
//             className="px-2 background-light700_dark300"
//             onClick={handleIncreaseQuantity}
//           >
//             +
//           </button>
//         </div>
//         <div className="w-[25%] flex items-center justify-end">
//           <span className="text-[28px] font-medium text-primary-100">
//             {(discountedPrice || item.cost) * item.quantity}
//           </span>
//         </div>
//         <div className="w-[5%] flex items-center justify-center">
//           <button className="" onClick={handleRemoveFromCart}>
//             <Icon
//               icon="material-symbols:close-rounded"
//               width="24"
//               height="24"
//             />
//           </button>
//         </div>
//       </div>
//       <hr className="mt-2"></hr>
//     </>
//   );
// };

// export default CartCard;
import React, { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import {
  decreaseProductQuantity,
  increaseProductQuantity,
  removeProductFromCart,
} from "@/lib/services/cart.service";

interface Voucher {
  _id: string;
  name: string;
  discount: number;
}

interface Variant {
  material: string;
  addOn: number;
  _id: string;
}

interface CartItem {
  _id: string;
  name: string;
  images: string;
  cost: number;
  quantity: number;
  vouchers: Voucher[];
  variants: Variant[];
  selectedMaterial: string;
  selectedSize: string;
}

interface User {
  _id: string;
  name?: string;
  email?: string;
}

interface CartCardProps {
  item: CartItem;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// Helper function to get user from localStorage
const getUserFromLocalStorage = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData) as User;
    }
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
  }
  return null;
};

const CartCard = ({ item, setCart }: CartCardProps) => {
  const { dispatch } = useCart();
  // Initialize user state with localStorage data using lazy initialization
  const [user] = useState<User | null>(() => getUserFromLocalStorage());

  const handleIncreaseQuantity = async () => {
    if (user?._id) {
      try {
        await increaseProductQuantity(
          user._id,
          item._id,
          item.selectedMaterial,
          item.selectedSize
        );
        setCart((prevCart: CartItem[]) =>
          prevCart.map((product: CartItem) =>
            product._id === item._id &&
            product.selectedMaterial === item.selectedMaterial &&
            product.selectedSize === item.selectedSize
              ? { ...product, quantity: product.quantity + 1 }
              : product
          )
        );
      } catch (error) {
        console.error("Failed to increase quantity:", error);
      }
    } else {
      dispatch({ type: "INCREASE_QUANTITY", payload: item._id });
    }
  };

  const handleDecreaseQuantity = async () => {
    if (user?._id) {
      try {
        await decreaseProductQuantity(
          user._id,
          item._id,
          item.selectedMaterial,
          item.selectedSize
        );
        setCart((prevCart: CartItem[]) =>
          prevCart.map((product: CartItem) =>
            product._id === item._id &&
            product.selectedMaterial === item.selectedMaterial &&
            product.selectedSize === item.selectedSize &&
            product.quantity > 1
              ? { ...product, quantity: product.quantity - 1 }
              : product
          )
        );
      } catch (error) {
        console.error("Failed to decrease quantity:", error);
      }
    } else {
      dispatch({ type: "DECREASE_QUANTITY", payload: item._id });
    }
  };

  const handleRemoveFromCart = async () => {
    if (user?._id) {
      try {
        await removeProductFromCart(
          user._id,
          item._id,
          item.selectedMaterial,
          item.selectedSize
        );

        setCart((prevCart: CartItem[]) =>
          prevCart.filter(
            (product: CartItem) =>
              !(
                product._id === item._id &&
                product.selectedMaterial === item.selectedMaterial &&
                product.selectedSize === item.selectedSize
              )
          )
        );
      } catch (error) {
        console.error("Error removing product:", error);
      }
    } else {
      dispatch({ type: "REMOVE_FROM_CART", payload: item._id });
    }
  };

  const selectedVariant: Variant | undefined = item.variants?.find(
    (variant: Variant) => variant.material === item.selectedMaterial
  );
  const basePriceWithAddOn: number = item.cost + (selectedVariant?.addOn || 0);

  const maxDiscount: number =
    item.vouchers?.reduce(
      (max: number, voucher: Voucher) =>
        voucher.discount > max ? voucher.discount : max,
      0
    ) || 0;

  const discountedPrice: number =
    basePriceWithAddOn - (basePriceWithAddOn * maxDiscount) / 100;

  return (
    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-4">
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-0 md:justify-between">
        {/* Product Info */}
        <div className="w-full md:w-1/2 flex gap-4">
          <div className="relative w-32 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={item.images || "/placeholder.jpg"}
              alt={item.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <span className="text-lg font-normal jost line-clamp-2">
              {item.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-primary-100">
                {discountedPrice.toLocaleString()} ₫
              </span>
              {maxDiscount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {basePriceWithAddOn.toLocaleString()} ₫
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span>{item.selectedMaterial}</span>
              <span className="mx-1">•</span>
              <span>{item.selectedSize}</span>
            </div>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="w-full md:w-1/4 flex md:justify-center items-center">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
            <button
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDecreaseQuantity}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-base font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={handleIncreaseQuantity}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtotal & Remove */}
        <div className="w-full md:w-1/4 flex justify-between md:justify-end items-center gap-4">
          <span className="text-xl md:text-2xl font-semibold text-primary-100">
            {(discountedPrice * item.quantity).toLocaleString()} ₫
          </span>
          <button
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors group"
            onClick={handleRemoveFromCart}
            aria-label="Remove from cart"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
