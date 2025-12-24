// Create a new order
import { NextApiRequest, NextApiResponse } from "next";
import { createOrder } from "@/lib/actions/order.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {
            const data = req.body;
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