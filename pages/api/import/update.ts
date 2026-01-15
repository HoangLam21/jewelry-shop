import { updateOrderStatus } from "@/lib/actions/order.action";
import { NextApiRequest, NextApiResponse } from "next";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
) {
  if (req.method === "PATCH") {
    try {
      // Lấy ID từ query params
      const { id } = req.query;

      // Lấy status từ body
      const { status } = req.body;

      // Kiểm tra xem id và status có hợp lệ không
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid or missing order ID" });
      }
      if (!status || typeof status !== "string") {
        return res.status(400).json({ error: "Invalid or missing status" });
      }

      console.log(id, status, "id, status");

      // Gọi hàm cập nhật trạng thái đơn hàng
      const result = await updateOrderStatus(id, status);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating order: ", error);
      return res.status(500).json({ error: "Failed to update order" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withStaffOrAdmin(handler);