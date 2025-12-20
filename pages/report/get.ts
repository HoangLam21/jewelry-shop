// Get a report by ID
import { NextApiRequest, NextApiResponse } from "next";
import { getReportById } from "@/lib/actions/report.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
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
