// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useCart } from "@/contexts/CartContext";
// import Link from "next/link";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import ShippingInformation from "@/components/form/checkout/ShippingInformation";
// import { useRouter } from "next/navigation";
// import { useBuyNow } from "@/contexts/BuyNowContext";
// import { CreateOrder } from "@/dto/OrderDTO";
// import { formatCurrency } from "@/lib/utils";
// import { payVNPay } from "@/lib/service/vnpay.service";

// function addDays(days: number) {
//   const result = new Date();
//   result.setDate(result.getDate() + days);
//   return result;
// }
// interface BuyNowItem {
//   _id: string;
//   name: string;
//   images: string;
//   cost: number;
//   quantity: number;
//   vouchers: any[];
//   variants: any[];
//   selectedMaterial: string;
//   selectedSize: string;
// }
// const defaultBuyNowItem: BuyNowItem = {
//   _id: "",
//   name: "",
//   images: "",
//   cost: 0,
//   quantity: 0,
//   vouchers: [],
//   variants: [],
//   selectedMaterial: "",
//   selectedSize: "",
// };

// export default function Page() {
//   const { stateBuyNow, dispatchBuyNow } = useBuyNow();
//   const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);
//   const [totalDiscount, setTotalDiscount] = useState(0);
//   const [totalFinalPrice, setTotalFinalPrice] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [deliveryMethod, setDeliveryMethod] = useState("standard");
//   const [city, setCity] = useState("");
//   const [shippingFee, setShippingFee] = useState(0);
//   const [address, setAddress] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [note, setNote] = useState("");
//   const router = useRouter();
//   const [lastItem, setLastItem] = useState<BuyNowItem>(defaultBuyNowItem);

//   useEffect(() => {
//     const lastItem = stateBuyNow.items[stateBuyNow.items.length - 1];

//     if (lastItem) {
//       setLastItem(lastItem);
//       const selectedVariant = lastItem.variants.find(
//         (variant) => variant.material === lastItem.selectedMaterial
//       );

//       const sizeStock = selectedVariant?.sizes.find(
//         (size: any) => size.size === lastItem.selectedSize
//       );

//       const basePrice = lastItem.cost * lastItem.quantity;

//       const addOnPrice = (selectedVariant?.addOn || 0) * lastItem.quantity;

//       const voucher = lastItem.vouchers?.[0];
//       const voucherDiscount = voucher
//         ? (basePrice + addOnPrice) * (voucher.discount / 100)
//         : 0;

//       setTotalOriginalPrice(basePrice + addOnPrice);
//       setTotalDiscount(voucherDiscount);
//       setTotalFinalPrice(basePrice + addOnPrice - voucherDiscount);
//     }
//   }, [stateBuyNow.items]);

//   const handleOrder = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const details = stateBuyNow.items.map((item: any) => ({
//       id: item._id,
//       material: item.selectedMaterial,
//       size: item.selectedSize,
//       unitPrice: item.cost,
//       quantity: item.quantity,
//       discount: item.vouchers?.[0]?.discount || "0",
//     }));

//     const orderData: CreateOrder = {
//       cost: totalFinalPrice + shippingFee,
//       discount: lastItem?.vouchers?.[0]?.discount || 0, // Lấy discount từ lastItem
//       details,
//       status: "pending",
//       shippingMethod: deliveryMethod,
//       ETD: addDays(3),
//       customer: "6776bd0974de08ccc866a4ab",
//       staff: "6776bdee74de08ccc866a4be",
//     };

//     try {
//       const response = await fetch("/api/order/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(orderData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(errorData.error || "Order can't create. Please try again.");
//         return;
//       }

//       const createdOrder = await response.json();

//       if (paymentMethod === "vnpay") {
//         const data = await payVNPay(createdOrder._id, totalFinalPrice);
//         router.push(data.url);
//         return;
//       }

//       alert("Order created!");
//       dispatchBuyNow({ type: "RESET_BUY_NOW" });
//       router.push("/product");
//       console.log("Order created:", createdOrder);
//     } catch (error: any) {
//       console.error("Error creating order:", error.message);
//       alert("Failed to create order. Please try again.");
//     }
//   };

//   useEffect(() => {
//     const calculateShippingFee = () => {
//       if (deliveryMethod === "fast") return 5000;
//       if (deliveryMethod === "express") return 30000;
//       return paymentMethod === "vnpay" ? 25000 : 30000;
//     };
//     setShippingFee(calculateShippingFee());
//   }, [deliveryMethod, paymentMethod, city]);

//   const calculateGrandTotal = () => totalFinalPrice + shippingFee;

//   return (
//     <>
//       <div className="bg-[#EDF1F3]  dark:bg-dark-200 h-[250px] flex justify-center items-center">
//         <div>
//           <h1 className="text-dark100_light500 font-light text-[84px]">
//             CHECKOUT
//           </h1>
//           <div className="flex justify-center items-center">
//             <Link href="/">
//               <span className="text-dark100_light500">Home</span>
//             </Link>
//             <Icon
//               icon="solar:alt-arrow-right-line-duotone"
//               width="24"
//               height="16"
//             />
//             <Link href="/checkout">
//               <span className="text-primary-100">Checkout</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//       <div className="flex text-dark100_light500 flex-col lg:flex-row justify-between w-full px-10 pb-5">
//         <div className="lg:w-[45%] w-full p-5 rounded-lg mt-8 lg:mt-0">
//           <h2 className="text-[30px] font-normal jost mb-5">
//             SHIPPING INFOMATION
//           </h2>
//           <div className="flex flex-col space-y-4">
//             <ShippingInformation
//               city={city}
//               setCity={setCity}
//               setAddress={setAddress}
//               setPhoneNumber={setPhoneNumber}
//               setNote={setNote}
//             />
//             <button
//               onClick={handleOrder}
//               className="bg-primary-100 text-white p-3 hover:bg-primary-200"
//             >
//               Confirm & Proceed to Payment
//             </button>
//           </div>
//         </div>
//         <div className="lg:w-[50%] w-full p-5 rounded-lg">
//           <h2 className="text-[30px] font-normal jost mb-10">
//             ORDER INFOMATION
//           </h2>
//           {stateBuyNow.items.map((item: any) => (
//             <div
//               key={item._id}
//               className="flex items-center justify-between mb-4 border-b pb-4"
//             >
//               <Image
//                 src={item.files[0].url}
//                 alt={item.name}
//                 width={100}
//                 height={120}
//                 className="object-cover h-40 rounded"
//               />
//               <div className="ml-4">
//                 <h3 className="text-[18px] font-medium">{item.name}</h3>
//                 <span className="text-[16px] text-gray-500">
//                   Quantity: {item.quantity}
//                 </span>
//               </div>
//               <span className="text-[18px] font-semibold text-primary-100">
//                 {formatCurrency(item.cost * item.quantity)}
//               </span>
//             </div>
//           ))}

//           <div className="mt-6">
//             <div className="text-[18px] font-normal flex justify-between mb-2">
//               <span>Total Original Price:</span>
//               <span>{formatCurrency(totalOriginalPrice)}</span>
//             </div>
//             <div className="text-[18px] font-normal flex justify-between mb-2">
//               <span>Total Discount:</span>
//               <span className="text-red-500">
//                 -{formatCurrency(totalDiscount)}
//               </span>
//             </div>
//             <div className="text-[18px] font-medium flex justify-between mb-4">
//               <span>Total Final Price:</span>
//               <span>{formatCurrency(totalFinalPrice)}</span>
//             </div>
//           </div>

//           <div className="mt-6">
//             <label className="block mb-2 text-[18px] font-medium">
//               Payment Method:
//             </label>
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               className="w-full p-3 border rounded-none bg-transparent "
//             >
//               <option value="cod">Cash on Delivery (30k shipping fee)</option>
//               <option value="vnpay">VNPay (25k shipping fee)</option>
//             </select>
//           </div>

//           <div className="mt-6">
//             <label className="block mb-2 text-[18px] font-medium">
//               Delivery Method:
//             </label>
//             <div className="space-y-2">
//               <div>
//                 <input
//                   type="radio"
//                   id="standard"
//                   name="delivery"
//                   value="standard"
//                   checked={deliveryMethod === "standard"}
//                   onChange={(e) => setDeliveryMethod(e.target.value)}
//                 />
//                 <label htmlFor="standard" className="ml-2">
//                   Standard Delivery (No extra fee)
//                 </label>
//               </div>
//               <div>
//                 <input
//                   type="radio"
//                   id="fast"
//                   name="delivery"
//                   value="fast"
//                   checked={deliveryMethod === "fast"}
//                   onChange={(e) => setDeliveryMethod(e.target.value)}
//                 />
//                 <label htmlFor="fast" className="ml-2">
//                   Fast Delivery (+5k shipping fee)
//                 </label>
//               </div>
//               <div>
//                 <input
//                   type="radio"
//                   id="express"
//                   name="delivery"
//                   value="express"
//                   checked={deliveryMethod === "express"}
//                   onChange={(e) => setDeliveryMethod(e.target.value)}
//                   disabled={city.toLowerCase() !== "ho chi minh"}
//                 />
//                 <label htmlFor="express" className="ml-2">
//                   Express Delivery (30k shipping fee, only available in Ho Chi
//                   Minh City)
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6">
//             <div className="text-[18px] font-medium flex justify-between">
//               <span>Shipping Fee:</span>
//               <span>₫{shippingFee.toLocaleString()}</span>
//             </div>
//             <div className="text-[18px] font-semibold flex justify-between mt-4">
//               <span>Grand Total:</span>
//               <span>₫{calculateGrandTotal().toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ShippingInformation from "@/components/form/checkout/ShippingInformation";
import { useRouter } from "next/navigation";
import { useBuyNow } from "@/contexts/BuyNowContext";
import { CreateOrder } from "@/dto/OrderDTO";
import { formatCurrency } from "@/lib/utils";
import { payVNPay } from "@/lib/service/vnpay.service";

interface Voucher {
  _id: string;
  name: string;
  discount: number;
}

interface Size {
  size: string;
  stock: number;
}

interface Variant {
  material: string;
  addOn: number;
  sizes: Size[];
  _id: string;
}

interface BuyNowItem {
  _id: string;
  name: string;
  images?: string;
  files?: Array<{ url: string }>;
  cost: number;
  quantity: number;
  vouchers: Voucher[];
  variants: Variant[];
  selectedMaterial: string;
  selectedSize: string;
}

type PaymentMethod = "cod" | "vnpay";
type DeliveryMethod = "standard" | "fast" | "express";

function addDays(days: number): Date {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}

export default function Page() {
  const { stateBuyNow, dispatchBuyNow } = useBuyNow();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("standard");
  const [city, setCity] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Calculate lastItem and prices using useMemo
  const { lastItem, totalOriginalPrice, totalDiscount, totalFinalPrice } =
    useMemo(() => {
      const currentItem = stateBuyNow.items[stateBuyNow.items.length - 1];

      if (!currentItem) {
        return {
          lastItem: null,
          totalOriginalPrice: 0,
          totalDiscount: 0,
          totalFinalPrice: 0,
        };
      }

      const selectedVariant = currentItem.variants.find(
        (variant: Variant) => variant.material === currentItem.selectedMaterial
      );

      const basePrice = currentItem.cost * currentItem.quantity;
      const addOnPrice = (selectedVariant?.addOn || 0) * currentItem.quantity;

      const voucher = currentItem.vouchers?.[0];
      const voucherDiscount = voucher
        ? (basePrice + addOnPrice) * (voucher.discount / 100)
        : 0;

      return {
        lastItem: currentItem,
        totalOriginalPrice: basePrice + addOnPrice,
        totalDiscount: voucherDiscount,
        totalFinalPrice: basePrice + addOnPrice - voucherDiscount,
      };
    }, [stateBuyNow.items]);

  // Calculate shipping fee using useMemo
  const shippingFee = useMemo((): number => {
    if (deliveryMethod === "express") return 30000;
    if (deliveryMethod === "fast") return 5000;
    return paymentMethod === "vnpay" ? 25000 : 30000;
  }, [deliveryMethod, paymentMethod]);

  const handleOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!address || !phoneNumber || !city) {
      alert("Please fill in all shipping information");
      return;
    }

    if (stateBuyNow.items.length === 0) {
      alert("No items to checkout");
      return;
    }

    const details = stateBuyNow.items.map((item: BuyNowItem) => ({
      id: item._id,
      material: item.selectedMaterial,
      size: item.selectedSize,
      unitPrice: item.cost,
      quantity: item.quantity,
      discount: String(item.vouchers?.[0]?.discount || 0), // Keep String() for details
    }));

    const orderData = {
      cost: totalFinalPrice + shippingFee,
      discount: lastItem?.vouchers?.[0]?.discount || 0,
      details,
      status: "pending",
      shippingMethod: deliveryMethod,
      ETD: addDays(3),
      customer: "6776bd0974de08ccc866a4ab",
      staff: "6776bdee74de08ccc866a4be",
      phoneNumber,
      address,
      note,
    } as CreateOrder;
    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Order can't be created. Please try again.");
        return;
      }

      const createdOrder = await response.json();

      if (paymentMethod === "vnpay") {
        const data = await payVNPay(
          createdOrder._id,
          totalFinalPrice + shippingFee
        );
        router.push(data.url);
      } else {
        alert("Order created successfully!");
        dispatchBuyNow({ type: "RESET_BUY_NOW" });
        router.push(`/order-success?orderId=${createdOrder._id}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const calculateGrandTotal = (): number => totalFinalPrice + shippingFee;

  const getItemImage = (item: BuyNowItem): string => {
    return item.images || item.files?.[0]?.url || "/placeholder.jpg";
  };

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
          <div className="flex flex-col space-y-4">
            <ShippingInformation
              city={city}
              setCity={setCity}
              setAddress={setAddress}
              setPhoneNumber={setPhoneNumber}
              setNote={setNote}
            />
            <button
              onClick={handleOrder}
              className="bg-primary-100 text-white p-3 hover:bg-primary-200 transition-colors font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={stateBuyNow.items.length === 0}
            >
              Confirm & Proceed to Payment
            </button>
          </div>
        </div>

        {/* Order Information */}
        <div className="lg:w-[50%] w-full p-5 rounded-lg">
          <h2 className="text-2xl sm:text-3xl font-normal jost mb-6">
            ORDER INFORMATION
          </h2>

          {stateBuyNow.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items to checkout</p>
              <Link href="/products">
                <button className="mt-4 px-6 py-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200">
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {stateBuyNow.items.map((item: BuyNowItem, index: number) => (
                  <div
                    key={`${item._id}-${index}`}
                    className="flex items-center justify-between border-b pb-4 gap-4"
                  >
                    <div className="relative w-20 h-24 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={getItemImage(item)}
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
                      Express Delivery (30k extra, Ho Chi Minh City only)
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
