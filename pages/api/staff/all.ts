import { NextApiRequest, NextApiResponse } from "next/types";
import { getStaffs } from "@/lib/actions/staff.action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const staffs = await getStaffs();
      return res.status(200).json(staffs);
    } catch (error) {
      console.error("Error fetching staffs:", error);
      return res.status(500).json({ error: "Failed to fetch staffs" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
