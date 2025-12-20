import { NextApiRequest, NextApiResponse } from "next";
import { getAllSchedule } from "@/lib/actions/schedule.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const schedules = await getAllSchedule();
      return res.status(200).json(schedules);
    } catch (error: any) {
      console.error("Error fetching schedules: ", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
