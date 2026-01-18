// Edit a product's category
import { NextApiRequest, NextApiResponse } from "next";
import { editProductCategory } from "@/lib/actions/category.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "PUT") {
        try {
            const productId = req.body.productId;
            const newCategoryId = req.body.newCategoryId;
            const result = await editProductCategory(productId, newCategoryId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error editing product category: ", error);
            return res
                .status(500)
                .json({ error: "Failed to edit product category" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withStaffOrAdmin(handler);