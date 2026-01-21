import { updateVoucher } from "@/lib/actions/voucher.action";
import { NextApiRequest, NextApiResponse } from "next";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid Voucher ID" });
  }

  try {
    if (req.method === "PUT") {
      const updatedVoucher = await updateVoucher(id, req.body);
      return res.status(200).json(updatedVoucher);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error updating Voucher:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return res.status(500).json({ error: message });
  }
}

export default withStaffOrAdmin(handler);
