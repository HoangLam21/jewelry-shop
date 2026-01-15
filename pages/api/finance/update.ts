// Update a finance record
import { NextApiRequest, NextApiResponse } from "next";
import { updateFinance } from "@/lib/actions/finance.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
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

export default withAdmin(handler);