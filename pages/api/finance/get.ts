// Get a finance record by ID
import { NextApiRequest, NextApiResponse } from "next";
import { getFinanceById } from "@/lib/actions/finance.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const financeId = req.query.financeId;
            const finance = await getFinanceById(financeId as string);
            return res.status(200).json(finance);
        } catch (error) {
            console.error("Error fetching finance record by ID: ", error);
            return res
                .status(500)
                .json({ error: "Failed to fetch finance record" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}