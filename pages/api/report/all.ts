// Get all reports
import { NextApiRequest, NextApiResponse } from "next";
import { getReports } from "@/lib/actions/report.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "GET") {
        try {
            const reports = await getReports();
            return res.status(200).json(reports);
        } catch (error) {
            console.error("Error fetching reports: ", error);
            return res.status(500).json({ error: "Failed to fetch reports" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withAdmin(handler);
