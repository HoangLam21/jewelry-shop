"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import {
  getCartByUserId,
  removeProductFromCart,
} from "@/lib/services/cart.service";
import { payVNPay } from "@/lib/service/vnpay.service";
import ShippingInfomation from "@/components/form/checkout/ShippingInformation";

interface Voucher {
  _id: string;
  name: string;
  discount: number;
}

interface Variant {
  material: string;
  addOn: number;
  sizes: Array<{
    size: string;
    stock: number;
  }>;
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

type PaymentMethod = "cod" | "vnpay";
type DeliveryMethod = "standard" | "fast" | "express";

function addDays(days: number): Date {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
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
  const { state, dispatch } = useCart();
  const [user] = useState<User | null>(() => getUserFromLocalStorage());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalOriginalPrice, setTotalOriginalPrice] = useState<number>(0);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [totalFinalPrice, setTotalFinalPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("standard");
  const [city, setCity] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const router = useRouter();

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

  useEffect(() => {
    const { originalPrice, discount, finalPrice } = cart.reduce(
      (totals, item: CartItem) => {
        const selectedVariant = item.variants.find(
          (variant: Variant) => variant.material === item.selectedMaterial
        );

        const basePrice = item.cost * item.quantity;
        const addOnPrice = (selectedVariant?.addOn || 0) * item.quantity;

        const voucher = item.vouchers?.[0];
        const voucherDiscount = voucher
          ? (basePrice + addOnPrice) * (voucher.discount / 100)
          : 0;

        return {
          originalPrice: totals.originalPrice + basePrice + addOnPrice,
          discount: totals.discount + voucherDiscount,
          finalPrice:
            totals.finalPrice + (basePrice + addOnPrice - voucherDiscount),
        };
      },
      { originalPrice: 0, discount: 0, finalPrice: 0 }
    );

    setTotalOriginalPrice(originalPrice);
    setTotalDiscount(discount);
    setTotalFinalPrice(finalPrice);
  }, [cart]);

  useEffect(() => {
    const calculateShippingFee = (): number => {
      if (deliveryMethod === "express") return 70000;
      if (deliveryMethod === "fast") return 35000;
      return paymentMethod === "vnpay" ? 25000 : 30000;
    };
    setShippingFee(calculateShippingFee());
  }, [deliveryMethod, paymentMethod]);

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!address || !phoneNumber || !city) {
      alert("Please fill in all shipping information");
      return;
    }

    const details = cart.map((item: CartItem) => ({
      id: item._id,
      material: item.selectedMaterial,
      size: item.selectedSize,
      unitPrice: item.cost,
      quantity: item.quantity,
      discount: item.vouchers?.[0]?.discount || 0,
    }));

    const orderData = {
      cost: totalFinalPrice + shippingFee,
      discount: totalDiscount,
      details,
      status: "pending",
      shippingMethod: deliveryMethod,
      ETD: addDays(3),
      customer: user?._id || "", // Customer ID sẽ được tự động set bởi API từ user đang đăng nhập
      staff: "", // Staff ID sẽ được tự động set bởi API từ user đang đăng nhập (nếu là staff/admin)
      phoneNumber,
      note,
      address,
    };

    console.log(orderData, "check before API");

    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        alert("Order can't be created. Please try again.");
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      // Remove all items from cart
      for (const item of cart) {
        await handleRemoveFromCart(item);
      }

      if (paymentMethod === "vnpay") {
        const payment = await payVNPay(data._id, totalFinalPrice + shippingFee);
        router.push(payment.url);
      } else {
        alert("Order created successfully!");
        router.push("/product");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const handleRemoveFromCart = async (item: CartItem) => {
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

  const calculateGrandTotal = (): number => totalFinalPrice + shippingFee;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#EDF1F3] dark:bg-dark-200 h-[250px] flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-dark100_light500 font-light text-5xl sm:text-6xl md:text-7xl lg:text-[84px]">
            CHECKOUT
          </h1>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Link href="/" className="hover:text-primary-100 transition-colors">
              <span className="text-dark100_light500">Home</span>
            </Link>
            <ChevronRight className="w-5 h-5 text-dark100_light500" />
            <Link href="/checkout">
              <span className="text-primary-100">Checkout</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex text-dark100_light500 flex-col lg:flex-row justify-between w-full px-4 sm:px-6 md:px-10 pb-10 gap-8">
        {/* Shipping Information */}
        <div className="lg:w-[45%] w-full p-5 rounded-lg">
          <h2 className="text-2xl sm:text-3xl font-normal jost mb-5">
            SHIPPING INFORMATION
          </h2>
          <form onSubmit={handleOrder} className="flex flex-col space-y-4">
            <ShippingInfomation
              setAddress={setAddress}
              setPhoneNumber={setPhoneNumber}
              setNote={setNote}
              setCity={setCity}
            />

            <button
              type="submit"
              className="bg-primary-100 text-white p-3 hover:bg-primary-200 transition-colors font-medium rounded-lg"
              disabled={cart.length === 0}
            >
              Confirm & Proceed to Payment
            </button>
          </form>
        </div>

        {/* Order Information */}
        <div className="lg:w-[50%] w-full p-5 rounded-lg">
          <h2 className="text-2xl sm:text-3xl font-normal jost mb-6">
            ORDER INFORMATION
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
              <Link href="/product">
                <button className="mt-4 px-6 py-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200">
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item: CartItem, index: number) => (
                  <div
                    key={`${item._id}-${index}`}
                    className="flex items-center justify-between border-b pb-4 gap-4"
                  >
                    <div className="relative w-20 h-24 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={item.images || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.selectedMaterial} • {item.selectedSize}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-primary-100">
                      {formatCurrency(item.cost * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 dark:bg-dark-300 p-4 rounded-lg space-y-3">
                <div className="flex justify-between text-base">
                  <span>Total Original Price:</span>
                  <span>{formatCurrency(totalOriginalPrice)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-base">
                    <span>Total Discount:</span>
                    <span className="text-red-500">
                      -{formatCurrency(totalDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totalFinalPrice)}</span>
                </div>
                <hr className="border-gray-300 dark:border-gray-600" />
                <div className="flex justify-between text-base">
                  <span>Shipping Fee:</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Grand Total:</span>
                  <span className="text-primary-100">
                    {formatCurrency(calculateGrandTotal())}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <label className="block mb-2 text-lg font-medium">
                  Payment Method:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as PaymentMethod)
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-300 text-dark100_light500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="cod">
                    Cash on Delivery (30k shipping fee)
                  </option>
                  <option value="vnpay">VNPay (25k shipping fee)</option>
                </select>
              </div>

              {/* Delivery Method */}
              <div className="mt-6">
                <label className="block mb-3 text-lg font-medium">
                  Delivery Method:
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-300">
                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={deliveryMethod === "standard"}
                      onChange={(e) =>
                        setDeliveryMethod(e.target.value as DeliveryMethod)
                      }
                      className="w-4 h-4 text-primary-100"
                    />
                    <span>Standard Delivery (No extra fee)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-300">
                    <input
                      type="radio"
                      name="delivery"
                      value="fast"
                      checked={deliveryMethod === "fast"}
                      onChange={(e) =>
                        setDeliveryMethod(e.target.value as DeliveryMethod)
                      }
                      className="w-4 h-4 text-primary-100"
                    />
                    <span>Fast Delivery (+5k shipping fee)</span>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg ${
                      city.toLowerCase() === "ho chi minh"
                        ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-300"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={deliveryMethod === "express"}
                      onChange={(e) =>
                        setDeliveryMethod(e.target.value as DeliveryMethod)
                      }
                      disabled={city.toLowerCase() !== "ho chi minh"}
                      className="w-4 h-4 text-primary-100"
                    />
                    <span>
                      Express Delivery (40k extra, Ho Chi Minh City only)
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
