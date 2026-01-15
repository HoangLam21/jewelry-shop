import { createVoucher } from "@/lib/actions/voucher.action";
import { NextApiRequest, NextApiResponse } from "next";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  try {
    if (req.method === "POST") {
      const newVoucher = await createVoucher(req.body);
      return res.status(201).json(newVoucher);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Error creating Voucher: ", error);
    return res.status(500).json({ error: error.message });
  }
}

export default withStaffOrAdmin(handler);
