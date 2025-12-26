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

export async function getVoucherById(id: string) {
  try {
    const response = await fetch(`/api/voucher/id?id=${id}`);
    if (!response.ok) {
      throw new Error("Error fetching voucher");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch voucher:", error);
    throw error;
  }
}
