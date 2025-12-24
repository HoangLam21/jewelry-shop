// Get all orders
import { NextApiRequest, NextApiResponse } from "next";
import { getOrders } from "@/lib/actions/order.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const orders = await getOrders();
            return res.status(200).json(orders);
        } catch (error) {
            console.error("Error fetching orders: ", error);
            return res.status(500).json({ error: "Failed to fetch orders" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}