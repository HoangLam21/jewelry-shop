// Get a report by ID
import { NextApiRequest, NextApiResponse } from "next";
import { getReportById } from "@/lib/actions/report.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "GET") {
        try {
            const reportId = req.query.reportId;
            const report = await getReportById(reportId as string);
            return res.status(200).json(report);
        } catch (error) {
            console.error("Error fetching report: ", error);
            return res.status(500).json({ error: "Failed to fetch report" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withAdmin(handler);
