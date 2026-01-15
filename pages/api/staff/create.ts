import { NextApiRequest, NextApiResponse } from "next/types";
import { createStaff } from "@/lib/actions/staff.action";
import { withAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) {
  if (req.method === "POST") {
    const data = req.body; 

    if (!data || typeof data !== "object") {
      return res.status(400).json({ 
        success: false,
        message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào.",
        error: "Invalid or missing data for staff creation" 
      });
    }

    try {
      // auth parameter is available but not required for this endpoint
      // It's already verified by withAdmin wrapper that user is admin
      console.log(`[Staff Create] Creating staff by admin: ${auth.userId}`);
      
      const newStaff = await createStaff(data);
      
      // Kiểm tra xem có Clerk ID không để xác nhận đã tạo Clerk user
      const message = newStaff.clerkId 
        ? "Tạo nhân viên thành công! Tài khoản Clerk đã được tạo và email mời đăng nhập đã được gửi."
        : "Tạo nhân viên thành công!";
      
      return res.status(201).json({ 
        success: true,
        message: message,
        data: newStaff
      });
    } catch (error) {
      console.error("Error creating staff:", error);
      
      // Trả về error message chi tiết và thân thiện hơn
      const errorMessage = error instanceof Error ? error.message : "Không thể tạo nhân viên. Vui lòng thử lại sau.";
      
      // Phân biệt validation error (400) và server error (500)
      const isValidationError = errorMessage.includes("required") || 
                                errorMessage.includes("Validation") ||
                                errorMessage.includes("cannot be empty");
      
      const statusCode = isValidationError ? 400 : 500;
      
      // Tạo message thân thiện hơn cho user
      let userFriendlyMessage = errorMessage;
      if (isValidationError) {
        // Map field names to Vietnamese
        const fieldMap: { [key: string]: string } = {
          'fullName': 'Họ và tên',
          'phoneNumber': 'Số điện thoại',
          'email': 'Email',
          'address': 'Địa chỉ',
          'position': 'Chức vụ',
          'province': 'Tỉnh/Thành phố',
          'district': 'Quận/Huyện',
          'salary': 'Lương',
          'experience': 'Kinh nghiệm',
          'kindOfJob': 'Loại công việc',
          'description': 'Mô tả'
        };
        
        // Tìm field name trong error message và thay thế
        for (const [key, value] of Object.entries(fieldMap)) {
          if (errorMessage.includes(key)) {
            userFriendlyMessage = `Vui lòng nhập ${value.toLowerCase()}. Trường này là bắt buộc.`;
            break;
          }
        }
      }
      
      return res.status(statusCode).json({ 
        success: false,
        message: userFriendlyMessage,
        error: errorMessage
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

export default withAdmin(handler);