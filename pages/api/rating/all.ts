import { NextApiRequest, NextApiResponse } from "next";
import { getAllRatings } from "@/lib/actions/rating.action"; // Adjust the path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const ratings = await getAllRatings(); // Call the action to fetch all ratings
      return res.status(200).json(ratings); // Return the ratings as a response
    } catch (error) {
      console.error("Error fetching all ratings: ", error);
      return res.status(500).json({ error: "Failed to fetch all ratings" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
