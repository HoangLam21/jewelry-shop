// Create a new report
import { NextApiRequest, NextApiResponse } from "next";
import { createReport } from "@/lib/actions/report.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "POST") {
        try {
            const data = req.body;
            const report = await createReport(data);
            return res.status(201).json(report);
        } catch (error) {
            console.error("Error creating report: ", error);
            return res.status(500).json({ error: "Failed to create report" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withAdmin(handler);
