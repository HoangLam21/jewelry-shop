// Get customer by ID (customer can view own info, staff/admin can view any)
import { NextApiRequest, NextApiResponse } from "next/types";
import { getCustomerById } from "@/lib/actions/customer.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  if (req.method === "GET") {
    const { id } = req.query; // Lấy ID từ query params
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing customer ID" });
    }

    // Nếu user là customer, chỉ cho phép xem thông tin của chính họ
    if (auth.role === "customer") {
      if (!auth.userIdInDb || auth.userIdInDb !== id) {
        return res.status(403).json({ 
          error: "Forbidden - You can only view your own information" 
        });
      }
    }

    try {
      const customer = await getCustomerById(id);
      return res.status(200).json(customer);
    } catch (error) {
      console.error("Error fetching customer by ID:", error);
      return res.status(500).json({ error: "Failed to fetch customer" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withCustomerOrAbove(handler);