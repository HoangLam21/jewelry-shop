export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  selectedMaterial: string,
  selectedSize: string
) {
  try {
    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
        quantity,
        selectedMaterial,
        selectedSize,
      }),
    });

    // Check for response status
    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to add product to cart", err);
  }
}

export async function getCartByUserId(userId: string) {
  try {
    const response = await fetch(`/api/cart/get?userId=${userId}`);

    // Check for response status
    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to add product to cart", err);
  }
}

export async function increaseProductQuantity(
  userId: string,
  productId: string,
  selectedMaterial: string,
  selectedSize: string
) {
  try {
    const response = await fetch("/api/cart/increase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
        selectedMaterial,
        selectedSize,
      }),
    });

    // Check for response status
    if (!response.ok) {
      throw new Error("Failed to increase quantity product to cart");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to increase quantity product to cart", err);
  }
}

export async function decreaseProductQuantity(
  userId: string,
  productId: string,
  selectedMaterial: string,
  selectedSize: string
) {
  try {
    const response = await fetch("/api/cart/decrease", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
        selectedMaterial,
        selectedSize,
      }),
    });

    // Check for response status
    if (!response.ok) {
      throw new Error("Failed to increase quantity product to cart");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to increase quantity product to cart", err);
  }
}

export async function removeProductFromCart(
  userId: string,
  productId: string,
  selectedMaterial: string,
  selectedSize: string
) {
  try {
    const response = await fetch("/api/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
        selectedMaterial,
        selectedSize,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove product from cart");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to remove product from cart", err);
  }
}
