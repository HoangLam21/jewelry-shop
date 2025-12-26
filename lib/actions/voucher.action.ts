"use server";
import Voucher from "@/database/voucher.model";
import { connectToDatabase } from "@/lib/mongoose";

export const createVoucher = async (data: {
  name: string;
  discount: number;
  expDate: Date;
}) => {
  try {
    await connectToDatabase();
    const newVoucher = await Voucher.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newVoucher;
  } catch (error) {
    console.error("Error creating Voucher:", error);
    throw new Error("Failed to create voucher");
  }
};

export const getVouchers = async () => {
  try {
    await connectToDatabase();
    const vouchers = await Voucher.find();
    return vouchers;
  } catch (error) {
    console.error("Error fetching Vouchers:", error);
    throw new Error("Failed to fetch vouchers");
  }
};

export const getVoucherById = async (id: string) => {
  try {
    await connectToDatabase();
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    return voucher;
  } catch (error) {
    console.error("Error fetching Voucher by ID:", error);
    throw new Error("Failed to fetch voucher");
  }
};

export const updateVoucher = async (
  id: string,
  data: Partial<{ name: string; discount: number; expDate: Date }>
) => {
  try {
    await connectToDatabase();
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedVoucher) {
      throw new Error("Voucher not found");
    }
    return updatedVoucher;
  } catch (error) {
    console.error("Error updating Voucher:", error);
    throw new Error("Failed to update voucher");
  }
};


export const deleteVoucher = async (id: string) => {
  try {
    await connectToDatabase();
    const deletedVoucher = await Voucher.findByIdAndDelete(id);
    if (!deletedVoucher) {
      throw new Error("Voucher not found");
    }
    return deletedVoucher;
  } catch (error) {
    console.error("Error deleting Voucher:", error);
    throw new Error("Failed to delete voucher");
  }
};
