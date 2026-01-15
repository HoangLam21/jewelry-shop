// Delete order (Admin only - Force delete)
import { NextApiRequest, NextApiResponse } from "next";
import { deleteOrder } from "@/lib/actions/order.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.query; // Lấy ID từ query params

      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid or missing staff ID" });
      }
      console.log(id, "orderid");
      const result = await deleteOrder(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting order: ", error);
      return res.status(500).json({ error: "Failed to delete order" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withAdmin(handler);