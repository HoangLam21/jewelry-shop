import { NextApiRequest, NextApiResponse } from "next";
import { getProductById } from "@/lib/actions/product.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method === "GET") {
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    try {
      const product = await getProductById(id);
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product by ID: ", error);
      return res.status(500).json({ error: "Failed to fetch product" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}