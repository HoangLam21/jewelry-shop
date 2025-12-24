// File: removeProductFromCategory.ts
import { NextApiRequest, NextApiResponse } from "next";
import { removeProductFromCategory } from "@/lib/actions/category.action";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "DELETE") {
        try {
            const categoryId = req.body.categoryId;
            const productId = req.body.productId;
            if (!categoryId || !productId) {
                return res
                    .status(400)
                    .json({ error: "Category ID and Product ID are required" });
            }
            const result = await removeProductFromCategory(
                categoryId,
                productId
            );
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error removing product from category: ", error);
            return res
                .status(500)
                .json({ error: "Failed to remove product from category" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}