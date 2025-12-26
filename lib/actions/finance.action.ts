"use server";

import Finance from "@/database/finance.model";
import mongoose from "mongoose";
import { connectToDatabase } from "../mongoose";

// Create a new finance record
export const createFinance = async (data: {
  type: string;
  date: Date;
  value: number;
}) => {
  try {
    await connectToDatabase();
    const newFinance = await Finance.create({
      type: data.type,
      date: data.date,
      value: data.value,
    });
    return newFinance;
  } catch (error) {
    console.log("Error creating Finance record: ", error);
    throw new Error("Failed to create finance record");
  }
};

// Get all finance records
export const getFinances = async () => {
  try {
    await connectToDatabase();
    const finances = await Finance.find();
    if (finances.length === 0) {
      return [];
    }

    return finances;
  } catch (error) {
    console.log("Error fetching Finance records: ", error);
    throw new Error("Failed to fetch finance records");
  }
};

// Get a finance record by ID
export const getFinanceById = async (id: string) => {
  try {
    await connectToDatabase();
    const finance = await Finance.findById(id);
    if (!finance) {
      throw new Error("Finance record not found");
    }
    return finance;
  } catch (error) {
    console.log("Error fetching Finance record by ID: ", error);
    throw new Error("Failed to fetch finance record");
  }
};

// Update a finance record
export const updateFinance = async (
  id: string,
  data: Partial<{
    type: string;
    date: Date;
    value: number;
  }>
) => {
  try {
    await connectToDatabase();
    const updatedFinance = await Finance.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true }
    );
    if (!updatedFinance) {
      throw new Error("Finance record not found");
    }
    return updatedFinance;
  } catch (error) {
    console.log("Error updating Finance record: ", error);
    throw new Error("Failed to update finance record");
  }
};

// Delete a finance record
export const deleteFinance = async (id: string) => {
  try {
    await connectToDatabase();
    const deletedFinance = await Finance.findByIdAndDelete(id);
    if (!deletedFinance) {
      throw new Error("Finance record not found");
    }
    return true;
  } catch (error) {
    console.log("Error deleting Finance record: ", error);
    throw new Error("Failed to delete finance record");
  }
};
