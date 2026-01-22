export async function fetchProducts() {
  try {
    const response = await fetch(`/api/product/all`);
    if (!response.ok) {
      throw new Error("Error fetching products");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const response = await fetch(`/api/product/id?id=${id}`);
    if (!response.ok) {
      throw new Error("Error fetching products");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}


export async function getProductBySlug(slug: string) {
  try {
    const response = await fetch(`/api/product/slug?slug=${slug}`);
    if (!response.ok) {
      throw new Error("Error fetching product");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    throw error;
  }
}