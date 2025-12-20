import { NextApiRequest, NextApiResponse } from "next/types";
import { createProvider } from "@/lib/actions/provider.action";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, address, contact, representativeName, city, country } = req.body;

    if (!name || !address || !contact) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const newProvider = await createProvider({ name, address, contact, representativeName, city, country });
      return res.status(201).json(newProvider);
    } catch (error) {
      console.error("Error creating provider:", error);
      return res.status(500).json({ error: "Failed to create provider" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
