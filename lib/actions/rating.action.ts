"use server";
import Rating from "@/database/rating.model";
import { connectToDatabase } from "@/lib/mongoose";
import formidable from "formidable";
import { createFile, deleteFile } from "./file.action";
import Customer from "@/database/customer.model";

export const createRating = async (data: {
  userId: string;
  productId: string;
  point: number;
  content: string;
  images?: formidable.File[];
}) => {
  try {
    await connectToDatabase();
    const imageIds = [];
    const imageUrls = [];
    if (data.images) {
      for (const image of data.images) {
        const createdImage = await createFile(image);
        imageIds.push(createdImage._id);
        imageUrls.push(createdImage.url);
      }
    }
    const newRating = await Rating.create({
      ...data,
      images: imageIds,
      createdAt: new Date()
    });
    const response = {
      ...newRating.toObject(),
      imageUrls
    };
    return response;
  } catch (error) {
    console.error("Error creating Rating:", error);
    throw new Error("Failed to create rating");
  }
};

export const getAllRatings = async () => {
  try {
    await connectToDatabase();
    const ratings = await Rating.find().populate("images");
    const ratingReponse = [];
    for (const rating of ratings) {
      const customer = await Customer.findById(rating.userId);
      ratingReponse.push({ ...rating.toObject(), userId: customer });
    }
    return ratingReponse;
  } catch (error) {
    console.error("Error fetching all ratings: ", error);
    throw new Error("Failed to fetch all ratings");
  }
};

export const getRatingsByProductId = async (productId: string) => {
  try {
    await connectToDatabase();
    const ratings = await Rating.find({ productId }).populate("images");
    const ratingReponse = [];
    for (const rating of ratings) {
      const customer = await Customer.findById(rating.userId);
      ratingReponse.push({ ...rating.toObject(), userId: customer });
    }
    return ratingReponse;
  } catch (error) {
    console.error("Error fetching Ratings by ProductId:", error);
    throw new Error("Failed to fetch ratings");
  }
};

export const getRatingById = async (id: string) => {
  try {
    await connectToDatabase();
    const rating = await Rating.findById(id).populate("images");
    if (!rating) {
      throw new Error("Rating not found");
    }
    const customer = await Customer.findById(rating.userId);
    return { ...rating.toObject(), userId: customer };
  } catch (error) {
    console.error("Error fetching Rating by ID:", error);
    throw new Error("Failed to fetch rating");
  }
};

export const updateRating = async (
  id: string,
  data: Partial<{ point: number; content: string; images: formidable.File[] }>
) => {
  try {
    await connectToDatabase();
    const existRating = await Rating.findById(id);
    if (data.images) {
      const imageIds = [];
      for (const id of existRating) {
        await deleteFile(id);
      }
      for (const image of data.images) {
        const createdImage = await createFile(image);
        imageIds.push(createdImage._id);
      }
      const updatedRating = await Rating.findByIdAndUpdate(id, data, {
        new: true
      }).populate("images");
      const customer = await Customer.findById(updatedRating.userId);
      return { ...updatedRating.toObject(), userId: customer };
    } else {
      const updatedRating = await Rating.findByIdAndUpdate(
        id,
        { ...data, images: existRating.images },
        {
          new: true
        }
      ).populate("images");
      if (!updatedRating) {
        throw new Error("Rating not found");
      }
      const customer = await Customer.findById(updatedRating.userId);
      return { ...updatedRating.toObject(), userId: customer };
    }
  } catch (error) {
    console.error("Error updating Rating:", error);
    throw new Error("Failed to update rating");
  }
};

export const deleteRating = async (id: string) => {
  try {
    await connectToDatabase();
    const deletedRating = await Rating.findByIdAndDelete(id);
    if (!deletedRating) {
      throw new Error("Rating not found");
    }
    return deletedRating;
  } catch (error) {
    console.error("Error deleting Rating:", error);
    throw new Error("Failed to delete rating");
  }
};
