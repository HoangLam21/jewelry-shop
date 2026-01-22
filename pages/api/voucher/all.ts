import { getVouchers } from "@/lib/actions/voucher.action";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const vouchers = await getVouchers();
      return res.status(200).json(vouchers);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error fetching Vouchers:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return res.status(500).json({ error: message });
  }
}
