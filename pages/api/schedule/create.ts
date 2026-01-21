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
    } catch (error) {
      console.error("Error creating schedule:", error);

      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      return res.status(500).json({ error: message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
