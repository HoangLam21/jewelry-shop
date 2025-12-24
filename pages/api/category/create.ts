// Create a new category
import { NextApiRequest, NextApiResponse } from "next";
import { createCategory } from "@/lib/actions/category.action"; // Đảm bảo đường dẫn chính xác

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
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