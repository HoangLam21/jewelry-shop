"use server"
import cloudinary from "@/cloudinary";
import File from "@/database/file.model";
import formidable from "formidable";

export const createFile = async (file: formidable.File) => {
  try {
    
    const createdFile = await cloudinary.uploader.upload(file.filepath);
    console.log("created file: ",createdFile);
    return await File.create({
      fileName: createdFile.display_name,
      url: createdFile.url,
      publicId: createdFile.public_id,
      bytes: createdFile.bytes,
      width: createdFile.width,
      height: createdFile.height,
      format: createdFile.format,
    });
  } catch (error) {
    console.log("Error create FIle: ", error);
  }
};

export const deleteFile = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.log("Error delete File: ", error);
    return false;
  }
};
