"use client";
import CartCard from "@/components/card/cart/CartCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { getCartByUserId } from "@/lib/services/cart.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { state } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

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

  useEffect(() => {
    const formatCartData = (cartData: any) => {
      return cartData.details.map((detail: any) => ({
        _id: detail.productId,
        name: detail.productName,
        images: detail.productFiles[0]?.url || "",
        cost: detail.productCost,
        quantity: detail.quantity,
        vouchers: detail.productVouchers || [],
        variants: detail.productVariants || [],
        selectedMaterial: detail.selectedMaterial,
        selectedSize: detail.selectedSize,
      }));
    };

    let isMounted = true;
    const getCart = async () => {
      try {
        if (user?._id) {
          const data = await getCartByUserId(user?._id);
          if (isMounted) {
            const formattedData = formatCartData(data);
            setCart(formattedData);
            console.log("formattedData", formattedData);
          }
        } else if (state.items.length > 0) {
          const formattedState = state.items.map((detail: any) => ({
            _id: detail._id,
            name: detail.name,
            images: detail.files[0]?.url || "",
            cost: detail.cost,
            quantity: detail.quantity,
            vouchers: detail.vouchers || [],
            variants: detail.variants || [],
            selectedMaterial: detail.selectedMaterial || "",
            selectedSize: detail.selectedSize || "",
          }));
          setCart(formattedState);
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

  const totalOriginalPrice =
    cart?.reduce((acc, item) => {
      const selectedVariant = item.variants.find(
        (variant: any) => variant.material === item.selectedMaterial
      );
      const addOn = selectedVariant ? selectedVariant.addOn : 0;

      return acc + (item.cost + addOn) * item.quantity;
    }, 0) || 0;

  const totalDiscount =
    cart?.reduce((acc, item) => {
      const maxDiscount = item.vouchers.length
        ? Math.max(
            ...item.vouchers.map((voucher: any) => voucher.discount || 0)
          )
        : 0;
      const selectedVariant = item.variants.find(
        (variant: any) => variant.material === item.selectedMaterial
      );
      const addOn = selectedVariant ? selectedVariant.addOn : 0;

      return acc + ((item.cost + addOn) * item.quantity * maxDiscount) / 100;
    }, 0) || 0;

  const appliedVouchers =
    cart?.flatMap((item) =>
      item.vouchers.map((voucher: any) => ({
        name: voucher.name,
        discount: voucher.discount,
      }))
    ) || [];

  const totalFinalPrice = totalOriginalPrice - totalDiscount;

  return (
    <div className="w-full text-dark100_light500">
      <div className="bg-[#EDF1F3]  dark:bg-dark-200 h-[250px] flex justify-center items-center">
        <div>
          <h1 className="text-dark100_light500 font-light text-[84px]">CART</h1>
          <div className="flex justify-center items-center">
            <Link href="/">
              <span className="text-dark100_light500">Home</span>
            </Link>
            <Icon
              icon="solar:alt-arrow-right-line-duotone"
              width="24"
              height="16"
            />
            <Link href="/cart">
              <span className="text-primary-100">Cart</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-10 w-full justify-center flex">
        <div className=" w-[80%]">
          <div className="flex w-[80%] mb-10 justify-between">
            <div className="1/2">
              <span className="text-[20px] font-normal jost">PRODUCT</span>
            </div>
            <div className="w-[20px]">
              <span className="text-[20px] font-normal jost">QUANTITY</span>
            </div>
            <div className="w-[30px]">
              <span className="text-[20px] font-normal jost">SUBTOTAL</span>
            </div>
          </div>
          {cart?.map((item, index) => (
            <CartCard key={item._id + index} item={item} setCart={setCart} />
          ))}
          <div className="mt-10 w-full flex flex-col">
            <div className="text-[20px] font-normal jost">
              <span>Total Original Price: </span>
              <div className="text-end">
                <span className="text-primary-100 text-end w-full">
                  {totalOriginalPrice}
                </span>
              </div>
            </div>
            <hr className="mt-2"></hr>

            <div className="text-[20px] font-normal jost mt-4">
              <span>Applied Vouchers:</span>
              {appliedVouchers.map((voucher, index) => (
                <li key={index} className="text-[16px] font-light">
                  <span className="text-primary-100">{voucher.name}</span>
                  <span>: {voucher.discount}% off</span>
                </li>
              ))}
            </div>

            <div className="text-[20px] font-normal jost mt-4">
              <span>Total Discount: </span>
              <div className="text-end">
                <span className="text-red-500">-{totalDiscount}</span>
              </div>
            </div>
            <hr className="mt-2"></hr>

            <div className="text-[20px] font-medium jost mt-4">
              <span>Total Final Price: </span>
              <div className="text-end">
                <span className="text-primary-100">{totalFinalPrice}</span>
              </div>
            </div>
            <hr className="mt-2"></hr>
          </div>
          <div className="flex justify-center mt-5">
            <Button className="bg-primary-100 text-white w-[20%] pr-2 rounded-none">
              CONTINUE SHOPPING
            </Button>

            <Button
              onClick={handleCheckout}
              className="bg-primary-100 w-[20%] text-white pr-2 rounded-none ml-3"
            >
              PROCESS TO CHECKOUT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
