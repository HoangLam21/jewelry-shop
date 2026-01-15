import { NextApiRequest, NextApiResponse } from "next/types";
import { updateCustomer } from "@/lib/actions/customer.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  if (req.method === "PUT") {
    const { id } = req.query; 
    const data = req.body; 

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing customer ID" });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "Invalid or missing data for update" });
    }

    try {
      const updatedCustomer = await updateCustomer(id, data);
      return res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer:", error);
      return res.status(500).json({ error: "Failed to update customer" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withCustomerOrAbove(handler);