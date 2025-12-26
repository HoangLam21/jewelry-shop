"use server";
import ProductProvider from "@/database/provider.model";
import { connectToDatabase } from "../mongoose";
import { count } from "console";

export const createProvider = async (data: {
  name: string;
  address: string;
  contact: string;
  representativeName: string;
  city: string;
  country: string;
}) => {
  try {
    await connectToDatabase();
    const newProvider = await ProductProvider.create({
      name: data.name,
      address: data.address,
      contact: data.contact,
      representativeName: data.representativeName,
      city: data.city,
      country: data.country,
    });
    return newProvider;
  } catch (error) {
    console.log("Error creating Provider: ", error);
    throw new Error("Failed to create provider");
  }
};

export const getProviders = async () => {
  try {
    await connectToDatabase();
    const providers = await ProductProvider.find();
    return providers;
  } catch (error) {
    console.log("Error fetching Providers: ", error);
    throw new Error("Failed to fetch providers");
  }
};

export const getProviderById = async (id: string) => {
  try {
    await connectToDatabase();
    const provider = await ProductProvider.findById(id);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  } catch (error) {
    console.log("Error fetching Provider by ID: ", error);
    throw new Error("Failed to fetch provider");
  }
};

export const updateProvider = async (
  id: string,
  data: Partial<{
    name: string;
    address: string;
    contact: string;
    representativeName: string;
    city: string;
    country: string;
  }>
) => {
  try {
    await connectToDatabase();
    const updatedProvider = await ProductProvider.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true }
    );
    if (!updatedProvider) {
      throw new Error("Provider not found");
    }
    return updatedProvider;
  } catch (error) {
    console.log("Error updating Provider: ", error);
    throw new Error("Failed to update provider");
  }
};

export const deleteProvider = async (id: string) => {
  try {
    await connectToDatabase();
    const deletedProvider = await ProductProvider.findByIdAndDelete(id);
    if (!deletedProvider) {
      throw new Error("Provider not found");
    }
    return true;
  } catch (error) {
    console.log("Error deleting Provider: ", error);
    throw new Error("Failed to delete provider");
  }
};
