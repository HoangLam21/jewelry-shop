import { NextApiRequest, NextApiResponse } from "next";
import { getVouchers } from "@/lib/actions/voucher.action";

let vouchersCache: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const now = Date.now();

      if (vouchersCache && now - cacheTime < CACHE_DURATION) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=60, stale-while-revalidate=120"
        );
        return res.status(200).json(vouchersCache);
      }

      const vouchers = await getVouchers();
      vouchersCache = vouchers;
      cacheTime = now;

      res.setHeader(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=120"
      );

      return res.status(200).json(vouchers);
    } catch (error) {
      console.error("Error fetching vouchers: ", error);
      return res.status(500).json({ error: "Failed to fetch vouchers" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
