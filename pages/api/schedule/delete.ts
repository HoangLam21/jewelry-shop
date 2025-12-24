import { NextApiRequest, NextApiResponse } from "next";
import { deleteSchedule } from "@/lib/actions/schedule.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const response = await deleteSchedule(id?.toString()!);
      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Error deleting schedule: ", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
