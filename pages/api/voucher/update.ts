import { updateVoucher } from "@/lib/actions/voucher.action";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
  } catch (error: any) {
    console.error("Error updating Voucher: ", error);
    return res.status(500).json({ error: error.message });
  }
}
