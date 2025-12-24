import { NextApiRequest, NextApiResponse } from "next/types";
import { updateStaff } from "@/lib/actions/staff.action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const { id } = req.query;
    const data = req.body; 

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing staff ID" });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "Invalid or missing data for update" });
    }

    try {
      const updatedStaff = await updateStaff(id, data);
      return res.status(200).json(updatedStaff);
    } catch (error) {
      console.error("Error updating staff:", error);
      return res.status(500).json({ error: "Failed to update staff" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
