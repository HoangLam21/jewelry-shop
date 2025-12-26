"use server";

import User from "@/database/user.model";
import formidable from "formidable";
import { createFile } from "./file.action";
import Staff from "@/database/staff.model";
import Customer from "@/database/customer.model";

export const uploadCustomerAvatar = async (userId: string, file: formidable.File) => {
  try {
    const uploadedAvatar = await createFile(file);
    await Customer.findByIdAndUpdate(userId, { avatar: uploadedAvatar.url });
    return { message: "Upload avatar successfully!" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadStaffAvatar = async (userId: string, file: formidable.File) => {
  try {
    const uploadedAvatar = await createFile(file);
    await Staff.findByIdAndUpdate(userId, { avatar: uploadedAvatar.url });
    return { message: "Upload avatar successfully!" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
