import { getVoucherById } from "@/lib/actions/voucher.action";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid Voucher ID" });
  }

  try {
    if (req.method === "GET") {
      const voucher = await getVoucherById(id);
      return res.status(200).json(voucher);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error fetching Voucher by ID:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return res.status(500).json({ error: message });
  }
}
