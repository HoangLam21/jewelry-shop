"use server";
import Product from "@/database/product.model";
import { connectToDatabase } from "../mongoose";
import mongoose from "mongoose";
import formidable from "formidable";
import { createFile, deleteFile } from "./file.action";
import Voucher from "@/database/voucher.model";
import ProductProvider from "@/database/provider.model";
import File from "@/database/file.model";
import Category from "@/database/category.model";

// Tạo sản phẩm mới
export const createProduct = async (data: {
  name: string;
  cost: number;
  images: formidable.File[];
  description: string;
  vouchers?: string[];
  provider?: string;
  category?: string;
  collections?: string;
  variants: {
    material: string;
    sizes: { size: string; stock: number }[];
    addOn: number;
  }[];
}) => {
  try {
    await connectToDatabase();
    const imageIds: string[] = [];
    for (const image of data.images) {
      const createdImage = await createFile(image);
      imageIds.push(createdImage._id);
    }
    const provider = await ProductProvider.findById(data.provider);
    const category = await Category.findById(data.category);
    const voucherIds = [];
    for (const id of data.vouchers!) {
      const voucher = await Voucher.findById(id);
      if (voucher) {
        voucherIds.push(voucher._id);
      }
    }
    const newProduct = await Product.create({
      name: data.name,
      cost: data.cost,
      files: imageIds,
      description: data.description,
      vouchers: voucherIds,
      provider: provider ? provider._id : undefined,
      category: category ? category._id : undefined,
      variants: data.variants,
      collections: data.collections,
    });
    return newProduct;
  } catch (error) {
    console.log("Error creating Product: ", error);
    throw new Error("Failed to create product");
  }
};

export const getProducts = async () => {
  try {
    await connectToDatabase();
    const products = await Product.find();
    const productResponse = [];
    for (const product of products) {
      const files = await File.find({ _id: { $in: product.files } });
      const vouchers = await Voucher.find({
        _id: { $in: product.vouchers },
      });
      const provider = await ProductProvider.findById(product.provider);
      const category =await Category.findById(product.category);
      productResponse.push({
        ...product.toObject(),
        category:category,
        vouchers: vouchers,
        provider: provider,
        files: files,
      });
    }
    return productResponse;
  } catch (error) {
    console.log("Error fetching Products: ", error);
    throw new Error("Failed to fetch products");
  }
};

export const getProductById = async (id: string) => {
  try {
    await connectToDatabase();
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }
    const files = await File.find({ _id: { $in: product.files } });
    const vouchers = await Voucher.find({ _id: { $in: product.vouchers } });
    const provider = await ProductProvider.findById(product.provider);
    const category = await Category.findById(product.category);
    const productObject = product.toObject();
    return {
      ...productObject,
      files: files,
      vouchers: vouchers,
      provider: provider,
      category:category
    };
  } catch (error) {
    console.log("Error fetching Product by ID: ", error);
    throw new Error("Failed to fetch product");
  }
};

export const updateProduct = async (
  id: string,
  data: Partial<{
    name: string;
    cost: number;
    images: formidable.File[];
    description: string;
    vouchers: string[];
    provider?: string;
    category?: string;
    collections?: string;
    variants: {
      material: string;
      sizes: { size: string; stock: number }[];
      addOn: number;
    }[];
  }>
) => {
  try {
    await connectToDatabase();
    const updateImageIds: string[] = [];
    const existProduct = await Product.findById(id);
    for (const id of existProduct.files) {
      await deleteFile(id);
    }
    if (data.images) {
      for (const image of data.images) {
        const createdImage = await createFile(image);
        updateImageIds.push(createdImage._id);
      }
    }
    const provider = await ProductProvider.findById(data.provider);
    const category = await Category.findById(data.category);
    const voucherIds = [];
    const vouchers = [];
    for (const id of data.vouchers!) {
      const voucher = await Voucher.findById(id);
      if (voucher) {
        voucherIds.push(voucher._id);
        vouchers.push(voucher);
      }
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...data,
        vouchers: voucherIds,
        provider: provider ? provider._id : undefined,
        category: category ? category._id : undefined,
        files: updateImageIds,
      },
      { new: true }
    );
    const files = await File.find({ _id: { $in: updatedProduct.files } });

    return {
      ...updatedProduct.toObject(),
      files: files,
      vouchers: vouchers,
      provider: provider,
      catgory: category,
    };
  } catch (error) {
    console.log("Error updating Product: ", error);
    throw new Error("Failed to update product");
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await connectToDatabase();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new Error("Product not found");
    }
    return true;
  } catch (error) {
    console.log("Error deleting Product: ", error);
    throw new Error("Failed to delete product");
  }
};
