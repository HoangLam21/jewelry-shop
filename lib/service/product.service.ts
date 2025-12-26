import { CreateProduct, FileContent, ProductResponse } from "@/dto/ProductDTO";

export async function fetchProduct() {
  try {
    const response = await fetch(`/api/product/all`);
    if (!response.ok) {
      throw new Error("Error fetching data");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}

export async function getDetailProduct(
  productId: string
): Promise<ProductResponse | null> {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   console.error("Không tìm thấy token");
  //   throw new Error("Thiếu token xác thực.");
  // }

  try {
    // const response = await fetch(`/api/customer/${customerId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // });
    const response = await fetch(`/api/product/id?id=${productId}`);
    if (!response.ok) {
      throw new Error("Không thể lấy thông tin khach hang.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin san pham:", error);
    throw error;
  }
}

export async function deleteProductById(productId: string) {
  try {
    console.log(`/api/product/delete?id=${productId}`, "delete ");
    const response = await fetch(`/api/product/delete?id=${productId}`, {
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

export async function createProduct(
  params: CreateProduct
  // token: string
): Promise<ProductResponse> {
  try {
    console.log(params, "update params");

    const formData = new FormData();
    formData.append("name", params.name);
    formData.append("cost", params.cost.toString());
    formData.append("description", params.description);
    if (params.provider) {
      formData.append("provider", params.provider);
    }
    if (params.category) {
      formData.append("category", params.category);
    }
    formData.append("collections", params.collections || "");

    // Thêm các tệp vào FormData
    if (params.images && params.images.length > 0) {
      // Sử dụng Promise.all để xử lý các tệp hình ảnh bất đồng bộ
      const imagePromises = params.images.map(async (image: FileContent) => {
        if (image.url && image.fileName) {
          try {
            const response = await fetch(image.url);
            if (response.ok) {
              const blob = await response.blob();
              formData.append("images", blob, image.fileName);
            } else {
              console.error("Failed to fetch image from URL", image.url);
            }
          } catch (error) {
            console.error("Error fetching image", error);
          }
        } else {
          console.error("FileContent is missing necessary fields");
        }
      });

      // Đợi tất cả các Promise hoàn thành
      await Promise.all(imagePromises);
    }

    if (params.vouchers) {
      if (Array.isArray(params.vouchers)) {
        params.vouchers.forEach((voucher: any) => {
          formData.append("vouchers", voucher);
        });
      } else {
        formData.append("vouchers", params.vouchers);
      }
    }

    if (params.variants && Array.isArray(params.variants)) {
      formData.append("variants", JSON.stringify(params.variants));
    }
    console.log(formData, "check");
    const response = await fetch(`/api/product/create`, {
      method: "POST",
      body: formData
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

export async function updateInfoProduct(
  id: string,
  params: CreateProduct
): Promise<any> {
  try {
    console.log(id, params, "update params");

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", params.name);
    formData.append("cost", params.cost.toString());
    formData.append("description", params.description);
    if (params.provider) {
      formData.append("provider", params.provider);
    }
    if (params.category) {
      formData.append("category", params.category);
    }
    formData.append("collections", params.collections || "");

    // Thêm các tệp vào FormData
    if (params.images && params.images.length > 0) {
      // Sử dụng Promise.all để xử lý các tệp hình ảnh bất đồng bộ
      const imagePromises = params.images.map(async (image: FileContent) => {
        if (image.url && image.fileName) {
          try {
            const response = await fetch(image.url);
            if (response.ok) {
              const blob = await response.blob();
              formData.append("images", blob, image.fileName);
            } else {
              console.error("Failed to fetch image from URL", image.url);
            }
          } catch (error) {
            console.error("Error fetching image", error);
          }
        } else {
          console.error("FileContent is missing necessary fields");
        }
      });

      // Đợi tất cả các Promise hoàn thành
      await Promise.all(imagePromises);
    }

    if (params.vouchers) {
      if (Array.isArray(params.vouchers)) {
        params.vouchers.forEach((voucher) => {
          formData.append("vouchers", voucher);
        });
      } else {
        formData.append("vouchers", params.vouchers);
      }
    }

    if (params.variants && Array.isArray(params.variants)) {
      formData.append("variants", JSON.stringify(params.variants));
    }
    console.log(formData, "check");
    const response = await fetch(`/api/product/update?id=${id}`, {
      method: "PUT",
      body: formData // Gửi FormData thay vì JSON
    });

    // Đảm bảo phản hồi được đọc đúng cách chỉ một lần
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.error || "Error updating product");
    }

    return responseData;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
}
