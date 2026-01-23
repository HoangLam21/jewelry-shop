import { Voucher } from "@/dto/VoucherDTO";

// Cache configuration
const CACHE_DURATION = 60000; // 1 minute
let vouchersCache: any = null;
let vouchersCacheTime: number = 0;

export async function fetchVoucher(): Promise<Voucher[]> {
  try {
    // Kiểm tra cache
    const now = Date.now();
    if (vouchersCache && now - vouchersCacheTime < CACHE_DURATION) {
      return vouchersCache;
    }

    const response = await fetch(`/api/voucher/all`, {
      next: { revalidate: 60 }, // Next.js caching
    });

    if (!response.ok) {
      throw new Error("Error fetching vouchers");
    }

    const data = await response.json();

    // Cập nhật cache
    vouchersCache = data;
    vouchersCacheTime = now;

    return data;
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    throw error;
  }
}

export async function getVoucherById(id: string) {
  try {
    const response = await fetch(`/api/voucher/id?id=${id}`, {
      next: { revalidate: 300 }, // Cache 5 minutes
    });

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
