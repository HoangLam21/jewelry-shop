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
    } catch (error) {
      console.error("Error fetching schedules:", error);

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
