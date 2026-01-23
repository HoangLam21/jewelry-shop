import { CreateOrder, Order } from "@/dto/OrderDTO";

// Cache configuration
const CACHE_DURATION = 30000; // 30 seconds
let ordersCache: any = null;
let ordersCacheTime: number = 0;

export async function fetchOrder(): Promise<any[]> {
  try {
    // Check cache
    const now = Date.now();
    if (ordersCache && now - ordersCacheTime < CACHE_DURATION) {
      return ordersCache;
    }

    const response = await fetch(`/api/order/all`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error("Error fetching orders");
    }

    const data = await response.json();

    // Update cache
    ordersCache = data;
    ordersCacheTime = now;

    return data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
}

export async function deleteOrder(orderId: string) {
  try {
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

    // Invalidate cache
    ordersCache = null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete order:", error);
    throw error;
  }
}

export async function createOrder(params: CreateOrder): Promise<Order> {
  try {
    const details = params.details.map((detail) => ({
      id: detail.id,
      material: detail.material,
      size: detail.size,
      unitPrice: detail.unitPrice,
      quantity: detail.quantity,
      discount: detail.discount,
    }));

    const ETD = new Date(params.ETD).toISOString();

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

    const response = await fetch(`/api/order/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating order");
    }

    // Invalidate cache
    ordersCache = null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const response = await fetch(`/api/order/id?id=${orderId}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Unable to fetch order details.");
    }

    const data: Order = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

export async function updatedStatusOrder(
  orderId: string,
  status: string
): Promise<Order> {
  try {
    const response = await fetch(`/api/order/update?id=${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error updating order status");
    }

    // Invalidate cache
    ordersCache = null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
}
