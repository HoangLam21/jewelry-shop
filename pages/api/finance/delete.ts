// Delete a finance record
import { NextApiRequest, NextApiResponse } from "next";
import { deleteFinance } from "@/lib/actions/finance.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
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

export default withAdmin(handler);