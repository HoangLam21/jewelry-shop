import { Import } from "@/dto/ImportDTO";
import { CreateStaff, FileContent, Staff, uploadAvatar } from "@/dto/StaffDTO";

/**
 * Lấy danh sách tất cả staff
 */
export async function fetchStaff(): Promise<Staff[]> {
  try {
    const response = await fetch(`/api/staff/all`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error("Error fetching staffs");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch staffs:", error);
    throw error;
  }
}

// Alias
export const getStaffs = fetchStaff;

/**
 * Lấy thông tin staff theo ID
 */
export async function getStaffById(staffId: string): Promise<Staff | null> {
  try {
    console.log(`Fetching staff with ID: ${staffId}`);
    const response = await fetch(`/api/staff/id?id=${staffId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Không thể lấy thông tin nhân viên.");
    }

    const result = await response.json();
    
    // Xử lý cả 2 format: { success, data } hoặc trực tiếp object
    const data = result.data || result;
    console.log("Staff data received:", data);
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân viên:", error);
    throw error;
  }
}

// Alias
export const fetchStaffById = getStaffById;

/**
 * Lấy danh sách imports của staff
 */
export async function getAllImportsOfStaff(staffId: string): Promise<Import[]> {
  try {
    const response = await fetch(`/api/import/staff?id=${staffId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể lấy danh sách imports.");
    }

    const result = await response.json();
    const data = result.data || result;
    console.log("Imports of staff:", data);
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy imports của nhân viên:", error);
    throw error;
  }
}

// Alias
export const getImportsOfStaff = getAllImportsOfStaff;

/**
 * Tạo staff mới
 */
export async function createStaff(params: CreateStaff): Promise<Staff> {
  try {
    console.log("Creating staff with params:", params);
    const response = await fetch(`/api/staff/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || responseData.error || "Không thể tạo nhân viên.";
      throw new Error(errorMessage);
    }

    return responseData.data || responseData;
  } catch (error) {
    console.error("Failed to create staff:", error);
    throw error;
  }
}

/**
 * Cập nhật thông tin staff
 */
export async function updatedStaff(staffId: string, params: CreateStaff): Promise<Staff> {
  try {
    console.log("Updating staff:", staffId, params);
    const response = await fetch(`/api/staff/update?id=${staffId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(params),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || responseData.error || "Không thể cập nhật nhân viên.";
      throw new Error(errorMessage);
    }

    return responseData.data || responseData;
  } catch (error) {
    console.error("Failed to update staff:", error);
    throw error;
  }
}

/**
 * Xóa staff
 */
export async function deleteStaff(staffId: string): Promise<boolean> {
  try {
    console.log("Deleting staff:", staffId);
    const response = await fetch(`/api/staff/delete?id=${staffId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể xóa nhân viên.");
    }

    return true;
  } catch (error) {
    console.error("Failed to delete staff:", error);
    throw error;
  }
}

/**
 * Upload avatar cho staff
 */
export async function createAvatar(staffId: string, avatarFile: FileContent): Promise<any> {
  try {
    console.log("Uploading avatar for staff:", staffId);

    const formData = new FormData();

    if (avatarFile && avatarFile.url) {
      // Convert URL to File
      const file = await fetch(avatarFile.url)
        .then((res) => res.blob())
        .then((blob) => new File([blob], avatarFile.fileName || "avatar.jpg", { type: avatarFile.format || "image/jpeg" }));

      formData.append("image", file);
    } else {
      throw new Error("No valid avatar file provided.");
    }

    const response = await fetch(`/api/staff/upload-avatar?id=${staffId}`, {
      method: "POST",
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể upload avatar.");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to upload avatar:", error);
    throw error;
  }
}