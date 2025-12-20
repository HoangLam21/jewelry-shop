import { NextApiRequest, NextApiResponse } from "next";
import { getRatingById } from "@/lib/actions/rating.action"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid Rating ID" });
    }

    try {
      const rating = await getRatingById(id);
      return res.status(200).json(rating);
    } catch (error) {
      console.error("Error fetching rating: ", error);
      return res.status(500).json({ error: "Failed to fetch rating" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
