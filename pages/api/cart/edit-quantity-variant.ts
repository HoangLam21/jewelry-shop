// Edit the quantity of a product variant in a cart
import { NextApiRequest, NextApiResponse } from "next";
import { editProductVariantQuantityInCart } from "@/lib/actions/cart.action";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PATCH") {
        try {
            const userId = req.query.userId;
            const productId = req.query.productId;
            const material = req.query.material;
            const size = req.query.size;
            const newQuantity = req.query.newQuantity;
            const cart = await editProductVariantQuantityInCart(
                userId as string,
                productId as string,
                material as string,
                size as string,
                parseInt(newQuantity as string)
            );
            return res.status(200).json(cart);
        } catch (error) {
            console.error(
                "Error editing product variant quantity in cart: ",
                error
            );
            return res.status(500).json({
                error: "Failed to edit product variant quantity in cart",
            });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}