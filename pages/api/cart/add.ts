// Add a product to a cart
import { NextApiRequest, NextApiResponse } from "next";
import { addProductToCart } from "@/lib/actions/cart.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
) {
  if (req.method === "POST") {
    try {
      // Extract data from the request body
      const { userId, productId, quantity, selectedMaterial, selectedSize } =
        req.body;

      // Ensure all necessary fields are provided
      if (
        !userId ||
        !productId ||
        !quantity ||
        !selectedMaterial ||
        !selectedSize
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Call the function to add the product to the cart
      const cart = await addProductToCart(
        userId,
        productId,
        quantity,
        selectedMaterial,
        selectedSize
      );

      // Return the updated cart as a response
      return res.status(201).json(cart);
    } catch (error) {
      console.error("Error adding product to cart: ", error);
      return res.status(500).json({ error: "Failed to add product to cart" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withCustomerOrAbove(handler);