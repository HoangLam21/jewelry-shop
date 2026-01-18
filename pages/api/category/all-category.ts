// Get all categories (Public - Guest can view)
import { NextApiRequest, NextApiResponse } from "next";
import { getCategories } from "@/lib/actions/category.action";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const categories = await getCategories();
            return res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching categories: ", error);
            return res
                .status(500)
                .json({ error: "Failed to fetch categories" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}