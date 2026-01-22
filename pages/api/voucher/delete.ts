import { deleteVoucher } from "@/lib/actions/voucher.action";
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
  console.log(`Deleting voucher with ID: ${id}`); // Log ID đang được xử lý
  try {
    if (req.method === "DELETE") {
      const deletedVoucher = await deleteVoucher(id);
      return res.status(200).json(deletedVoucher);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error deleting Voucher:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return res.status(500).json({ error: message });
  }
}

export default withStaffOrAdmin(handler);
