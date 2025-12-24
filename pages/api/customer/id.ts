import { NextApiRequest, NextApiResponse } from "next/types";
import { getCustomerById } from "@/lib/actions/customer.action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query; // Lấy ID từ query params
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing customer ID" });
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