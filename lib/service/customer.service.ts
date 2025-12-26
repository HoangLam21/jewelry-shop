export async function fetchCustomer(): Promise<[]> {
  try {
    const response = await fetch(`/api/customer/all`);
    if (!response.ok) {
      throw new Error("Error fetching customer");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    throw error;
  }
}

export async function getDetailCustomer(
  customerId: string
): Promise<CustomerResponse | null> {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   console.error("Không tìm thấy token");
  //   throw new Error("Thiếu token xác thực.");
  // }

  try {
    // const response = await fetch(`/api/customer/${customerId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // });
    const response = await fetch(`/api/customer/id?id=${customerId}`);
    if (!response.ok) {
      throw new Error("Không thể lấy thông tin khach hang.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khach hang:", error);
    throw error;
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    console.log(`/api/customer/delete?id=${customerId}`, "delete ");
    const response = await fetch(`/api/customer/delete?id=${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting customer");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete customer:", error);
    throw error;
  }
}

export async function createCustomer(
  params: CreateCustomer
  // token: string
): Promise<CustomerResponse> {
  try {
    console.log(params, "param");
    const response = await fetch(`/api/customer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Authorization: `${token}`,
      },
      body: JSON.stringify({
        address: params.address,
        email: params.email,
        fullName: params.fullName,
        phoneNumber: params.phoneNumber
      })
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

export async function updateInfoCustomer(
  id: string,
  data: CreateCustomer
): Promise<any> {
  try {
    console.log(id, data, "update params");

    const response = await fetch(`/api/customer/update?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error updating customer");
    }

    const updatedCustomer = await response.json();
    return updatedCustomer;
  } catch (error) {
    console.error("Failed to update customer:", error);
    throw error;
  }
}
