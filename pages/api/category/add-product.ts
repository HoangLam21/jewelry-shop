// Add a product to a category
import { NextApiRequest, NextApiResponse } from "next";
import { addProductToCategory } from "@/lib/actions/category.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {
            const categoryId = req.body.categoryId;
            const productId = req.body.productId;
            const result = await addProductToCategory(categoryId, productId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error adding product to category: ", error);
            return res
                .status(500)
                .json({ error: "Failed to add product to category" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}