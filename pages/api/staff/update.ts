import { NextApiRequest, NextApiResponse } from "next/types";
import { updateStaff } from "@/lib/actions/staff.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";
import Staff from "@/database/staff.model";
import { connectToDatabase } from "@/lib/mongoose";

// Các field mà staff KHÔNG được tự sửa (chỉ admin mới sửa được)
const ADMIN_ONLY_FIELDS = ['salary', 'position', 'enrolledDate', 'kindOfJob'];

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  if (req.method === "PUT") {
    const { id } = req.query;
    const data = req.body; 

    if (!id || typeof id !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "ID nhân viên không hợp lệ.",
        error: "Invalid or missing staff ID" 
      });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({ 
        success: false,
        message: "Dữ liệu cập nhật không hợp lệ.",
        error: "Invalid or missing data for update" 
      });
    }

    try {
      // Admin có thể cập nhật tất cả
      // Staff chỉ có thể cập nhật thông tin của chính mình (trừ một số field nhạy cảm)
      if (auth.role === 'staff') {
        await connectToDatabase();
        const staffRecord = await Staff.findById(id).select('clerkId');
        
        if (!staffRecord || staffRecord.clerkId !== auth.userId) {
          return res.status(403).json({ 
            success: false,
            message: "Bạn chỉ có thể cập nhật thông tin của chính mình.",
            error: "Forbidden - Can only update own profile" 
          });
        }
        
        // Kiểm tra xem staff có đang cố sửa các field nhạy cảm không
        const attemptedAdminFields = ADMIN_ONLY_FIELDS.filter(field => data[field] !== undefined);
        if (attemptedAdminFields.length > 0) {
          return res.status(403).json({ 
            success: false,
            message: `Bạn không có quyền thay đổi: ${attemptedAdminFields.join(', ')}. Vui lòng liên hệ admin.`,
            error: "Forbidden - Cannot modify admin-only fields" 
          });
        }
      }

      console.log(`[Staff Update] Updating staff ${id} by ${auth.role}: ${auth.userId}`);
      const updatedStaff = await updateStaff(id, data);
      
      if (!updatedStaff) {
        return res.status(404).json({ 
          success: false,
          message: "Không tìm thấy nhân viên để cập nhật.",
          error: "Staff not found" 
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công!",
        data: updatedStaff
      });
    } catch (error) {
      console.error("Error updating staff:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Không thể cập nhật nhân viên.";
      
      return res.status(500).json({ 
        success: false,
        message: errorMessage,
        error: "Failed to update staff" 
      });
    }
  } else {
    return res.status(405).json({ 
      success: false,
      message: "Phương thức không được phép.",
      error: "Method not allowed" 
    });
  }
}

export default withStaffOrAdmin(handler);