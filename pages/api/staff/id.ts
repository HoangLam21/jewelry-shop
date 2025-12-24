import { NextApiRequest, NextApiResponse } from "next/types";
import { getStaffById } from "@/lib/actions/staff.action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query; // Lấy ID từ query params

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing staff ID" });
    }

    try {
      const staff = await getStaffById(id);
      return res.status(200).json(staff);
    } catch (error) {
      console.error("Error fetching staff by ID:", error);
      return res.status(500).json({ error: "Failed to fetch staff" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
