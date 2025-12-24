// Remove a product variant from a cart
import { NextApiRequest, NextApiResponse } from "next";
import { removeProductVariantFromCart } from "@/lib/actions/cart.action";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "DELETE") {
        try {
            const userId = req.query.userId;
            const productId = req.query.productId;
            const material = req.query.material;
            const size = req.query.size;
            const cart = await removeProductVariantFromCart(
                userId as string,
                productId as string,
                material as string,
                size as string
            );
            return res.status(200).json(cart);
        } catch (error) {
            console.error("Error removing product variant from cart: ", error);
            return res
                .status(500)
                .json({ error: "Failed to remove product variant from cart" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}