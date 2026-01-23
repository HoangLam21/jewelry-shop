import { CategoryResponse } from "@/dto/CategoryDTO";

// Cache configuration
const CACHE_DURATION = 60000; // 1 minute
let categoriesCache: CategoryResponse[] | null = null;
let categoriesCacheTime: number = 0;

export async function fetchCategory(): Promise<CategoryResponse[]> {
  try {
    // Kiểm tra cache
    const now = Date.now();
    if (categoriesCache && now - categoriesCacheTime < CACHE_DURATION) {
      return categoriesCache;
    }

    const response = await fetch(`/api/category/all-category`, {
      next: { revalidate: 60 }, // Next.js caching
    });

    if (!response.ok) {
      throw new Error("Error fetching category");
    }

    const data: CategoryResponse[] = await response.json();

    // Cập nhật cache
    categoriesCache = data;
    categoriesCacheTime = now;

    return data;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    throw error;
  }
}

export async function getCategoryById(id: string) {
  try {
    const response = await fetch(`/api/category/get?id=${id}`, {
      next: { revalidate: 300 }, // Cache 5 minutes
    });

    if (!response.ok) {
      throw new Error("Error fetching category");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    throw error;
  }
}
