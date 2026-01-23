const CACHE_DURATION = 60000; // 1 minute
let productsCache: any = null;
let productsCacheTime: number = 0;

export async function fetchProducts() {
  try {
    // Kiểm tra cache
    const now = Date.now();
    if (productsCache && now - productsCacheTime < CACHE_DURATION) {
      return productsCache;
    }

    const response = await fetch(`/api/product/all`, {
      next: { revalidate: 60 }, // Next.js caching
    });

    if (!response.ok) {
      throw new Error("Error fetching products");
    }

    const data = await response.json();

    // Cập nhật cache
    productsCache = data;
    productsCacheTime = now;

    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const response = await fetch(`/api/product/id?id=${id}`, {
      next: { revalidate: 300 }, // Cache 5 minutes
    });

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

export async function getProductBySlug(slug: string) {
  try {
    const response = await fetch(`/api/product/slug?slug=${slug}`, {
      next: { revalidate: 300 }, // Cache 5 minutes
    });

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
