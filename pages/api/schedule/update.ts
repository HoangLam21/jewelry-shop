import { NextApiRequest, NextApiResponse } from "next";
import { updateSchedule } from "@/lib/actions/schedule.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
    const {id} = req.query;
      const data = req.body;
      const updatedSchedule = await updateSchedule(id?.toString()!, data);
      return res.status(200).json(updatedSchedule);
    } catch (error: any) {
      console.error("Error updating schedule: ", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
