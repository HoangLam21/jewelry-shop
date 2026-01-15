import { NextApiRequest, NextApiResponse } from "next/types";
import { getProviderById } from "@/lib/actions/provider.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  const { id } = req.query;
  
  if (req.method === "GET") {
    if (!id) {
      return res.status(400).json({ error: "Provider ID is required" });
    }

    try {
      const provider = await getProviderById(id as string);
      return res.status(200).json(provider);
    } catch (error) {
      console.error("Error fetching provider:", error);
      return res.status(500).json({ error: "Failed to fetch provider" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withStaffOrAdmin(handler);
