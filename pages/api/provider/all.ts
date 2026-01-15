import { NextApiRequest, NextApiResponse } from "next/types";
import { getProviders } from "@/lib/actions/provider.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  if (req.method === "GET") {
    try {
      const providers = await getProviders();
      return res.status(200).json(providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
      return res.status(500).json({ error: "Failed to fetch providers" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withStaffOrAdmin(handler);
