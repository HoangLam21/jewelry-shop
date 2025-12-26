import { FileContent } from "@/dto/ProductDTO";
import { CreateRatingDTO } from "@/dto/RatingDTO";

export async function getReviewById(id: string) {
  try {
    const response = await fetch(`/api/rating/product?productId=${id}`);
    if (!response.ok) {
      throw new Error("Error fetching products");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}

export async function createReview(params: CreateRatingDTO) {
  let userId = localStorage.getItem("userId");
  // if(!userId) {
  //   alert("User is not found. Please try agian");
  //   return;
  // }
  if (!userId) userId = "676c26abbc53a1913f2c9581";
  const formDataToSend = new FormData();
  formDataToSend.append("userId", userId);
  formDataToSend.append("productId", params.productId);
  formDataToSend.append("point", params.point.toString());
  formDataToSend.append("content", params.content);

  if (params.images && params.images.length > 0) {
    // Sử dụng Promise.all để xử lý các tệp hình ảnh bất đồng bộ
    const imagePromises = params.images.map(async (image: FileContent) => {
      if (image.url && image.fileName) {
        try {
          const response = await fetch(image.url);
          if (response.ok) {
            const blob = await response.blob();
            formDataToSend.append("images", blob, image.fileName);
          } else {
            console.error("Failed to fetch image from URL", image.url);
          }
        } catch (error) {
          console.error("Error fetching image", error);
        }
      } else {
        console.error("FileContent is missing necessary fields");
      }
    });

    // Đợi tất cả các Promise hoàn thành
    await Promise.all(imagePromises);
  }

  try {
    const response = await fetch("/api/rating/create", {
      method: "POST",
      body: formDataToSend
    });

    if (!response.ok) {
      throw new Error("Failed to create rating");
    }

    const result = await response.json();
    console.log("Rating created successfully: ", result);
    return result;
  } catch (error) {
    console.error("Error submitting form: ", error);
  }
}
