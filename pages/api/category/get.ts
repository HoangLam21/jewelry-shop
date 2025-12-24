// Get a category by ID
import { NextApiRequest, NextApiResponse } from "next";
import { getCategoryById } from "@/lib/actions/category.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query; // Lấy ID từ query params

      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid or missing staff ID" });
      }
      const category = await getCategoryById(id);
      return res.status(200).json(category);
    } catch (error) {
      console.error("Error fetching category: ", error);
      return res.status(500).json({ error: "Failed to fetch category" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}