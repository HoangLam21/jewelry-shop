import { NextApiRequest, NextApiResponse } from "next/types";
import { getStaffById } from "@/lib/actions/staff.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";
import Staff from "@/database/staff.model";
import { connectToDatabase } from "@/lib/mongoose";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "ID nhân viên không hợp lệ.",
        error: "Invalid or missing staff ID" 
      });
    }

    try {
      // Admin có thể xem tất cả
      // Staff chỉ có thể xem thông tin của chính mình
      if (auth.role === 'staff') {
        await connectToDatabase();
        const staffRecord = await Staff.findById(id).select('clerkId');
        
        if (!staffRecord || staffRecord.clerkId !== auth.userId) {
          return res.status(403).json({ 
            success: false,
            message: "Bạn chỉ có thể xem thông tin của chính mình.",
            error: "Forbidden - Can only view own profile" 
          });
        }
      }

      console.log(`[Staff Get] Fetching staff ${id} by ${auth.role}: ${auth.userId}`);
      const staff = await getStaffById(id);
      
      if (!staff) {
        return res.status(404).json({ 
          success: false,
          message: "Không tìm thấy nhân viên.",
          error: "Staff not found" 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: staff
      });
    } catch (error) {
      console.error("Error fetching staff by ID:", error);
      return res.status(500).json({ 
        success: false,
        message: "Không thể lấy thông tin nhân viên.",
        error: "Failed to fetch staff" 
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