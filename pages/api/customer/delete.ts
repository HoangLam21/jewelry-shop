import { NextApiRequest, NextApiResponse } from "next/types";
import { deleteCustomer } from "@/lib/actions/customer.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  if (req.method === "DELETE") {
    const { id } = req.query; // Lấy ID từ query params

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing customer ID" });
    }

    try {
      const result = await deleteCustomer(id);
      if (result) {
        return res.status(200).json({ message: "Customer deleted successfully" });
      } else {
        return res.status(404).json({ error: "Customer not found" });
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      return res.status(500).json({ error: "Failed to delete customer" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withAdmin(handler);