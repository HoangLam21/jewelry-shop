import { NextApiRequest, NextApiResponse } from "next";
import { createSchedule } from "@/lib/actions/schedule.action"; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const data = req.body;
      const schedule = await createSchedule(data);
      return res.status(201).json(schedule);
    } catch (error: any) {
      console.error("Error creating schedule: ", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
