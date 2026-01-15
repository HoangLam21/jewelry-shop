// Delete a report
import { NextApiRequest, NextApiResponse } from "next";
import { deleteReport } from "@/lib/actions/report.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "DELETE") {
        try {
            const reportId = req.query.reportId;
            const result = await deleteReport(reportId as string);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error deleting report: ", error);
            return res.status(500).json({ error: "Failed to delete report" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withAdmin(handler);
