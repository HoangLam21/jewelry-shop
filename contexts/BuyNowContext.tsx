"use client";
import React, { createContext, useContext, useReducer } from "react";

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng
type BuyNowItem = {
  _id: string;
  name: string;
  images: string;
  cost: number;
  quantity: number;
  vouchers: any[];
  variants: any[];
  selectedMaterial: string;
  selectedSize: string;
};

// Định nghĩa kiểu trạng thái giỏ hàng
type BuyNowState = {
  items: BuyNowItem[];
};

// Định nghĩa các action có thể dispatch
type BuyNowAction =
  | { type: "BUY_NOW"; payload: BuyNowItem }
  | { type: "RESET_BUY_NOW" };

// Tạo context để lưu trữ trạng thái giỏ hàng
const BuyNowContext = createContext<{
  stateBuyNow: BuyNowState;
  dispatchBuyNow: React.Dispatch<BuyNowAction>;
}>({
  stateBuyNow: { items: [] },
  dispatchBuyNow: () => null
});

// Reducer để cập nhật trạng thái giỏ hàng dựa trên các action
const BuyNowReducer = (
  stateBuyNow: BuyNowState,
  action: BuyNowAction
): BuyNowState => {
  switch (action.type) {
    case "BUY_NOW": {
      // Thêm item vào giỏ hàng
      return { items: [...stateBuyNow.items, { ...action.payload }] };
    }
    case "RESET_BUY_NOW": {
      // Reset giỏ hàng (xóa tất cả items)
      return { items: [] };
    }
    default:
      return stateBuyNow;
  }
};

// BuyNowProvider cung cấp state và dispatch cho các component con
export const BuyNowProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [stateBuyNow, dispatchBuyNow] = useReducer(BuyNowReducer, {
    items: []
  });

  return (
    <BuyNowContext.Provider value={{ stateBuyNow, dispatchBuyNow }}>
      {children}
    </BuyNowContext.Provider>
  );
};

// Hook custom để dễ dàng truy cập state và dispatch từ bất kỳ component nào
export const useBuyNow = () => useContext(BuyNowContext);
