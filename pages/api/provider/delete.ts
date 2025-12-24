import { NextApiRequest, NextApiResponse } from "next/types";
import { deleteProvider } from "@/lib/actions/provider.action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ error: "Provider ID is required" });
    }

    try {
      const result = await deleteProvider(id as string);
      return res.status(200).json({ message: "Provider deleted successfully" });
    } catch (error) {
      console.error("Error deleting provider:", error);
      return res.status(500).json({ error: "Failed to delete provider" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
