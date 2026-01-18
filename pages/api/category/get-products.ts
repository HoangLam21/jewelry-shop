// Get products of category (Public - Guest can view)
import { NextApiRequest, NextApiResponse } from "next";
import { getProductsOfCategory } from "@/lib/actions/category.action";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const categoryId = req.query.id;
            if (!categoryId) {
                return res
                    .status(400)
                    .json({ error: "Category ID is required" });
            }
            const products = await getProductsOfCategory(categoryId.toString());
            return res.status(200).json(products);
        } catch (error) {
            console.error("Error getting products of category: ", error);
            return res
                .status(500)
                .json({ error: "Failed to get products of category" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}