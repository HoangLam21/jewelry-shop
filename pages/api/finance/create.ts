// Create a new finance record
import { NextApiRequest, NextApiResponse } from "next";
import { createFinance } from "@/lib/actions/finance.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
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

export default withAdmin(handler);