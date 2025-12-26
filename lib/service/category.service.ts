import {
  CategoryResponse,
  CreateCategory,
  ProductAdditionToCategory
} from "@/dto/CategoryDTO";
import { CreateProduct, ProductResponse } from "@/dto/ProductDTO";

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

export async function getDetailCategory(id: string) {
  try {
    const response = await fetch(`/api/category/get?id=${id}`);
    if (!response.ok) {
      throw new Error("Không thể lấy thông tin loai hang.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin loai hang:", error);
    throw error;
  }
}

export async function deleteCategoryById(id: string) {
  try {
    console.log(`/api/category/remove?categoryId=${id}`, "delete ");
    const response = await fetch(`/api/category/delete?categoryId=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
}

export async function createCategory(
  params: CreateCategory
): Promise<CategoryResponse> {
  try {
    console.log(params, "param");
    const response = await fetch(`/api/category/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Authorization: `${token}`,
      },
      body: JSON.stringify({
        name: params.name,
        hot: params.hot
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

export async function updateInfoCategory(
  id: string,
  params: CreateCategory
): Promise<any> {
  try {
    console.log(id, params, "update params");

    const response = await fetch(`/api/category/update?categoryId=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: params.name,
        hot: params.hot
      })
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

export async function fetchProductsOfCategory(categoryId: string) {
  try {
    const response = await fetch(`/api/category/get-product?id=${categoryId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products of category:", error);
    throw error;
  }
}

export async function editProductCategory(
  productId: string,
  newCategoryId: string
) {
  try {
    const response = await fetch(`/api/category/edit-product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId, newCategoryId })
    });

    if (!response.ok) {
      throw new Error(
        `Failed to edit product category: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing product category:", error);
    throw error;
  }
}

export async function removeProductFromCategory(
  categoryId: string,
  productId: string
) {
  try {
    const response = await fetch(`/api/category/remove-product`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ categoryId, productId })
    });

    if (!response.ok) {
      throw new Error(
        `Failed to remove product from category: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing product from category:", error);
    throw error;
  }
}

export const addProductToCategory = async (
  param: ProductAdditionToCategory
) => {
  try {
    const response = await fetch("/api/category/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(param)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add product to category");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error adding product to category:", error);
    throw new Error(error.message || "Failed to add product to category");
  }
};
