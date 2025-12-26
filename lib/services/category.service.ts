import { CategoryResponse, CreateCategory } from "@/dto/CategoryDTO";

export async function fetchCategory(): Promise<CategoryResponse[]> {
  try {
    const response = await fetch(`/api/category/all-category`);
    if (!response.ok) {
      throw new Error("Error fetching category");
    }
    const data: CategoryResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    throw error;
  }
}

export async function getCategoryById(id: string) {
  try {
    const response = await fetch(`/api/category/get?id=${id}`);
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
