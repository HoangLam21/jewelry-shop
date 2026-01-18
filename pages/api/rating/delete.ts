import { NextApiRequest, NextApiResponse } from "next";
import { deleteRating } from "@/lib/actions/rating.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid Rating ID" });
    }

    try {
      const deletedRating = await deleteRating(id);
      return res.status(200).json(deletedRating);
    } catch (error) {
      console.error("Error deleting rating: ", error);
      return res.status(500).json({ error: "Failed to delete rating" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withCustomerOrAbove(handler);
