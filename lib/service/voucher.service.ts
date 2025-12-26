import { CreateVoucher, Voucher } from "@/dto/VoucherDTO";

export async function fetchVoucher(): Promise<[]> {
  try {
    const response = await fetch(`/api/voucher/all`);
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

export async function deleteVoucher(voucherId: string) {
  try {
    console.log(`/api/voucher/delete?id=${voucherId}`, "delete ");
    const response = await fetch(`/api/voucher/delete?id=${voucherId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete post:", error);
    throw error;
  }
}

export async function createVoucher(
  params: CreateVoucher
  // token: string
): Promise<Voucher> {
  try {
    console.log(params, "param");
    const response = await fetch(`/api/voucher/create`, {
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

    const data: Voucher = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}
