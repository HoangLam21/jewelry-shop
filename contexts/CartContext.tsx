// "use client";
// import React, { createContext, useContext, useReducer, useEffect } from "react";

// type CartItem = {
//   _id: string;
//   name: string;
//   images: string;
//   cost: number;
//   quantity: number;
//   vouchers: any[];
//   variants: any[];
//   selectedMaterial: string;
//   selectedSize: string;
// };

// type CartState = {
//   items: CartItem[];
// };

// type CartAction =
//   | { type: "ADD_TO_CART"; payload: CartItem }
//   | { type: "REMOVE_FROM_CART"; payload: string }
//   | { type: "INCREASE_QUANTITY"; payload: string }
//   | { type: "DECREASE_QUANTITY"; payload: string }
//   | { type: "INIT_CART"; payload: CartItem[] };

// const CartContext = createContext<{
//   state: CartState;
//   dispatch: React.Dispatch<CartAction>;
// }>({
//   state: { items: [] },
//   dispatch: () => null
// });

// const cartReducer = (state: CartState, action: CartAction): CartState => {
//   switch (action.type) {
//     case "ADD_TO_CART": {
//       const existingItem = state.items.find(
//         (item) =>
//           item._id === action.payload._id &&
//           item.selectedMaterial === action.payload.selectedMaterial &&
//           item.selectedSize === action.payload.selectedSize
//       );
//       if (existingItem) {
//         return {
//           items: state.items.map((item) =>
//             item._id === action.payload._id &&
//             item.selectedMaterial === action.payload.selectedMaterial &&
//             item.selectedSize === action.payload.selectedSize
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           )
//         };
//       }
//       return { items: [...state.items, { ...action.payload, quantity: 1 }] };
//     }
//     case "REMOVE_FROM_CART":
//       return {
//         items: state.items.filter((item) => item._id !== action.payload)
//       };
//     case "INCREASE_QUANTITY":
//       return {
//         items: state.items.map((item) =>
//           item._id === action.payload
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         )
//       };
//     case "DECREASE_QUANTITY":
//       return {
//         items: state.items.map((item) =>
//           item._id === action.payload && item.quantity > 1
//             ? { ...item, quantity: item.quantity - 1 }
//             : item
//         )
//       };
//     case "INIT_CART":
//       return { items: action.payload };
//     default:
//       return state;
//   }
// };

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
//   children
// }) => {
//   const [state, dispatch] = useReducer(cartReducer, { items: [] });

//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) {
//       dispatch({
//         type: "INIT_CART",
//         payload: JSON.parse(storedCart)
//       } as CartAction);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(state.items));
//   }, [state.items]);

//   return (
//     <CartContext.Provider value={{ state, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";

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

interface CartItem {
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

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "INCREASE_QUANTITY"; payload: string }
  | { type: "DECREASE_QUANTITY"; payload: string }
  | { type: "INIT_CART"; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: { items: [] },
  dispatch: () => null,
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item: CartItem) =>
          item._id === action.payload._id &&
          item.selectedMaterial === action.payload.selectedMaterial &&
          item.selectedSize === action.payload.selectedSize
      );
      if (existingItem) {
        return {
          items: state.items.map((item: CartItem) =>
            item._id === action.payload._id &&
            item.selectedMaterial === action.payload.selectedMaterial &&
            item.selectedSize === action.payload.selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_FROM_CART":
      return {
        items: state.items.filter(
          (item: CartItem) => item._id !== action.payload
        ),
      };
    case "INCREASE_QUANTITY":
      return {
        items: state.items.map((item: CartItem) =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case "DECREASE_QUANTITY":
      return {
        items: state.items.map((item: CartItem) =>
          item._id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    case "INIT_CART":
      return { items: action.payload };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        dispatch({
          type: "INIT_CART",
          payload: parsedCart,
        });
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("cart", JSON.stringify(state.items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

// Export types for use in other files
export type { CartItem, CartState, CartAction, Voucher, Variant, Size };
