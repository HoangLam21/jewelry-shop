// category.action
import Category from "@/database/category.model";
import Product from "@/database/product.model";
import mongoose, { ObjectId } from "mongoose";
import { connectToDatabase } from "../mongoose";
import File from "@/database/file.model";
import ProductProvider from "@/database/provider.model";

// Create a new category
export const createCategory = async (data: {
  name: string;
  description: string;
}) => {
  try {
    await connectToDatabase();
    const newCategory = await Category.create({
      name: data.name,
      description: data.description
    });
    return newCategory;
  } catch (error) {
    console.log("Error creating category: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to create category");
  } finally {
    //await mongoose.connection.close();
  }
};

// Modified getProductsOfCategory function
export const getProductsOfCategory = async (categoryId: string) => {
  try {
    await connectToDatabase();
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    // Populate necessary fields
    const products = await Product.find({
      _id: { $in: category.products }
    })
      .populate("files")
      .populate("vouchers")
      .populate("provider")
      .populate("category");

    await mongoose.connection.close();
    return products;
  } catch (error) {
    console.log("Error getting products of category: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to get products of category");
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    await connectToDatabase();
    const categories = await Category.find();
    if (categories.length === 0) {
      return [];
    }
    return categories;
  } catch (error) {
    console.log("Error fetching categories: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to fetch categories");
  } finally {
    // await mongoose.connection.close();
  }
};

// Update a category
export const updateCategory = async (
  id: string,
  data: Partial<{
    name: string;
    hot: boolean;
  }>
) => {
  try {
    await connectToDatabase();
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        ...data
      },
      { new: true }
    );
    if (!updatedCategory) {
      throw new Error("Category not found");
    }
    return updatedCategory;
  } catch (error) {
    console.log("Error updating category: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to update category");
  } finally {
    // await mongoose.connection.close();
  }
};

// Delete a category
export const deleteCategory = async (id: string) => {
  try {
    await connectToDatabase();
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw new Error("Category not found");
    }
    return true;
  } catch (error) {
    console.log("Error deleting category: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to delete category");
  } finally {
    //await mongoose.connection.close();
  }
};

// Add a product to a category
export const addProductToCategory = async (
  categoryId: string,
  productId: string[]
) => {
  try {
    await connectToDatabase();
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    const products = await Product.find({
      _id: { $in: productId } // Dùng $in để tìm tất cả ID trong mảng
    });

    if (products.length !== productId.length) {
      throw new Error("One or more products not found");
    }
    await Promise.all(
      products.map((product) => {
        product.category = categoryId;
        return product.save();
      })
    );

    category.products = productId;
    await category.save();

    //await mongoose.connection.close();
    return { category, products };
  } catch (error) {
    console.log("Error adding product to category: ", error);
    //await mongoose.connection.close();
    throw new Error("Failed to add product to category");
  }
};

// Remove a product from a category
export const removeProductFromCategory = async (
  categoryId: string,
  productId: string
) => {
  try {
    await connectToDatabase();
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    category.products = category.products.filter(
      (id: any) => id.toString() !== productId
    );
    product.category = null;
    await category.save();
    await product.save();
    await mongoose.connection.close();
    return { category, product };
  } catch (error) {
    console.log("Error removing product from category: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to remove product from category");
  }
};

// Edit a product's category
export const editProductCategory = async (
  productId: string,
  newCategoryId: string
) => {
  try {
    await connectToDatabase();
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const oldCategory = await Category.findById(product.category);
    if (oldCategory) {
      oldCategory.products = oldCategory.products.filter(
        (id: any) => id.toString() !== productId
      );
      await oldCategory.save();
    }
    const newCategory = await Category.findById(newCategoryId);
    if (!newCategory) {
      throw new Error("New category not found");
    }
    newCategory.products.push(productId);
    product.category = newCategoryId;
    await newCategory.save();
    await product.save();
    await mongoose.connection.close();
    return { product, newCategory };
  } catch (error) {
    console.log("Error editing product category: ", error);
    await mongoose.connection.close();
    throw new Error("Failed to edit product category");
  }
};

interface MongoDocument {
  _id: mongoose.Types.ObjectId;
  __v: number;
  [key: string]: any;
}

interface ProductPopulated extends MongoDocument {
  name: string;
  cost: number;
  files: {
    _id: mongoose.Types.ObjectId;
    url: string;
  }[];
  description: string;
  vouchers: mongoose.Types.ObjectId[];
  provider: {
    _id: mongoose.Types.ObjectId;
    fullname: string;
    phoneNumber: string;
    address: string;
  };
  category: mongoose.Types.ObjectId;
  collections: string;
  variants: {
    material: string;
    sizes: {
      size: string;
      stock: number;
    }[];
    addOn: number;
  }[];
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryPopulated extends MongoDocument {
  name: string;
  hot: boolean;
  products: ProductPopulated[];
  createdAt: Date;
  updatedAt: Date;
}

interface RawProduct extends MongoDocument {
  name: string;
  cost: number;
  files?: mongoose.Types.ObjectId[];
  description: string;
  vouchers?: mongoose.Types.ObjectId[];
  provider?: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  collections: string;
  variants: {
    material: string;
    sizes: {
      size: string;
      stock: number;
    }[];
    addOn: number;
  }[];
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RawCategory extends MongoDocument {
  name: string;
  hot: boolean;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

interface FileDocument {
  _id: mongoose.Types.ObjectId;
  url: string;
}

interface ProviderDocument {
  _id: mongoose.Types.ObjectId;
  fullname: string;
  phoneNumber: string;
  address: string;
}

export const getCategoryById = async (
  id: string
): Promise<CategoryPopulated> => {
  try {
    await connectToDatabase();

    const category = (await Category.findById(
      id
    ).lean()) as unknown as RawCategory;
    if (!category) {
      throw new Error("Category not found");
    }

    const rawProducts = (await Product.find({
      _id: { $in: category.products }
    }).lean()) as unknown as RawProduct[];

    const fileIds: mongoose.Types.ObjectId[] = [];
    const providerIds: mongoose.Types.ObjectId[] = [];

    rawProducts.forEach((product) => {
      if (Array.isArray(product.files)) {
        fileIds.push(...product.files);
      }
      if (product.provider) {
        providerIds.push(product.provider);
      }
    });

    const [filesData, providersData] = await Promise.all([
      File.find({ _id: { $in: fileIds } })
        .select("_id url")
        .lean()
        .then((files) => files as unknown as FileDocument[]),
      ProductProvider.find({ _id: { $in: providerIds } })
        .select("_id fullname phoneNumber address")
        .lean()
        .then((providers) => providers as unknown as ProviderDocument[])
    ]);

    const fileMap = new Map(
      filesData.map((file) => [file._id.toString(), file])
    );

    const providerMap = new Map(
      providersData.map((provider) => [provider._id.toString(), provider])
    );

    const populatedProducts: ProductPopulated[] = rawProducts.map((product) => {
      const productFiles = (product.files || [])
        .map((fileId) => fileMap.get(fileId.toString()))
        .filter((file): file is FileDocument => !!file);

      const provider = product.provider
        ? providerMap.get(product.provider.toString())
        : null;

      return {
        _id: product._id,
        __v: product.__v,
        name: product.name,
        cost: product.cost,
        files: productFiles,
        description: product.description,
        vouchers: product.vouchers || [],
        provider: provider || {
          _id: new mongoose.Types.ObjectId(),
          fullname: "",
          phoneNumber: "",
          address: ""
        },
        category: product.category,
        collections: product.collections,
        variants: product.variants,
        sales: product.sales,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });

    const populatedCategory: CategoryPopulated = {
      _id: category._id,
      __v: category.__v,
      name: category.name,
      hot: category.hot,
      products: populatedProducts,
      createdAt: category.createAt,
      updatedAt: category.updatedAt
    };

    return populatedCategory;
  } catch (error) {
    console.error("Error fetching category: ", error);
    throw new Error("Failed to fetch category");
  } finally {
    //await mongoose.connection.close();
  }
};
