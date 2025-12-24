// Add a product to a cart
import { NextApiRequest, NextApiResponse } from "next";
import { removeProductFromCart } from "@/lib/actions/cart.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { userId, productId, selectedMaterial, selectedSize } = req.body;
      if (!userId || !productId || !selectedMaterial || !selectedSize) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const cart = await removeProductFromCart(
        userId,
        productId,
        selectedMaterial,
        selectedSize
      );
      return res.status(201).json(cart);
    } catch (error) {
      console.error("Error adding product to cart: ", error);
      return res.status(500).json({ error: "Failed to add product to cart" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}