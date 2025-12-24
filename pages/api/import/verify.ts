// verifyImport API
import { NextApiRequest, NextApiResponse } from "next";
import { verifyImport } from "@/lib/actions/import.action";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PATCH") {
        try {
            const id = req.query.id;
            const result = await verifyImport(id as string);
            return res
                .status(200)
                .json({ message: "Import verified successfully" });
        } catch (error) {
            console.error("Error verifying import: ", error);
            return res.status(500).json({ error: "Failed to verify import" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}