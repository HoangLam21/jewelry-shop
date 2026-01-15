// Update a report
import { NextApiRequest, NextApiResponse } from "next";
import { updateReport } from "@/lib/actions/report.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "PATCH") {
        try {
            const reportId = req.query.reportId;
            const data = req.body;
            const updatedReport = await updateReport(reportId as string, data);
            return res.status(200).json(updatedReport);
        } catch (error) {
            console.error("Error updating report: ", error);
            return res.status(500).json({ error: "Failed to update report" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withAdmin(handler);
