// Delete a category
import { NextApiRequest, NextApiResponse } from "next";
import { deleteCategory } from "@/lib/actions/category.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
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

export default withStaffOrAdmin(handler);