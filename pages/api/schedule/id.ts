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
    } catch (error: any) {
      console.error("Error fetching schedule by ID: ", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
