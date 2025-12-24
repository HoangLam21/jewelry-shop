import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import {
  decreaseProductQuantity,
  increaseProductQuantity,
  removeProductFromCart,
} from "@/lib/services/cart.service";

const CartCard = ({ item, setCart }: any) => {
  const { dispatch } = useCart();
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

  const handleIncreaseQuantity = async () => {
    if (user?._id) {
      try {
        await increaseProductQuantity(
          user._id,
          item._id,
          item.selectedMaterial,
          item.selectedSize
        );
        setCart((prevCart: any) =>
          prevCart.map((product: any) =>
            product?._id === item?._id &&
            product?.selectedMaterial === item?.selectedMaterial &&
            product?.selectedSize === item?.selectedSize
              ? { ...product, quantity: product?.quantity + 1 }
              : product
          )
        );
        // Optionally: fetch updated cart and dispatch
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
        setCart((prevCart: any) =>
          prevCart.map((product: any) =>
            product?._id === item?._id &&
            product?.selectedMaterial === item?.selectedMaterial &&
            product?.selectedSize === item?.selectedSize &&
            product?.quantity > 1
              ? { ...product, quantity: product?.quantity - 1 }
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

        setCart((prevCart: any) =>
          prevCart.filter(
            (product: any) =>
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

  const selectedVariant = item.variants?.find(
    (variant: { material: string }) =>
      variant.material === item.selectedMaterial
  );
  const basePriceWithAddOn = item.cost + (selectedVariant?.addOn || 0);

  const maxDiscount = item.vouchers?.reduce(
    (max: number, voucher: { discount: number }) =>
      voucher.discount > max ? voucher.discount : max,
    0
  );
  const effectiveDiscount = maxDiscount || item.discount || 0;

  const discountedPrice =
    basePriceWithAddOn - (basePriceWithAddOn * effectiveDiscount) / 100;

  return (
    <>
      <hr className="mb-4"></hr>
      <div className="flex w-[95%] justify-between mb-4">
        <div className="w-[35%] flex items-center">
          <div>
            <Image
              src={item?.images}
              alt={item.name}
              width={151}
              height={188}
              className="object-cover w-[151px] h-[188px]"
            />
          </div>
          <div className="ml-4">
            <div className="ml-4">
              <span className="text-[20px] font-normal jost">{item.name}</span>
              <hr className="border-transparent" />
              <span className="text-primary-100">{discountedPrice}</span>
              <br />
              <span className="text-gray-500 line-through">
                {basePriceWithAddOn}
              </span>
              <hr className="border-none"></hr>
              <span>
                {item.selectedMaterial}, {item.selectedSize}
              </span>
            </div>
          </div>
        </div>
        <div className="w-[15%] flex items-center justify-center">
          <button
            className="px-2 background-light700_dark300"
            onClick={handleDecreaseQuantity}
          >
            -
          </button>
          <span className="text-[16px] font-normal jost mx-2">
            {item.quantity}
          </span>
          <button
            className="px-2 background-light700_dark300"
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>
        <div className="w-[25%] flex items-center justify-end">
          <span className="text-[28px] font-medium text-primary-100">
            {(discountedPrice || item.cost) * item.quantity}
          </span>
        </div>
        <div className="w-[5%] flex items-center justify-center">
          <button className="" onClick={handleRemoveFromCart}>
            <Icon
              icon="material-symbols:close-rounded"
              width="24"
              height="24"
            />
          </button>
        </div>
      </div>
      <hr className="mt-2"></hr>
    </>
  );
};

export default CartCard;