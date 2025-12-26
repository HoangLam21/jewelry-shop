import { FileContent } from "@/dto/ProductDTO";
import { CreateProvider, Provider } from "@/dto/ProviderDTO";

export async function fetchProvider(): Promise<[]> {
  try {
    const response = await fetch(`/api/provider/all`);
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

export async function getProviderById(
  providerId: string
): Promise<Provider | null> {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   console.error("Không tìm thấy token");
  //   throw new Error("Thiếu token xác thực.");
  // }

  try {
    const response = await fetch(
      `/api/provider/id?id=${providerId}`
      //   {
      //   headers: {
      //     Authorization: `${token}`,
      //   },
      // }
    );

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin nhân viên.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân viên:", error);
    throw error;
  }
}

export async function getAllImportsOfProvider(providerId: string): Promise<[]> {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   console.error("Không tìm thấy token");
  //   throw new Error("Thiếu token xác thực.");
  // }

  try {
    const response = await fetch(
      `/api/import/provider?id=${providerId}`
      //   {
      //   headers: {
      //     Authorization: `${token}`,
      //   },
      // }
    );

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin nhân viên.");
    }

    const data = await response.json();

    console.log(data, "import taff");
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân viên:", error);
    throw error;
  }
}

export async function createProvider(
  params: CreateProvider
  // token: string
): Promise<Provider> {
  try {
    console.log(params, "param");
    const response = await fetch(`/api/provider/create`, {
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
  providerId: string,
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

    // Post the form data to upload the avatar for the given Provider ID
    const response = await fetch(
      `/api/provider/upload-avatar?id=${providerId}`,
      {
        method: "POST",
        body: formData,
      }
    );

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

export async function updatedProvider(
  providerId: string,
  params: CreateProvider
  // token: string
): Promise<Provider> {
  try {
    console.log(params, "param");
    const response = await fetch(`/api/provider/update?id=${providerId}`, {
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

export async function deleteProvider(providerId: string) {
  try {
    console.log(`/api/provider/delete?id=${providerId}`, "delete ");
    const response = await fetch(`/api/provider/delete?id=${providerId}`, {
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
