import { NextApiRequest, NextApiResponse } from "next";
import { getProducts } from "@/lib/actions/product.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const products = await getProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products: ", error);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}