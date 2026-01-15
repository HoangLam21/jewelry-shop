// Get all finance records
import { NextApiRequest, NextApiResponse } from "next";
import { getFinances } from "@/lib/actions/finance.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "GET") {
        try {
            const finances = await getFinances();
            return res.status(200).json(finances);
        } catch (error) {
            console.error("Error fetching finance records: ", error);
            return res
                .status(500)
                .json({ error: "Failed to fetch finance records" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withAdmin(handler);