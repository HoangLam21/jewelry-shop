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
  // Validate productId
  if (!params.productId || params.productId.trim() === "" || params.productId === "undefined") {
    console.error("[createReview] Invalid productId:", params.productId);
    throw new Error("Product ID is required and must be valid");
  }

  // Lấy userId từ userData trong localStorage (được set từ home page)
  let userId: string | null = null;

  if (typeof window === "undefined") {
    throw new Error("This function must be called from the client side");
  }

  // Ưu tiên lấy từ localStorage userData
  try {
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      userId = userData._id;
      console.log("[createReview] UserId from localStorage userData:", userId);
    }
  } catch (error) {
    console.error("[createReview] Error parsing userData from localStorage:", error);
  }

  // Nếu không có trong localStorage, thử fetch từ API /api/auth/role
  // Cần Clerk userId để fetch - có thể lấy từ window hoặc localStorage
  if (!userId || userId.trim() === "") {
    try {
      // Thử lấy Clerk userId từ window (nếu có Clerk instance)
      // Hoặc có thể lưu Clerk userId vào localStorage khi user đăng nhập
      const clerkUserId = localStorage.getItem("clerkUserId");

      if (clerkUserId) {
        const response = await fetch(`/api/auth/role?userId=${clerkUserId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.role === "customer" && data.userIdInDb) {
            userId = data.userIdInDb;
            console.log("[createReview] UserId from API fallback:", userId);
          }
        }
      }
    } catch (error) {
      console.error("[createReview] Error fetching userId from API:", error);
    }
  }

  // Nếu vẫn không có userId, throw error (không hardcode)
  if (!userId || userId.trim() === "") {
    console.error("[createReview] User ID is missing. User must be logged in as a customer.");
    throw new Error("User is not found. Please log in and try again.");
  }

  console.log("[createReview] Creating review with productId:", params.productId, "userId:", userId);

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
      body: formDataToSend,
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

export function calculateRatingStats(reviews: any[]) {
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalReviews = reviews.length;
  const sumRating = reviews.reduce((sum, review) => sum + review.point, 0);
  const averageRating = sumRating / totalReviews;

  const distribution = {
    5: reviews.filter((r) => r.point === 5).length,
    4: reviews.filter((r) => r.point === 4).length,
    3: reviews.filter((r) => r.point === 3).length,
    2: reviews.filter((r) => r.point === 2).length,
    1: reviews.filter((r) => r.point === 1).length,
  };

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    distribution,
  };
}
