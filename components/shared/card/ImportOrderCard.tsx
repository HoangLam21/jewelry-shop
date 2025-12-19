import { CreateOrder } from "@/dto/OrderDTO";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { Product } from "./ImportCard";

export interface DetailImportProduct {
  id: string;
  material: string;
  size: string;
  unitPrice: number;
  quantity: number;
  discount: string;
}

const ImportOrderCard = ({
  updateCart,
  cartItem,
  setItem,
  item,
}: {
  cartItem: DetailImportProduct;
  updateCart: (updatedItem: DetailImportProduct) => void;
  setItem: any;
  item: Product | null;
}) => {
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 0) return; // Đảm bảo số lượng không nhỏ hơn 0

    if (newQuantity === 0) {
      // Xóa sản phẩm khỏi giỏ hàng
      setItem((prevItem: any) => {
        const updatedDetails = prevItem.details.filter(
          (detail: any) =>
            !(
              detail.id === cartItem.id &&
              detail.material === cartItem.material &&
              detail.size === cartItem.size
            )
        );
        return { ...prevItem, details: updatedDetails };
      });
    } else {
      setQuantity(newQuantity);

      // Tạo đối tượng mới để cập nhật giỏ hàng
      const updatedItem = { ...cartItem, quantity: newQuantity };
      updateCart(updatedItem);

      // Cập nhật state giỏ hàng cha
      setItem((prevItem: any) => {
        const updatedDetails = prevItem.details.map((detail: any) => {
          if (
            detail.id === cartItem.id &&
            detail.material === cartItem.material &&
            detail.size === cartItem.size
          ) {
            return { ...detail, quantity: newQuantity };
          }
          return detail;
        });
        return { ...prevItem, details: updatedDetails };
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) return; // Kiểm tra giá trị hợp lệ
    updateQuantity(value);
  };

  return (
    <div
      key={cartItem.id}
      className="w-full h-full flex flex-row items-center justify-between py-3"
    >
      <div className="flex w-full h-full gap-4 items-center py-3">
        <div className="h-14 w-14 rounded-lg bg-cover bg-no-repeat bg-center">
          <img src={item?.image || ""} alt="avatar" className="rounded-lg" />
        </div>
        <div className="flex flex-col w-3/5">
          <span className="text-sm font-bold">{item?.productName}</span>
          <span className="text-xs">{formatPrice(cartItem.unitPrice)}</span>
        </div>
      </div>
      <div className="flex w-2/5 pt-4 gap-2">
        <button
          onClick={() => updateQuantity(quantity - 1)}
          disabled={quantity <= 0} // Không cho giảm nhỏ hơn 0
        >
          -
        </button>
        <input
          type="text"
          value={quantity}
          onChange={handleInputChange}
          // min={1}
          className="w-16 h-6 border border-gray-300 rounded-md self-center text-sm focus:outline-none text-center"
        />
        <button onClick={() => updateQuantity(quantity + 1)}>+</button>
      </div>
    </div>
  );
};

export default ImportOrderCard;
