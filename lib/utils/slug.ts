/* eslint-disable @typescript-eslint/no-explicit-any */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD") // Chuẩn hóa Unicode
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .replace(/đ/g, "d") // Chuyển đ thành d
    .replace(/Đ/g, "D") // Chuyển Đ thành D
    .replace(/[^a-z0-9\s-]/g, "") // Xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Xóa dấu gạch ngang liên tiếp
}

// Hàm tạo slug unique (thêm số nếu slug đã tồn tại)
export async function generateUniqueSlug(
  name: string,
  ProductModel: any,
  excludeId?: string
): Promise<string> {
  const slug = generateSlug(name);
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const query: any = { slug: uniqueSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existing = await ProductModel.findOne(query);
    if (!existing) break;
    
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}