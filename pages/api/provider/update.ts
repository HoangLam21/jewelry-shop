import { NextApiRequest, NextApiResponse } from "next/types";
import { updateProvider } from "@/lib/actions/provider.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

export const config = {
  api: {
    bodyParser: true, 
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  const { id } = req.query;

  if (req.method === "PUT") {
    if (!id) {
      return res.status(400).json({ error: "Provider ID is required" });
    }

    const { name, address, contact, representativeName, city, country  } = req.body;
    
    if (!name && !address && !contact) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    try {
      const updatedProvider = await updateProvider(id as string, { name, address, contact, representativeName, city, country  });
      return res.status(200).json(updatedProvider);
    } catch (error) {
      console.error("Error updating provider:", error);
      return res.status(500).json({ error: "Failed to update provider" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withStaffOrAdmin(handler);
