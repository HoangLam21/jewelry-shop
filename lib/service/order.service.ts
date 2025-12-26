import { CreateOrder, Order, UpdateStatusOrder } from "@/dto/OrderDTO";

export async function fetchOrder(): Promise<[]> {
  try {
    const response = await fetch(`/api/order/all`);
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

export async function deleteOrder(orderId: string) {
  try {
    console.log(`/api/order/delete?id=${orderId}`, "delete ");
    const response = await fetch(`/api/order/delete?id=${orderId}`, {
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

export async function createOrder(params: CreateOrder): Promise<Order> {
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

    // Convert `ETD` to ISO string format
    const ETD = new Date(params.ETD).toISOString();

    // Prepare the body in JSON format
    const body = JSON.stringify({
      cost: params.cost,
      discount: params.discount,
      details,
      status: params.status,
      shippingMethod: params.shippingMethod,
      ETD,
      customer: params.customer,
      staff: params.staff,
    });

    console.log(body, "Prepared request body");

    const response = await fetch(`/api/order/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    console.log(`/api/order/id/${orderId}`, "this is order ");
    const response = await fetch(`/api/order/id?id=${orderId}`);

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
    const response = await fetch(`/api/order/update?id=${orderId}`, {
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
