// Create a new report
import { NextApiRequest, NextApiResponse } from "next";
import { createReport } from "@/lib/actions/report.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
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
