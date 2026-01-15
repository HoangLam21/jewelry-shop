// Calculate the sum of all finances between two dates
import { NextApiRequest, NextApiResponse } from "next";
import { calculateReportFinancesBetweenDates } from "@/lib/actions/report.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    const startDateString = req.query.startDate as string;
    const endDateString = req.query.endDate as string;

    if (req.method === "GET") {
        try {
            const reportId = req.query.reportId;
            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);

            const totalFinances = await calculateReportFinancesBetweenDates(
                startDate,
                endDate,
                reportId as string
            );
            return res.status(200).json(totalFinances);
        } catch (error) {
            console.error("Error calculating finances: ", error);
            return res
                .status(500)
                .json({ error: "Failed to calculate finances" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withAdmin(handler);
