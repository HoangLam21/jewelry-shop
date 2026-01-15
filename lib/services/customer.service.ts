export async function getCustomerById(id: string): Promise<any> {
  try {
    const response = await fetch(`/api/customer/id?id=${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error get customer");
    }

    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error("Failed to get customer:", error);
    throw error;
  }
}

export async function getCurrentCustomer(): Promise<any> {
  try {
    const response = await fetch(`/api/customer/me`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error get current customer");
    }

    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error("Failed to get current customer:", error);
    throw error;
  }
}

export async function uploadAvatar(formData: any, id: string | null) {
  try {
    const response = await fetch(`/api/customer/upload-avatar?id=${id}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error upload avatar");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to upload avatar", err);
  }
}
