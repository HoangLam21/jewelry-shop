import { NextApiRequest, NextApiResponse } from "next";
import { getProductBySlug } from "@/lib/actions/product.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (req.method === "GET") {
    if (typeof slug !== "string") {
      return res.status(400).json({ error: "Invalid slug" });
    }

    try {
      const product = await getProductBySlug(slug);
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product by slug: ", error);
      return res.status(500).json({ error: "Failed to fetch product" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}