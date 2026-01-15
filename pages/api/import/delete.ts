// deleteImport API
import { NextApiRequest, NextApiResponse } from "next";
import { deleteImport } from "@/lib/actions/import.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
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

export default withStaffOrAdmin(handler);