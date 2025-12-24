import { NextApiRequest, NextApiResponse } from "next";
import { createImport } from "@/lib/actions/import.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (req.method === "POST") {
  //   try {
  //     const data = req.body;

  //     // Validate required fields
  //     if (
  //       !data.staff ||
  //       !data.provider ||
  //       !Array.isArray(data.invoice) ||
  //       data.invoice.length === 0
  //     ) {
  //       return res.status(400).json({ error: "Missing required fields" });
  //     }

  //     // Validate invoice items
  //     for (const item of data.invoice) {
  //       if (
  //         !item.productId ||
  //         !item.material ||
  //         !item.size ||
  //         typeof item.unitPrice !== "number" ||
  //         typeof item.quantity !== "number" ||
  //         !item.discount
  //       ) {
  //         return res.status(400).json({ error: "Invalid invoice item data" });
  //       }
  //     }

  //     const newImport = await createImport(data);
  //     return res.status(201).json(newImport);
  //   } catch (error) {
  //     console.error("Error creating import: ", error);
  //     return res.status(500).json({ error: "Failed to create import" });
  //   }
  // } else {
  //   return res.status(405).json({ error: "Method not allowed" });
  // }
  if (req.method === "POST") {
    try {
      const data = req.body;
      const order = await createImport(data);
      return res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order: ", error);
      return res.status(500).json({ error: "Failed to create order" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}