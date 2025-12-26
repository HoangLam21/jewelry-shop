"use server";
import Customer from "@/database/customer.model";
import { ICustomer } from "@/database/customer.model";
import { connectToDatabase } from "../mongoose";

export const createCustomer = async (data: {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  gender?: boolean;
  birthday?: Date;
}) => {
  try {
    connectToDatabase();
    const newCustomer = await Customer.create({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      gender: data.gender,
      birthday: data.birthday,
      createAt: new Date()
    });
    return newCustomer;
  } catch (error) {
    console.log("Error creating Customer: ", error);
    throw new Error("Failed to create customer");
  }
};

export const getCustomers = async () => {
  try {
    connectToDatabase();
    const customers = await Customer.find().populate("orders");
    console.log(customers, "data");
    return customers;
  } catch (error) {
    console.log("Error fetching Customers: ", error);
    throw new Error("Failed to fetch customers");
  }
};

export const getCustomerById = async (id: string) => {
  try {
    connectToDatabase();
    const customer = await Customer.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  } catch (error) {
    console.log("Error fetching Customer by ID: ", error);
    throw new Error("Failed to fetch customer");
  }
};

export const updateCustomer = async (
  id: string,
  data: Partial<{
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    gender?: boolean;
    birthday?: Date;
  }>
) => {
  try {
    connectToDatabase();
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedAt: new Date()
      },
      { new: true }
    );
    if (!updatedCustomer) {
      throw new Error("Customer not found");
    }
    return updatedCustomer;
  } catch (error) {
    console.log("Error updating Customer: ", error);
    throw new Error("Failed to update customer");
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    connectToDatabase();
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      throw new Error("Customer not found");
    }
    return true;
  } catch (error) {
    console.log("Error deleting Customer: ", error);
    throw new Error("Failed to delete customer");
  }
};
