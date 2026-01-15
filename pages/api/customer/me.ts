// Get current logged-in customer info
import { NextApiRequest, NextApiResponse } from "next/types";
import { getCustomerById } from "@/lib/actions/customer.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  if (req.method === "GET") {
    try {
      // Chỉ customer mới có thể xem thông tin của chính họ
      if (auth.role !== "customer") {
        return res.status(403).json({ 
          error: "Forbidden - This endpoint is only for customers" 
        });
      }

      if (!auth.userIdInDb) {
        return res.status(404).json({ error: "Customer not found" });
      }

      // userIdInDb là customer ID trong database
      const customer = await getCustomerById(auth.userIdInDb);
      return res.status(200).json(customer);
    } catch (error) {
      console.error("Error fetching current customer:", error);
      return res.status(500).json({ error: "Failed to fetch customer" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withCustomerOrAbove(handler);
