"use server";

import Cart from "@/database/cart.model";
import { connectToDatabase } from "../mongoose";
import mongoose from "mongoose";
import Product from "@/database/product.model";

export const addProductToCart = async (
  userId: string,
  productId: string,
  quantity: number,
  selectedMaterial: string,
  selectedSize: string
) => {
  try {
    await connectToDatabase();

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        totalCost: 0,
        details: new Map(),
      });
    }

    const productKey = `${productId}_${selectedMaterial}_${selectedSize}`;

    const existingProduct = cart.details.get(productKey);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      const newProduct = {
        quantity,
        selectedMaterial: selectedMaterial,
        selectedSize: selectedSize,
      };
      cart.details.set(productKey, newProduct);
    }
    const productPrice = 10000;
    cart.totalCost += quantity * productPrice;

    await cart.save();

    console.log("Cart updated:", cart);
    return cart;
  } catch (error) {
    console.error("Error adding product to cart: ", error);
    throw new Error("Failed to add product to cart");
  }
};

// export const removeProductFromCart = async (
//   userId: string,
//   productId: string
// ) => {
//   try {
//     await connectToDatabase();
//     const cart = await Cart.findOneAndUpdate(
//       { user: userId },
//       {
//         $unset: { [`details.${productId}`]: "" },
//       },
//       { new: true }
//     );
//     if (!cart || !cart.details) {
//       throw new Error("Cart or product not found");
//     }
//     const productQuantity = cart.details.get(productId);
//     if (!productQuantity) {
//       throw new Error("Product not found in cart");
//     }
//     // Update total cost
//     const updatedCart = await Cart.findOneAndUpdate(
//       { user: userId },
//       { $inc: { totalCost: -productQuantity } },
//       { new: true }
//     );
//     if (!updatedCart) {
//       throw new Error("Failed to update cart");
//     }
//     await mongoose.connection.close();
//     return updatedCart;
//   } catch (error) {
//     console.log("Error removing product from cart: ", error);
//     await mongoose.connection.close();
//     throw new Error("Failed to remove product from cart");
//   }
// };

export const editProductQuantityInCart = async (
  userId: string,
  productId: string,
  newQuantity: number
) => {
  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.details) {
      throw new Error("Cart not found");
    }
    const currentQuantity = cart.details.get(productId);
    if (!currentQuantity) {
      throw new Error("Product not found in cart");
    }
    // Update quantity
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          [`details.${productId}`]: newQuantity,
        },
        $inc: {
          totalCost: newQuantity - currentQuantity,
        },
      },
      { new: true }
    );
    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }
    await mongoose.connection.close();
    return updatedCart;
  } catch (error) {
    console.log("Error editing product quantity in cart: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to edit product quantity in cart");
  }
};

export const getCartInformation = async (userId: string) => {
  try {
    const cart = await Cart.findOne({ user: userId })
      .populate("user", "fullname email")
      .exec();

    if (!cart) {
      throw new Error("Cart not found");
    }
    const cartDetails = await Promise.all(
      Array.from(cart.details.entries()).map(
        async ([productKey, detail]: any) => {
          const [productId] = productKey.split("_");

          const product = await Product.findById(productId)
            .populate("files")
            .populate("vouchers")
            .populate("provider")
            .populate("category")
            .exec();

          if (!product) {
            throw new Error("Product not found");
          }

          return {
            productId,
            ...detail.toObject(),
            productName: product.name,
            productCost: product.cost,
            productDescription: product.description,
            productVouchers: product.vouchers,
            productProvider: product.provider,
            productCategory: product.category,
            productFiles: product.files,
            productVariants: product.variants,
            productSales: product.sales,
          };
        }
      )
    );

    return {
      _id: cart._id,
      user: cart.user,
      createdAt: cart.createdAt,
      totalCost: cart.totalCost,
      details: cartDetails,
    };
  } catch (error) {
    console.error("Error getting cart details:", error);
    throw error;
  }
};

export const addProductVariantToCart = async (
  userId: string,
  productId: string,
  quantity: number,
  material: string,
  size: string
) => {
  try {
    await connectToDatabase();
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const variant = product.variants.find(
      (variant: any) =>
        variant.material === material &&
        variant.sizes.some((sizeObj: any) => sizeObj.size === size)
    );
    if (!variant) {
      throw new Error("Product variant not found");
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }
    const newDetails = new Map(cart.details);
    if (newDetails.has(productId)) {
      const currentQuantity = newDetails.get(productId);
      newDetails.set(productId, (currentQuantity as any) + quantity);
    } else {
      newDetails.set(productId, quantity);
    }
    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        details: newDetails,
        totalCost: cart.totalCost + quantity,
      },
      { new: true }
    );
    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }
    await mongoose.connection.close();
    return updatedCart;
  } catch (error) {
    console.log("Error adding product variant to cart: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to add product variant to cart");
  }
};

export const removeProductVariantFromCart = async (
  userId: string,
  productId: string,
  material: string,
  size: string
) => {
  try {
    await connectToDatabase();
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const variant = product.variants.find(
      (variant: any) =>
        variant.material === material &&
        variant.sizes.some((sizeObj: any) => sizeObj.size === size)
    );
    if (!variant) {
      throw new Error("Product variant not found");
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }
    const newDetails = new Map(cart.details);
    const currentQuantity = newDetails.get(productId);
    if (currentQuantity === 1) {
      newDetails.delete(productId);
    } else {
      newDetails.set(productId, (currentQuantity as any) - 1);
    }
    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        details: newDetails,
        totalCost: cart.totalCost - 1,
      },
      { new: true }
    );
    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }
    await mongoose.connection.close();
    return updatedCart;
  } catch (error) {
    console.log("Error removing product variant from cart: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to remove product variant from cart");
  }
};

export const editProductVariantQuantityInCart = async (
  userId: string,
  productId: string,
  material: string,
  size: string,
  newQuantity: number
) => {
  try {
    await connectToDatabase();
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const variant = product.variants.find(
      (variant: any) =>
        variant.material === material &&
        variant.sizes.some((sizeObj: any) => sizeObj.size === size)
    );
    if (!variant) {
      throw new Error("Product variant not found");
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }
    const newDetails = new Map(cart.details);
    if (newQuantity === 0) {
      newDetails.delete(productId);
    } else {
      newDetails.set(productId, newQuantity);
    }
    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        details: newDetails,
        totalCost: newQuantity,
      },
      { new: true }
    );
    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }
    await mongoose.connection.close();
    return updatedCart;
  } catch (error) {
    console.log("Error editing product variant quantity in cart: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to edit product variant quantity in cart");
  }
};

export const getCartInformationWithVariants = async (userId: string) => {
  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }
    const products = [];
    for (const [productId, quantity] of cart.details) {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      const variants = product.variants.map((variant: any) => {
        return {
          material: variant.material,
          sizes: variant.sizes,
        };
      });
      products.push({
        product: product,
        variants: variants,
        quantity: quantity,
      });
    }
    const cartInformation = {
      userId: cart.user,
      totalCost: cart.totalCost,
      products: products,
    };
    await mongoose.connection.close();
    return cartInformation;
  } catch (error) {
    console.log("Error getting cart information with variants: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to get cart information with variants");
  }
};

export const increaseProductQuantity = async (
  userId: string,
  productId: string,
  selectedMaterial: string,
  selectedSize: string
) => {
  try {
    await connectToDatabase();

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productKey = `${productId}_${selectedMaterial}_${selectedSize}`;
    console.log(productKey);
    const existingProduct = cart.details.get(productKey);

    if (existingProduct) {
      existingProduct.quantity += 1;
      const productPrice = 10000; // Example price, you may want to dynamically set this
      cart.totalCost += productPrice;
    } else {
      throw new Error("Product not found in cart");
    }

    await cart.save();
    console.log("Cart updated:", cart);
    return cart;
  } catch (error) {
    console.error("Error increasing product quantity: ", error);
    throw new Error("Failed to increase product quantity");
  }
};

export const decreaseProductQuantity = async (
  userId: string,
  productId: string,
  selectedMaterial: string,
  selectedSize: string
) => {
  try {
    await connectToDatabase();

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productKey = `${productId}_${selectedMaterial}_${selectedSize}`;
    const existingProduct = cart.details.get(productKey);

    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
        const productPrice = 10000; // Example price, you may want to dynamically set this
        cart.totalCost -= productPrice;
      } else {
        // Optionally, remove the product from the cart if quantity is 1
        cart.details.delete(productKey);
      }
    } else {
      throw new Error("Product not found in cart");
    }

    await cart.save();
    console.log("Cart updated:", cart);
    return cart;
  } catch (error) {
    console.error("Error decreasing product quantity: ", error);
    throw new Error("Failed to decrease product quantity");
  }
};

export const removeProductFromCart = async (
  userId: string,
  productId: string,
  selectedMaterial: string,
  selectedSize: string
) => {
  try {
    await connectToDatabase();

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productKey = `${productId}_${selectedMaterial}_${selectedSize}`;

    if (cart.details.has(productKey)) {
      const product = cart.details.get(productKey);
      const productPrice = product.quantity * 10000;
      cart.totalCost -= productPrice;

      cart.details.delete(productKey);
    } else {
      throw new Error("Product not found in cart");
    }

    await cart.save();
    console.log("Product removed from cart:", cart);
    return cart;
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw new Error("Failed to remove product from cart");
  }
};
