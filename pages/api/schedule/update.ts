import { NextApiRequest, NextApiResponse } from "next";
import { updateSchedule } from "@/lib/actions/schedule.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const data = req.body;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid schedule id" });
      }

      const updatedSchedule = await updateSchedule(id, data);
      return res.status(200).json(updatedSchedule);
    } catch (error) {
      console.error("Error updating schedule:", error);

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
