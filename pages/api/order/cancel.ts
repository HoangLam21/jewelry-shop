// Cancel order
import { NextApiRequest, NextApiResponse } from "next";
import { cancelOrder } from "@/lib/actions/order.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "PATCH") {
        try {
            const orderId = req.query.orderId;
            const result = await cancelOrder(orderId as string);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error canceling order: ", error);
            return res.status(500).json({ error: "Failed to cancel order" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withStaffOrAdmin(handler);