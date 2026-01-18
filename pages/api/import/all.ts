// Get all imports
import { NextApiRequest, NextApiResponse } from "next";
import { getImports } from "@/lib/actions/import.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "GET") {
        try {
            const imports = await getImports();
            return res.status(200).json(imports);
        } catch (error) {
            console.error("Error fetching imports: ", error);
            return res.status(500).json({ error: "Failed to fetch imports" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withStaffOrAdmin(handler);