"use server";

import Import from "@/database/import.model";
import { connectToDatabase } from "../mongoose";
import Product from "@/database/product.model";
import { ObjectId } from "mongodb";
import ProductProvider from "@/database/provider.model";
import Staff from "@/database/staff.model";
import File from "@/database/file.model";
import mongoose from "mongoose";
import staff from "@/pages/api/import/staff";
import provider from "@/pages/api/import/provider";
import Voucher from "@/database/voucher.model";
import Customer from "@/database/customer.model";
import { createFinance } from "./finance.action";

interface CreateImportInput {
  staff: string;
  provider: string;
  invoice: {
    productId: string;
    material: string;
    size: string;
    unitPrice: number;
    quantity: number;
    discount: string;
  }[];
}

interface ImportResponse {
  id: string;
  supplier: {
    id: string;
    phoneNumber: string;
    fullname: string;
    address: string;
  };
  invoice: {
    id: string;
    productName: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    discount: number;
  }[];
  status: boolean;
  createAt: Date;
  createBy: string;
}

export const createImport = async (data: {
  staff: string;
  provider: string;
  details: {
    id: string;
    material: string;
    size: string;
    unitPrice: number;
    quantity: number;
    discount: string; // Expects a percentage string, e.g., "10" for 10%
  }[];
}) => {
  try {
    // Connect to the database
    await connectToDatabase();

    // Calculate total cost
    const totalCost = data.details.reduce((sum, item) => {
      const itemCost = item.unitPrice * item.quantity;
      const discountAmount = (parseFloat(item.discount) / 100) * itemCost;
      return sum + (itemCost - discountAmount);
    }, 0);

    // Create a new import record
    const newOrder = await Import.create({
      staff: new ObjectId(data.staff),
      provider: new ObjectId(data.provider),
      totalCost,
      details: data.details,
      status: false,
    });

    return newOrder;
  } catch (error) {
    console.error("Error creating Order: ", error);
    throw new Error("Failed to create order");
  }
};

// Sửa nhập hàng
export const editImport = async (
  id: string,
  data: {
    staff?: string;
    totalCost?: number;
    details?: {
      id: string;
      material: string;
      size: string;
      unitPrice: number;
      quantity: number;
      discount: string;
    }[];
  }
) => {
  try {
    connectToDatabase();
    const importData = await Import.findById(id);
    if (!importData) {
      throw new Error("Import not found");
    }
    if (importData.status) {
      throw new Error("Cannot edit verified import");
    }
    const updatedImport = await Import.findByIdAndUpdate(
      id,
      {
        staff: data.staff ? new ObjectId(data.staff) : importData.staff,
        totalCost: data.totalCost || importData.totalCost,
        details: data.details || importData.details,
      },
      { new: true }
    );
    return updatedImport;
  } catch (error) {
    console.log("Error editing Import: ", error);
    throw new Error("Failed to edit import");
  }
};

// Xóa nhập hàng
export const deleteImport = async (id: string) => {
  try {
    connectToDatabase();
    const importData = await Import.findById(id);
    if (!importData) {
      throw new Error("Import not found");
    }
    if (importData.status) {
      throw new Error("Cannot delete verified import");
    }
    await Import.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.log("Error deleting Import: ", error);
    throw new Error("Failed to delete import");
  }
};

// Xác nhận nhập hàng
export const verifyImport = async (id: string) => {
  try {
    connectToDatabase();
    const importData = await Import.findById(id);
    if (!importData) {
      throw new Error("Import not found");
    }
    if (importData.status) {
      throw new Error("Import already verified");
    }
    const importDetails = importData.details;
    for (const detail of importDetails) {
      const product = await Product.findById(detail.id);
      if (!product) {
        throw new Error("Product not found");
      }
      for (const variant of product.variants) {
        if (variant.material === detail.material) {
          for (const size of variant.sizes) {
            if (size.size === detail.size) {
              size.stock += detail.quantity;
            }
          }
        }
      }
      await product.save();
    }
    await Import.findByIdAndUpdate(id, { status: true }, { new: true });
    await createFinance({
      type: "outcome",
      date: new Date(),
      value: importData.totalCost, // Dùng giá trị cost của đơn hàng làm value
    });
    return true;
  } catch (error) {
    console.log("Error verifying Import: ", error);
    throw new Error("Failed to verify import");
  }
};

export const getImportById = async (id: string) => {
  try {
    connectToDatabase();
    const order = await Import.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    console.log(order, "import detail");
    const orderDetails = order.details;
    const products = [];
    for (const detail of orderDetails) {
      const product = await Product.findById(detail.id.toString());
      if (!product) {
        throw new Error("Product not found");
      }
      const vouchers = await Voucher.find({
        _id: { $in: product.vouchers },
      });
      const provider = await ProductProvider.findById(product.provider);
      const files = await File.find({ _id: { $in: product.files } });
      products.push({
        product: {
          ...product.toObject(),
          vouchers: vouchers,
          provider: provider,
          files: files,
        },
        material: detail.material,
        size: detail.size,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        discount: detail.discount,
      });
    }
    const customer = await ProductProvider.findById(order.provider);
    console.log(order.customer, "provider order.customer");
    const staff = await Staff.findById(order.staff);
    return {
      order: {
        ...order.toObject(),
        provider: customer,
        staff: staff,
      },
      products: products,
    };
  } catch (error) {
    console.log("Error fetching Order: ", error);
    throw new Error("Failed to fetch order");
  }
};

// Lấy tất cả nhập hàng của một nhà cung cấp
export const getAllImportsOfProvider = async (staffId: string) => {
  try {
    connectToDatabase();
    const imports = await Import.find({ provider: new ObjectId(staffId) });

    // Nếu không có import nào, trả về mảng rỗng
    if (!imports || imports.length === 0) {
      return [];
    }

    const result = await Promise.all(
      imports.map(async (importData) => {
        const staff = await Staff.findById(importData.staff);
        const provider = await ProductProvider.findById(importData.provider);

        const invoices = await Promise.all(
          importData.details.map(async (detail: any) => {
            const product = await Product.findById(detail.id);
            if (!product) {
              console.warn(`Product not found for ID: ${detail.id}`);
              return null; // Bỏ qua sản phẩm không tồn tại
            }
            if (!product.files || product.files.length === 0) {
              console.warn(`Product files not found for ID: ${detail.id}`);
              return null; // Bỏ qua sản phẩm không có files
            }
            const file = await File.find({ _id: { $in: product.files } });

            return {
              id: product._id.toString(),
              productName: product.name,
              productImage: file[0]?.url || "", // Kiểm tra URL file trước khi gán
              unitPrice: product.cost,
              quantity: detail.quantity,
              material: detail.material,
              size: detail.size,
              discount: Number(detail.discount),
            };
          })
        );
        // console.log(invoices, "import invoices provider");
        // console.log(provider.representativeName, "import provider provider");
        // console.log(importData, "import importData provider");
        // console.log(staff, "import staff provider");
        return {
          id: importData._id.toString(),
          suplier: {
            id: provider._id.toString(),
            phoneNumber: provider.phoneNumber,
            fullname: provider.fullname,
            address: provider.address,
          },
          Representative: provider.representativeName,
          invoice: invoices.filter(Boolean), // Loại bỏ null từ danh sách hóa đơn
          status: importData.status,
          createAt: importData.createdAt,
          createBy: staff.fullName,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error fetching Imports of Staff: ", error);
    throw new Error("Failed to fetch imports of staff");
  }
};

export const getAllImportsOfStaff = async (staffId: string) => {
  try {
    connectToDatabase();
    const imports = await Import.find({ staff: new ObjectId(staffId) });

    // Nếu không có import nào, trả về mảng rỗng
    if (!imports || imports.length === 0) {
      return [];
    }

    const result = await Promise.all(
      imports.map(async (importData) => {
        const staff = await Staff.findById(importData.staff);
        const provider = await ProductProvider.findById(importData.provider);

        const invoices = await Promise.all(
          importData.details.map(async (detail: any) => {
            const product = await Product.findById(detail.id);
            if (!product) {
              console.warn(`Product not found for ID: ${detail.id}`);
              return null; // Bỏ qua sản phẩm không tồn tại
            }
            if (!product.files || product.files.length === 0) {
              console.warn(`Product files not found for ID: ${detail.id}`);
              return null; // Bỏ qua sản phẩm không có files
            }
            const file = await File.find({ _id: { $in: product.files } });

            return {
              id: product._id.toString(),
              productName: product.name,
              productImage: file[0]?.url || "", // Kiểm tra URL file trước khi gán
              unitPrice: product.cost,
              quantity: detail.quantity,
              material: detail.material,
              size: detail.size,
              discount: Number(detail.discount),
            };
          })
        );

        return {
          id: importData._id.toString(),
          suplier: {
            id: provider._id.toString(),
            phoneNumber: provider.phoneNumber,
            fullname: provider.fullname,
            address: provider.address,
          },
          invoice: invoices.filter(Boolean), // Loại bỏ null từ danh sách hóa đơn
          status: importData.status,
          createAt: importData.createdAt,
          createBy: staff.fullName,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error fetching Imports of Staff: ", error);
    throw new Error("Failed to fetch imports of staff");
  }
};

export const getImports = async () => {
  try {
    connectToDatabase();
    const imported = await Import.find().populate("provider").populate("staff");
    console.log(imported, "imported");

    if (imported.length === 0) {
      return [];
    }
    const importsResponse = [];

    for (const imports of imported) {
      const products = [];
      for (const detail of imports.details) {
        const product = await Product.findById(detail.id.toString())
          .populate("vouchers")
          .populate("provider")
          .populate("files");

        if (!product) {
          throw new Error("Product not found");
        }
        products.push({
          product: {
            ...product.toObject(),
            vouchers: product.vouchers,
            provider: product.provider,
            files: product.files,
          },
          material: detail.material,
          size: detail.size,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          discount: detail.discount,
        });
      }
      importsResponse.push({
        ...imports.toObject(),
        customer: imports.provider,
        staff: imports.staff,
        products: products,
      });
    }
    return importsResponse;
  } catch (error) {
    console.error("Error fetching Imports: ", error);
    throw new Error("Failed to fetch imports");
  }
};
