"use client";
import React, { createContext, useContext, useReducer } from "react";

interface Voucher {
  _id: string;
  name: string;
  discount: number;
}

interface Size {
  size: string;
  stock: number;
  _id: string;
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

interface BuyNowState {
  items: BuyNowItem[];
}

type BuyNowAction =
  | { type: "BUY_NOW"; payload: BuyNowItem }
  | { type: "RESET_BUY_NOW" };

const BuyNowContext = createContext<{
  stateBuyNow: BuyNowState;
  dispatchBuyNow: React.Dispatch<BuyNowAction>;
}>({
  stateBuyNow: { items: [] },
  dispatchBuyNow: () => null,
});

const BuyNowReducer = (
  stateBuyNow: BuyNowState,
  action: BuyNowAction
): BuyNowState => {
  switch (action.type) {
    case "BUY_NOW": {
      return { items: [...stateBuyNow.items, { ...action.payload }] };
    }
    case "RESET_BUY_NOW": {
      return { items: [] };
    }
    default:
      return stateBuyNow;
  }
};

export const BuyNowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stateBuyNow, dispatchBuyNow] = useReducer(BuyNowReducer, {
    items: [],
  });

  return (
    <BuyNowContext.Provider value={{ stateBuyNow, dispatchBuyNow }}>
      {children}
    </BuyNowContext.Provider>
  );
};

export const useBuyNow = () => useContext(BuyNowContext);

// Export types for use in other files
export type { BuyNowItem, BuyNowState, BuyNowAction, Voucher, Variant, Size };
