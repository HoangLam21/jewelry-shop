// Create a new order (customer can create their own orders, staff/admin can create any)
import { NextApiRequest, NextApiResponse } from "next";
import { createOrder } from "@/lib/actions/order.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "POST") {
        try {
            const data = req.body;
            
            // Nếu user là customer, tự động set customer ID từ auth
            if (auth.role === "customer") {
                if (!auth.userIdInDb) {
                    return res.status(400).json({ error: "Customer ID not found" });
                }
                // Override customer ID với ID của user đang đăng nhập
                data.customer = auth.userIdInDb;
            }
            
            // Validate required fields
            if (!data.customer || !data.staff) {
                return res.status(400).json({ error: "Missing required fields: customer and staff" });
            }
            
            const order = await createOrder(data);
            return res.status(201).json(order);
        } catch (error) {
            console.error("Error creating order: ", error);
            return res.status(500).json({ error: "Failed to create order" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withCustomerOrAbove(handler);