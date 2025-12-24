import { NextApiRequest, NextApiResponse } from "next";
import { getSchedulesOfStaff } from "@/lib/actions/schedule.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const schedules = await getSchedulesOfStaff(id as string);
      return res.status(200).json(schedules);
    } catch (error: any) {
      console.error("Error fetching schedules of staff: ", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
