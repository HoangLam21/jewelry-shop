import { CreateImport, Import } from "@/dto/ImportDTO";

export async function fetchImport(): Promise<[]> {
  try {
    const response = await fetch(`/api/import/all`);
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

export async function deleteImport(importId: string) {
  try {
    console.log(`/api/import/delete?id=${importId}`, "delete ");
    const response = await fetch(`/api/import/delete?id=${importId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete order:", error);
    throw error;
  }
}

export async function createImport(params: CreateImport): Promise<Order> {
  try {
    console.log(params, "update params");

    // Validate and prepare details array
    const details = params.details.map((detail) => ({
      id: detail.id,
      material: detail.material,
      size: detail.size,
      unitPrice: detail.unitPrice,
      quantity: detail.quantity,
      discount: detail.discount,
    }));
    // Prepare the body in JSON format
    const body = JSON.stringify({
      details,
      provider: params.provider,
      staff: params.staff,
    });

    console.log(body, "Prepared request body");

    const response = await fetch(`/api/import/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating import");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create import:", error);
    throw error;
  }
}

export async function getImportById(importId: string): Promise<Order | null> {
  try {
    console.log(`/api/import/id/${importId}`, "this is order ");
    const response = await fetch(`/api/import/id?id=${importId}`);

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin order.");
    }

    const data: Order = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin order:", error);
    throw error;
  }
}

export async function updatedStatusOrder(
  orderId: string,
  status: string
  // token: string
): Promise<Order> {
  try {
    console.log(orderId, status, "param");
    const response = await fetch(`/api/import/update?id=${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `${token}`,
      },
      body: JSON.stringify({ status }),
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
