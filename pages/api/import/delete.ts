// deleteImport API
import { NextApiRequest, NextApiResponse } from "next";
import { deleteImport } from "@/lib/actions/import.action";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "DELETE") {
        try {
            const id = req.query.id;
            const result = await deleteImport(id as string);
            return res
                .status(200)
                .json({ message: "Import deleted successfully" });
        } catch (error) {
            console.error("Error deleting import: ", error);
            return res.status(500).json({ error: "Failed to delete import" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}