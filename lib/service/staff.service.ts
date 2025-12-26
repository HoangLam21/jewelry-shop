import { Import } from "@/dto/ImportDTO";
import { CreateStaff, FileContent, Staff, uploadAvatar } from "@/dto/StaffDTO";

export async function fetchStaff(): Promise<[]> {
  try {
    const response = await fetch(`/api/staff/all`);
    if (!response.ok) {
      throw new Error("Error fetching posts");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function getStaffById(staffId: string): Promise<Staff | null> {
  try {
    console.log(`/api/staff/id/${staffId}`, "this is staff ");
    const response = await fetch(`/api/staff/id?id=${staffId}`);

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin nhân viên.");
    }

    const data: Staff = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân viên:", error);
    throw error;
  }
}

export async function getAllImportsOfStaff(staffId: string): Promise<[]> {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   console.error("Không tìm thấy token");
  //   throw new Error("Thiếu token xác thực.");
  // }

  try {
    const response = await fetch(
      `/api/import/staff?id=${staffId}`
      //   {
      //   headers: {
      //     Authorization: `${token}`,
      //   },
      // }
    );

    // if (!response.ok) {
    //   throw new Error("Không thể lấy thông tin nhân viên.");
    // }

    const data = await response.json();

    console.log(data, "import taff");
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân viên:", error);
    throw error;
  }
}

export async function createStaff(
  params: CreateStaff
  // token: string
): Promise<Staff> {
  try {
    console.log(params, "param");
    const response = await fetch(`/api/staff/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating media");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}

export async function createAvatar(
  staffId: string,
  avatarFile: FileContent // Expecting a File object here
): Promise<any> {
  try {
    console.log(avatarFile, "update avatar");

    const formData = new FormData();

    // Ensure that avatarFile contains a valid image file
    if (avatarFile && avatarFile.url) {
      const file = await fetch(avatarFile.url)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new File([blob], avatarFile.fileName, { type: avatarFile.format })
        );

      formData.append("image", file); // Appending the actual file for upload
    } else {
      throw new Error("No valid avatar file provided.");
    }

    console.log(formData, "this is forrm dâtta");

    // Post the form data to upload the avatar for the given staff ID
    const response = await fetch(`/api/staff/upload-avatar?id=${staffId}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error uploading avatar");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to upload avatar:", error);
    throw error;
  }
}

export async function updatedStaff(
  staffId: string,
  params: CreateStaff
  // token: string
): Promise<Staff> {
  try {
    console.log(params, "param");
    const response = await fetch(`/api/staff/update?id=${staffId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating media");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}

export async function deleteStaff(staffId: string) {
  try {
    console.log(`/api/staff/delete?id=${staffId}`, "delete ");
    const response = await fetch(`/api/staff/delete?id=${staffId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting staff");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete staff:", error);
    throw error;
  }
}
