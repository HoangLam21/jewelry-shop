import { NextApiRequest, NextApiResponse } from "next";
import { deleteSchedule } from "@/lib/actions/schedule.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid schedule id" });
      }

      const response = await deleteSchedule(id);
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error deleting schedule:", error);

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
