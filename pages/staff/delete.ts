import { NextApiRequest, NextApiResponse } from "next/types";
import { deleteStaff } from "@/lib/actions/staff.action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    const { id } = req.query; // Lấy ID từ query params

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing staff ID" });
    }

    try {
      const result = await deleteStaff(id);
      if (result) {
        return res.status(200).json({ message: "Staff deleted successfully" });
      } else {
        return res.status(404).json({ error: "Staff not found" });
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      return res.status(500).json({ error: "Failed to delete staff" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
