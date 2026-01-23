import { NextApiRequest, NextApiResponse } from "next";
import { getProducts } from "@/lib/actions/product.action";

// In-memory cache (Nên dùng Redis trong production)
let productsCache: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60000; // 1 phút

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const now = Date.now();

      // Kiểm tra cache
      if (productsCache && now - cacheTime < CACHE_DURATION) {
        // Set cache headers
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=60, stale-while-revalidate=120"
        );
        return res.status(200).json(productsCache);
      }

      // Fetch mới nếu cache hết hạn
      const products = await getProducts();
      productsCache = products;
      cacheTime = now;

      // Set cache headers
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=120"
      );

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products: ", error);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
