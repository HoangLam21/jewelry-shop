// Create a new order (customer can create their own orders, staff/admin can create any)
import { NextApiRequest, NextApiResponse } from "next";
import { createOrder } from "@/lib/actions/order.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    auth: ApiAuthResult
) {
    if (req.method === "POST") {
        try {
            const data = req.body;
            console.log("[Order Create] Request data:", JSON.stringify(data, null, 2));
            console.log("[Order Create] Auth object:", {
                role: auth.role,
                userId: auth.userId,
                userIdInDb: auth.userIdInDb,
                isAuthenticated: auth.isAuthenticated
            });

            // Nếu user là customer, tự động set customer ID từ auth
            if (auth.role === "customer") {
                if (!auth.userIdInDb || auth.userIdInDb === "") {
                    console.log("[Order Create] Customer ID not found in auth. userIdInDb:", auth.userIdInDb);
                    return res.status(400).json({ error: "Customer ID not found. Please ensure you are logged in." });
                }
                // Override customer ID với ID của user đang đăng nhập (bất kể frontend gửi gì)
                data.customer = auth.userIdInDb;
                console.log("[Order Create] Override customer ID from auth:", data.customer);
                // Customer có thể tạo order không cần staff - staff sẽ được assign sau bởi admin/staff
                // Không validate staff cho customer orders
            }

            // Tự động lấy staff ID từ user đang đăng nhập (nếu là staff/admin)
            if ((auth.role === "staff" || auth.role === "admin") && auth.userIdInDb) {
                // Nếu user là staff, dùng staff ID của họ
                // Nếu user là admin, có thể dùng staff ID từ request body hoặc để trống (optional)
                if (auth.role === "staff") {
                    data.staff = auth.userIdInDb;
                    console.log(`[Order Create] Auto-setting staff ID to authenticated staff: ${auth.userIdInDb}`);
                } else if (auth.role === "admin") {
                    // Admin có thể tạo order với staff ID từ request body hoặc để trống
                    // Nếu staff là empty string, set thành undefined để không validate
                    if (data.staff === "" || !data.staff) {
                        data.staff = undefined;
                        console.log(`[Order Create] Admin creating order without staff assignment`);
                    }
                }
            }

            // Validate required fields - check sau khi đã override từ auth
            if (!data.customer || data.customer === "" || data.customer.trim() === "") {
                console.log("[Order Create] Missing or empty customer field after processing. Final value:", data.customer);
                return res.status(400).json({
                    error: "Missing required field: customer. Please ensure you are logged in and have a valid account."
                });
            }

            // Validate ObjectId format for customer
            const isValidObjectId = (id: string): boolean => {
                return /^[0-9a-fA-F]{24}$/.test(id);
            };

            if (!isValidObjectId(data.customer)) {
                console.log("[Order Create] Invalid customer ID format:", data.customer);
                return res.status(400).json({
                    error: `Invalid customer ID format: "${data.customer}". Customer ID must be a valid 24-character MongoDB ObjectId.`
                });
            }

            // Validate staff ObjectId format if provided
            if (data.staff && data.staff !== "" && !isValidObjectId(data.staff)) {
                console.log("[Order Create] Invalid staff ID format:", data.staff);
                return res.status(400).json({
                    error: `Invalid staff ID format: "${data.staff}". Staff ID must be a valid 24-character MongoDB ObjectId.`
                });
            }

            // Validate other required fields
            if (!data.cost || data.cost <= 0) {
                console.log("[Order Create] Invalid cost:", data.cost);
                return res.status(400).json({ error: "Invalid cost" });
            }

            if (!data.details || !Array.isArray(data.details) || data.details.length === 0) {
                console.log("[Order Create] Invalid details:", data.details);
                return res.status(400).json({ error: "Order must have at least one item" });
            }

            if (!data.status) {
                console.log("[Order Create] Missing status");
                return res.status(400).json({ error: "Missing required field: status" });
            }

            if (!data.shippingMethod) {
                console.log("[Order Create] Missing shippingMethod");
                return res.status(400).json({ error: "Missing required field: shippingMethod" });
            }

            // Chỉ validate staff cho staff role (staff phải có staff ID)
            // Admin và customer có thể tạo order không có staff
            if (auth.role === "staff" && !data.staff) {
                console.log("[Order Create] Missing staff field for staff role");
                return res.status(400).json({ error: "Missing required field: staff" });
            }

            // Normalize empty string to undefined
            if (data.staff === "" || data.staff === null) {
                data.staff = undefined;
            }

            console.log("[Order Create] Calling createOrder with data:", {
                customer: data.customer,
                staff: data.staff || "undefined",
                cost: data.cost,
                detailsCount: data.details?.length || 0
            });

            const order = await createOrder(data);
            console.log("[Order Create] Order created successfully:", order._id);
            return res.status(201).json(order);
        } catch (error) {
            console.error("[Order Create] Error creating order:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to create order";
            return res.status(500).json({ error: errorMessage });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

export default withCustomerOrAbove(handler);