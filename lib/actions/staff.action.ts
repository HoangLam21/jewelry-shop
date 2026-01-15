"use server";
import Staff from "@/database/staff.model";
import { connectToDatabase } from "../mongoose";
import { createClerkUser, syncRoleToClerk } from "./clerk.action";

export const createStaff = async (data: {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  avatar: string;
  gender: boolean;
  birthday: Date;
  enrolledDate: Date;
  salary: string;
  position: string;
  province: string;
  district: string;
  experience: string;
  kindOfJob: string;
  description: string;
}) => {
  try {
    await connectToDatabase();
    
    // Validate và sanitize required string fields
    // Mongoose không chấp nhận chuỗi rỗng cho required fields
    const fieldNames: { [key: string]: string } = {
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

    const sanitizeString = (value: string | undefined | null, fieldName: string): string => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        const displayName = fieldNames[fieldName] || fieldName;
        throw new Error(`${displayName} là bắt buộc và không được để trống`);
      }
      return value.trim();
    };

    // Validate required fields
    const requiredFields = {
      fullName: sanitizeString(data.fullName, 'fullName'),
      phoneNumber: sanitizeString(data.phoneNumber, 'phoneNumber'),
      email: sanitizeString(data.email, 'email'),
      address: sanitizeString(data.address, 'address'),
      position: sanitizeString(data.position, 'position'),
      province: sanitizeString(data.province, 'province'),
      district: sanitizeString(data.district, 'district'),
      salary: sanitizeString(data.salary, 'salary'),
      experience: sanitizeString(data.experience, 'experience'),
      kindOfJob: sanitizeString(data.kindOfJob, 'kindOfJob'),
      description: sanitizeString(data.description, 'description'),
    };

    // Avatar có thể là chuỗi rỗng (optional hoặc có default)
    const avatar = data.avatar?.trim() || '';

    // Tách firstName và lastName từ fullName
    const nameParts = requiredFields.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Tạo user trên Clerk trước
    console.log(`[Staff Create] Creating Clerk user for email: ${requiredFields.email}`);
    const clerkUserResult = await createClerkUser({
      email: requiredFields.email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: requiredFields.phoneNumber,
      // Không set password - Clerk sẽ gửi invitation email để user tự set password
    });

    if (!clerkUserResult.success || !clerkUserResult.userId) {
      // Trả về message thân thiện từ createClerkUser
      throw new Error(clerkUserResult.message || `Không thể tạo tài khoản Clerk: ${clerkUserResult.error}`);
    }

    const clerkId = clerkUserResult.userId;
    console.log(`[Staff Create] Clerk user created with ID: ${clerkId}`);

    // Tạo Staff record với clerkId
    const newStaff = await Staff.create({
      clerkId: clerkId, // Lưu Clerk ID để liên kết
      fullName: requiredFields.fullName,
      phoneNumber: requiredFields.phoneNumber,
      email: requiredFields.email,
      address: requiredFields.address,
      avatar: avatar,
      gender: data.gender,
      birthday: data.birthday,
      enrolledDate: data.enrolledDate,
      salary: requiredFields.salary,
      position: requiredFields.position,
      province: requiredFields.province,
      district: requiredFields.district,
      experience: requiredFields.experience,
      kindOfJob: requiredFields.kindOfJob,
      description: requiredFields.description,
      createdAt: new Date(),
    });

    // Sync role "staff" lên Clerk metadata
    console.log(`[Staff Create] Syncing role "staff" to Clerk metadata for ${clerkId}`);
    const syncResult = await syncRoleToClerk(clerkId, 'staff');
    if (!syncResult.success) {
      console.warn(`[Staff Create] Warning: Failed to sync role to Clerk: ${syncResult.error}`);
      // Không throw error vì staff đã được tạo, chỉ cảnh báo
    }

    console.log(`[Staff Create] Staff created successfully with Clerk ID: ${clerkId}`);
    return newStaff;
  } catch (error) {
    console.log("Error creating Staff: ", error);
    
    // Trả về error message chi tiết hơn
    if (error instanceof Error) {
      // Nếu đã là message tiếng Việt từ validation, giữ nguyên
      if (error.message.includes('là bắt buộc') || error.message.includes('không được để trống')) {
        throw error;
      }
      // Nếu là error message tiếng Anh, giữ nguyên để API route xử lý
      throw error;
    }
    
    // Nếu là Mongoose validation error, extract thông tin chi tiết
    if (error && typeof error === 'object' && 'errors' in error) {
      const mongooseError = error as any;
      const errorMessages = Object.values(mongooseError.errors || {}).map((err: any) => err.message);
      throw new Error(`Lỗi xác thực dữ liệu: ${errorMessages.join(', ')}`);
    }
    
    throw new Error("Không thể tạo nhân viên. Vui lòng thử lại sau.");
  }
};

export const getStaffs = async () => {
  try {
    await connectToDatabase();
    const staffs = await Staff.find();
    return staffs;
  } catch (error) {
    console.log("Error fetching Staffs: ", error);
    throw new Error("Failed to fetch staffs");
  }
};

export const getStaffById = async (id: string) => {
  try {
    await connectToDatabase();
    const staff = await Staff.findById(id);
    if (!staff) {
      throw new Error("Staff not found");
    }
    return staff;
  } catch (error) {
    console.log("Error fetching Staff by ID: ", error);
    throw new Error("Failed to fetch staff");
  }
};

export const updateStaff = async (
  id: string,
  data: Partial<{
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    avatar: string;
    gender: boolean;
    birthday: Date;
    enrolledDate: Date;
    salary: string;
    position: string;
    province: string;
    district: string;
    experience: string;
    kindOfJob: string;
    description: string;
  }>
) => {
  try {
    await connectToDatabase();
    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!updatedStaff) {
      throw new Error("Staff not found");
    }
    return updatedStaff;
  } catch (error) {
    console.log("Error updating Staff: ", error);
    throw new Error("Failed to update staff");
  }
};

export const deleteStaff = async (id: string) => {
  try {
    await connectToDatabase();
    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      throw new Error("Staff not found");
    }
    return true;
  } catch (error) {
    console.log("Error deleting Staff: ", error);
    throw new Error("Failed to delete staff");
  }
};
