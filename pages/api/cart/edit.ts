// Edit the quantity of a product in a cart
import { NextApiRequest, NextApiResponse } from "next";
import { editProductQuantityInCart } from "@/lib/actions/cart.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "PATCH") {
        try {
            const userId = req.query.userId;
            const productId = req.query.productId;
            const newQuantity = req.query.newQuantity;
            const cart = await editProductQuantityInCart(
                userId as string,
                productId as string,
                parseInt(newQuantity as string)
            );
            return res.status(200).json(cart);
        } catch (error) {
            console.error("Error editing product quantity in cart: ", error);
            return res
                .status(500)
                .json({ error: "Failed to edit product quantity in cart" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withCustomerOrAbove(handler);