// Get all information of a cart with product variants
import { NextApiRequest, NextApiResponse } from "next";
import { getCartInformationWithVariants } from "@/lib/actions/cart.action";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const userId = req.query.userId;
            const cart = await getCartInformationWithVariants(userId as string);
            return res.status(200).json(cart);
        } catch (error) {
            console.error(
                "Error getting cart information with variants: ",
                error
            );
            return res.status(500).json({
                error: "Failed to get cart information with variants",
            });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}