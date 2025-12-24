import { NextApiRequest, NextApiResponse } from "next/types";
import { createStaff } from "@/lib/actions/staff.action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body; 

    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "Invalid or missing data for staff creation" });
    }

    try {
      const newStaff = await createStaff(data);
      return res.status(201).json(newStaff);
    } catch (error) {
      console.error("Error creating staff:", error);
      return res.status(500).json({ error: "Failed to create staff" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

