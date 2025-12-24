// getImportById API
import { NextApiRequest, NextApiResponse } from "next";
import { getImportById } from "@/lib/actions/import.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query; // Lấy ID từ query params

      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid or missing staff ID" });
      }
      const importData = await getImportById(id);
      return res.status(200).json(importData);
    } catch (error) {
      console.error("Error fetching import by ID: ", error);
      return res.status(500).json({ error: "Failed to fetch import by ID" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}