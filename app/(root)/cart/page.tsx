"use client";
import CartCard from "@/components/card/cart/CartCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { getCartByUserId } from "@/lib/services/cart.service";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";

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

interface CartResponse {
  details: Array<{
    productId: string;
    productName: string;
    productFiles: Array<{ url: string }>;
    productCost: number;
    quantity: number;
    productVouchers?: Voucher[];
    productVariants?: Variant[];
    selectedMaterial: string;
    selectedSize: string;
  }>;
}

interface StateItem {
  _id: string;
  name: string;
  files?: Array<{ url: string }>;
  cost: number;
  quantity: number;
  vouchers?: Voucher[];
  variants?: Variant[];
  selectedMaterial?: string;
  selectedSize?: string;
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

export default function Page() {
  const { state } = useCart();
  const router = useRouter();

  // Initialize user state with localStorage data
  const [user] = useState<User | null>(() => getUserFromLocalStorage());
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const formatCartData = (cartData: CartResponse): CartItem[] => {
      return cartData.details.map(
        (detail): CartItem => ({
          _id: detail.productId,
          name: detail.productName,
          images: detail.productFiles[0]?.url || "",
          cost: detail.productCost,
          quantity: detail.quantity,
          vouchers: detail.productVouchers || [],
          variants: detail.productVariants || [],
          selectedMaterial: detail.selectedMaterial,
          selectedSize: detail.selectedSize,
        })
      );
    };

    const formatStateItems = (items: StateItem[]): CartItem[] => {
      return items.map(
        (item): CartItem => ({
          _id: item._id,
          name: item.name,
          images: item.files?.[0]?.url || "",
          cost: item.cost,
          quantity: item.quantity,
          vouchers: item.vouchers || [],
          variants: item.variants || [],
          selectedMaterial: item.selectedMaterial || "",
          selectedSize: item.selectedSize || "",
        })
      );
    };

    let isMounted = true;
    const getCart = async () => {
      try {
        if (user?._id) {
          const data = await getCartByUserId(user._id);
          if (isMounted) {
            const formattedData = formatCartData(data);
            setCart(formattedData);
          }
        } else if (state.items.length > 0) {
          if (isMounted) {
            const formattedState = formatStateItems(state.items);
            setCart(formattedState);
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    getCart();

    return () => {
      isMounted = false;
    };
  }, [user?._id, state.items]);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const calculateItemTotal = (item: CartItem): number => {
    const selectedVariant = item.variants.find(
      (variant: Variant) => variant.material === item.selectedMaterial
    );
    const addOn = selectedVariant?.addOn || 0;
    return (item.cost + addOn) * item.quantity;
  };

  const calculateItemDiscount = (item: CartItem): number => {
    const maxDiscount = item.vouchers.length
      ? Math.max(
        ...item.vouchers.map((voucher: Voucher) => voucher.discount || 0)
      )
      : 0;
    const selectedVariant = item.variants.find(
      (variant: Variant) => variant.material === item.selectedMaterial
    );
    const addOn = selectedVariant?.addOn || 0;
    return ((item.cost + addOn) * item.quantity * maxDiscount) / 100;
  };

  // Memoize calculations để tránh re-calculate mỗi lần render
  const { totalOriginalPrice, totalDiscount, uniqueVouchers, totalFinalPrice } =
    useMemo(() => {
      const originalPrice = cart.reduce((acc: number, item: CartItem) => {
        return acc + calculateItemTotal(item);
      }, 0);

      const discount = cart.reduce((acc: number, item: CartItem) => {
        return acc + calculateItemDiscount(item);
      }, 0);

      const appliedVouchers = cart.flatMap((item: CartItem) =>
        item.vouchers.map((voucher: Voucher) => ({
          name: voucher.name,
          discount: voucher.discount,
        }))
      );

      const uniqueVouchers = Array.from(
        new Map(appliedVouchers.map((v) => [v.name, v])).values()
      );

      const finalPrice = originalPrice - discount;

      return {
        totalOriginalPrice: originalPrice,
        totalDiscount: discount,
        uniqueVouchers,
        totalFinalPrice: finalPrice,
      };
    }, [cart]);

  return (
    <div className="w-full text-dark100_light500">
      {/* Header */}
      <div className="bg-[#EDF1F3] dark:bg-dark-200 h-[250px] flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-dark100_light500 font-light text-5xl sm:text-6xl md:text-7xl lg:text-[84px]">
            CART
          </h1>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Link href="/" className="hover:text-primary-100 transition-colors">
              <span className="text-dark100_light500">Home</span>
            </Link>
            <ChevronRight className="w-5 h-5 text-dark100_light500" />
            <Link href="/cart">
              <span className="text-primary-100">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="mt-10 w-full flex justify-center px-4">
        <div className="w-full max-w-6xl">
          {/* Table Headers - Hidden on mobile */}
          <div className="hidden md:flex w-full mb-10 justify-between px-4">
            <div className="w-1/2">
              <span className="text-lg lg:text-xl font-normal jost">
                PRODUCT
              </span>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-lg lg:text-xl font-normal jost">
                QUANTITY
              </span>
            </div>
            <div className="w-1/4 text-right">
              <span className="text-lg lg:text-xl font-normal jost">
                SUBTOTAL
              </span>
            </div>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">Your cart is empty</p>
              <Link href="/product">
                <Button className="mt-4 bg-primary-100 text-white hover:bg-primary-200">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {cart.map((item: CartItem, index: number) => (
                <CartCard
                  key={`${item._id}-${item.selectedMaterial}-${item.selectedSize}-${index}`}
                  item={item}
                  setCart={setCart}
                />
              ))}

              {/* Summary */}
              <div className="mt-10 w-full flex flex-col space-y-4 bg-gray-50 dark:bg-dark-300 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-normal jost">
                    Total Original Price:
                  </span>
                  <span className="text-xl font-semibold text-primary-100">
                    {totalOriginalPrice.toLocaleString()} ₫
                  </span>
                </div>
                <hr className="border-gray-300 dark:border-gray-600" />

                {uniqueVouchers.length > 0 && (
                  <>
                    <div>
                      <span className="text-lg font-normal jost block mb-2">
                        Applied Vouchers:
                      </span>
                      <ul className="space-y-1">
                        {uniqueVouchers.map((voucher, index: number) => (
                          <li key={index} className="text-sm font-light ml-4">
                            <span className="text-primary-100 font-medium">
                              {voucher.name}
                            </span>
                            <span>: {voucher.discount}% off</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-normal jost">
                        Total Discount:
                      </span>
                      <span className="text-xl font-semibold text-red-500">
                        -{totalDiscount.toLocaleString()} ₫
                      </span>
                    </div>
                    <hr className="border-gray-300 dark:border-gray-600" />
                  </>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold jost">
                    Total Final Price:
                  </span>
                  <span className="text-2xl font-bold text-primary-100">
                    {totalFinalPrice.toLocaleString()} ₫
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 mb-10">
                <Link href="/product" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gray-300 dark:bg-gray-700 text-dark100_light500 hover:bg-gray-400 dark:hover:bg-gray-600 px-8 py-6 rounded-none">
                    CONTINUE SHOPPING
                  </Button>
                </Link>

                <Button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full sm:w-auto bg-primary-100 text-white hover:bg-primary-200 px-8 py-6 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  PROCESS TO CHECKOUT
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
