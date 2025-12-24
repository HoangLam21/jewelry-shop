// Create a new finance record
import { NextApiRequest, NextApiResponse } from "next";
import { createFinance } from "@/lib/actions/finance.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {
            const data = req.body;
            const finance = await createFinance(data);
            return res.status(201).json(finance);
        } catch (error) {
            console.error("Error creating finance record: ", error);
            return res
                .status(500)
                .json({ error: "Failed to create finance record" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}