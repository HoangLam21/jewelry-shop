import { NextApiRequest, NextApiResponse } from "next/types";
import { IncomingForm } from "formidable";
import { uploadStaffAvatar } from "@/lib/actions/user.action";
import { getAuthUser } from "@/lib/utils/api-auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Manual auth check vì không thể dùng withAdmin wrapper với formidable
  const auth = await getAuthUser(req);
  
  if (!auth || !auth.isAuthenticated) {
    return res.status(401).json({ 
      success: false,
      message: "Vui lòng đăng nhập.",
      error: "Unauthorized" 
    });
  }
  
  if (auth.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: "Bạn không có quyền thực hiện thao tác này.",
      error: "Forbidden - Admin only" 
    });
  }

  if (req.method === "POST") {
    const form = new IncomingForm();
    const { id } = req.query;
    
    if (!id || typeof id !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "ID nhân viên không hợp lệ.",
        error: "Invalid or missing staff ID" 
      });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing FormData:", err);
        return res.status(400).json({ 
          success: false,
          message: "Không thể xử lý file upload.",
          error: "Failed to parse FormData" 
        });
      }
      
      const image = files.image
        ? Array.isArray(files.image)
          ? files.image[0]
          : files.image
        : null;
        
      if (!image || image === null) {
        return res.status(400).json({ 
          success: false,
          message: "Vui lòng chọn ảnh để upload.",
          error: "Missing image" 
        });
      }
      
      try {
        console.log(`[Staff Avatar] Uploading avatar for staff ${id} by admin: ${auth.userId}`);
        const result = await uploadStaffAvatar(id, image);
        
        return res.status(200).json({
          success: true,
          message: "Upload ảnh đại diện thành công!",
          data: result
        });
      } catch (error) {
        console.error("Error uploading staff avatar:", error);
        return res.status(500).json({ 
          success: false,
          message: "Không thể upload ảnh đại diện.",
          error: "Failed to upload avatar" 
        });
      }
    });
  } else {
    return res.status(405).json({ 
      success: false,
      message: "Phương thức không được phép.",
      error: "Method not allowed" 
    });
  }
}