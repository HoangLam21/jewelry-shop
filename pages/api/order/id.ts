// Get order by ID
import { NextApiRequest, NextApiResponse } from "next";
import { getOrderById } from "@/lib/actions/order.action"; // Đảm bảo đường dẫn chính xác
import id from "../customer/id";

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
      const order = await getOrderById(id);
      return res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order: ", error);
      return res.status(500).json({ error: "Failed to fetch order" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}