// Get order by ID
import { NextApiRequest, NextApiResponse } from "next";
import { getOrderById } from "@/lib/actions/order.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
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

export default withStaffOrAdmin(handler);