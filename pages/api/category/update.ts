// Update a category
import { NextApiRequest, NextApiResponse } from "next";
import { updateCategory } from "@/lib/actions/category.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
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

export default withStaffOrAdmin(handler);