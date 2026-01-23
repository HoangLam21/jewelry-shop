import { NextApiRequest, NextApiResponse } from "next";
import { getOrders, getOrdersByCustomerId } from "@/lib/actions/order.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

// Server-side cache
let ordersCache: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
) {
  if (req.method === "GET") {
    try {
      const now = Date.now();

      // Check cache for admin/staff
      if (
        (auth.role === "staff" || auth.role === "admin") &&
        ordersCache &&
        now - cacheTime < CACHE_DURATION
      ) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=30, stale-while-revalidate=60"
        );
        return res.status(200).json(ordersCache);
      }

      // Customer - fetch their own orders
      if (auth.role === "customer" && auth.userIdInDb) {
        const orders = await getOrdersByCustomerId(auth.userIdInDb);
        res.setHeader(
          "Cache-Control",
          "private, s-maxage=30, stale-while-revalidate=60"
        );
        return res.status(200).json(orders);
      }

      // Staff/Admin - fetch all orders
      if (auth.role === "staff" || auth.role === "admin") {
        const orders = await getOrders();
        ordersCache = orders;
        cacheTime = now;

        res.setHeader(
          "Cache-Control",
          "public, s-maxage=30, stale-while-revalidate=60"
        );
        return res.status(200).json(orders);
      }

      return res.status(403).json({ error: "Forbidden" });
    } catch (error) {
      console.error("Error fetching orders: ", error);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withCustomerOrAbove(handler);
