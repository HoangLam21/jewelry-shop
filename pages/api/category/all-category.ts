import { NextApiRequest, NextApiResponse } from "next";
import { getCategories } from "@/lib/actions/category.action";

let categoriesCache: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const now = Date.now();

      if (categoriesCache && now - cacheTime < CACHE_DURATION) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=60, stale-while-revalidate=120"
        );
        return res.status(200).json(categoriesCache);
      }

      const categories = await getCategories();
      categoriesCache = categories;
      cacheTime = now;

      res.setHeader(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=120"
      );

      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
