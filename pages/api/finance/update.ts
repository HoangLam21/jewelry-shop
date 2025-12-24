// Update a finance record
import { NextApiRequest, NextApiResponse } from "next";
import { updateFinance } from "@/lib/actions/finance.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PATCH") {
        try {
            const financeId = req.query.financeId;
            const data = req.body;
            const updatedFinance = await updateFinance(
                financeId as string,
                data
            );
            return res.status(200).json(updatedFinance);
        } catch (error) {
            console.error("Error updating finance record: ", error);
            return res
                .status(500)
                .json({ error: "Failed to update finance record" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}