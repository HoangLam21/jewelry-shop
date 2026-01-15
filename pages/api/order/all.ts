// Get all orders (staff/admin) or customer's own orders (customer)
import { NextApiRequest, NextApiResponse } from "next";
import { getOrders, getOrdersByCustomerId } from "@/lib/actions/order.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "GET") {
        try {
            // Nếu user là customer, chỉ trả về đơn hàng của chính họ
            if (auth.role === "customer" && auth.userIdInDb) {
                const orders = await getOrdersByCustomerId(auth.userIdInDb);
                return res.status(200).json(orders);
            }
            
            // Nếu user là staff hoặc admin, trả về tất cả đơn hàng
            if (auth.role === "staff" || auth.role === "admin") {
                const orders = await getOrders();
                return res.status(200).json(orders);
            }
            
            return res.status(403).json({ error: "Forbidden" });
        } catch (error) {
            console.error("Error fetching orders: ", error);
            return res.status(500).json({ error: "Failed to fetch orders" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withCustomerOrAbove(handler);