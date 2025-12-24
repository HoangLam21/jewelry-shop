// Delete a finance record
import { NextApiRequest, NextApiResponse } from "next";
import { deleteFinance } from "@/lib/actions/finance.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "DELETE") {
        try {
            const financeId = req.query.financeId;
            const result = await deleteFinance(financeId as string);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error deleting finance record: ", error);
            return res
                .status(500)
                .json({ error: "Failed to delete finance record" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}