// Add a product variant to a cart
import { NextApiRequest, NextApiResponse } from "next";
import { addProductVariantToCart } from "@/lib/actions/cart.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "POST") {
        try {
            const userId = req.query.userId;
            const productId = req.query.productId;
            const material = req.query.material;
            const size = req.query.size;
            const quantity = req.query.quantity;
            const cart = await addProductVariantToCart(
                userId as string,
                productId as string,
                parseInt(quantity as string),
                material as string,
                size as string
            );
            return res.status(200).json(cart);
        } catch (error) {
            console.error("Error adding product variant to cart: ", error);
            return res
                .status(500)
                .json({ error: "Failed to add product variant to cart" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withCustomerOrAbove(handler);