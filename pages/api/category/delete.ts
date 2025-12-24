// Delete a category
import { NextApiRequest, NextApiResponse } from "next";
import { deleteCategory } from "@/lib/actions/category.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "DELETE") {
        try {
            const categoryId = req.query.categoryId;
            const result = await deleteCategory(categoryId as string);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error deleting category: ", error);
            return res.status(500).json({ error: "Failed to delete category" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}