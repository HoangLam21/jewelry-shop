// Update a category
import { NextApiRequest, NextApiResponse } from "next";
import { updateCategory } from "@/lib/actions/category.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PUT") {
        try {
            const categoryId = req.query.categoryId;
            const data = req.body;
            const updatedCategory = await updateCategory(
                categoryId as string,
                data
            );
            return res.status(200).json(updatedCategory);
        } catch (error) {
            console.error("Error updating category: ", error);
            return res.status(500).json({ error: "Failed to update category" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}