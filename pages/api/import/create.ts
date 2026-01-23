import { NextApiRequest, NextApiResponse } from "next";
import { createImport } from "@/lib/actions/import.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
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
      
      // Tự động lấy staff ID từ user đang đăng nhập
      // Nếu user là staff, dùng staff ID của họ
      // Nếu user là admin, có thể dùng staff ID từ request body hoặc yêu cầu chọn staff
      if (auth.role === "staff" && auth.userIdInDb) {
        // Override staff ID với ID của staff đang đăng nhập
        data.staff = auth.userIdInDb;
        console.log(`[Import Create] Auto-setting staff ID to authenticated staff: ${auth.userIdInDb}`);
      } else if (auth.role === "admin") {
        // Admin có thể tạo import cho staff khác, nhưng nếu không có staff ID thì báo lỗi
        if (!data.staff) {
          return res.status(400).json({ error: "Staff ID is required when creating import as admin" });
        }
        console.log(`[Import Create] Admin creating import for staff: ${data.staff}`);
      }
      
      // Validate required fields
      if (!data.staff || !data.provider) {
        return res.status(400).json({ error: "Missing required fields: staff and provider" });
      }

      // Validate provider is not empty string
      if (data.provider.trim() === "") {
        return res.status(400).json({ error: "Provider ID cannot be empty. Please select a provider." });
      }

      // Validate ObjectId format
      const isValidObjectId = (id: string): boolean => {
        return /^[0-9a-fA-F]{24}$/.test(id);
      };

      if (!isValidObjectId(data.staff)) {
        return res.status(400).json({ error: `Invalid staff ID format: ${data.staff}` });
      }

      if (!isValidObjectId(data.provider)) {
        return res.status(400).json({ error: `Invalid provider ID format: ${data.provider}. Please select a valid provider.` });
      }
      
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

export default withStaffOrAdmin(handler);