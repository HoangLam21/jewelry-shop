// Create a new category
import { NextApiRequest, NextApiResponse } from "next";
import { createCategory } from "@/lib/actions/category.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "POST") {
        try {
            const data = req.body;
            const category = await createCategory(data);
            return res.status(201).json(category);
        } catch (error) {
            console.error("Error creating category: ", error);
            return res.status(500).json({ error: "Failed to create category" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withStaffOrAdmin(handler);