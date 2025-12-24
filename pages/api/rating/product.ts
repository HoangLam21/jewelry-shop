import { NextApiRequest, NextApiResponse } from "next";
import { getRatingsByProductId } from "@/lib/actions/rating.action"; // Adjust path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.query;

  if (req.method === "GET") {
    if (typeof productId !== "string") {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    try {
      const ratings = await getRatingsByProductId(productId);
      return res.status(200).json(ratings);
    } catch (error) {
      console.error("Error fetching ratings: ", error);
      return res.status(500).json({ error: "Failed to fetch ratings" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
