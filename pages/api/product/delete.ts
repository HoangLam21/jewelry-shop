import { NextApiRequest, NextApiResponse } from "next";
import { deleteProduct } from "@/lib/actions/product.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid ID" });
    }

    try {
      const result = await deleteProduct(id);
      if (result) {
        return res
          .status(200)
          .json({ message: "Product deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting product: ", error);
      return res.status(500).json({ error: "Failed to delete product" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}