import { NextApiRequest, NextApiResponse } from "next";
import { getScheduleById } from "@/lib/actions/schedule.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const schedule = await getScheduleById(id as string);
      return res.status(200).json(schedule);
    } catch (error) {
      console.error("Error fetching schedule by ID:", error);

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
