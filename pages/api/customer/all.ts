import { NextApiRequest, NextApiResponse } from "next/types";
import { getCustomers } from "@/lib/actions/customer.action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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