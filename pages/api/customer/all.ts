import { NextApiRequest, NextApiResponse } from "next/types";
import { getCustomers } from "@/lib/actions/customer.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
      if (req.method === "GET") {
        try {
          const customers = await getCustomers();
          return res.status(200).json(customers);
        } catch (error) {
          console.error("Error fetching customers:", error);
          return res.status(500).json({ error: "Failed to fetch customers" });
        }
      } else {
        return res.status(405).json({ error: "Method not allowed" });
      }
}

export default withStaffOrAdmin(handler);