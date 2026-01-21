// "use client";
// import MyButton from "@/components/shared/button/MyButton";
// import CommentCard from "@/components/shared/card/CommentCard";
// import { getReviewById } from "@/lib/services/rating.service";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import CreateReview from "./CreateReview";
// import { fetchOrder, getOrderById } from "@/lib/service/order.service";
// import { ProductData } from "@/components/admin/product/ProductList";
// import { ProductResponse } from "@/dto/ProductDTO";

// export interface CommentData {
//   id: string;
//   userId: string;
//   userName: string;
//   avatar: string;
//   productId: string;
//   rating: number;
//   createAt: Date;
//   productName: string;
//   size: string;
//   material: string;
//   comment: string;
//   image: string[];
// }

// const Reviews = () => {
//   const { id } = useParams<{ id: string }>() as { id: string };
//   const [comments, setComments] = useState<CommentData[]>([]);
//   const [openReview, setOpenReview] = useState(false);
//   const [productOrder, setProductOrder] = useState<ProductResponse[]>([]);
//   const [checkProductOrder, setCheckProductOrder] = useState(false);
//   const [userName, setUserName] = useState("");
//   useEffect(() => {
//     const getReview = async () => {
//       const data = await getReviewById(id);
//       const reviews: CommentData[] = data.map((item: any) => ({
//         id: item._id,
//         userId: item.userId ? item.userId._id : "",
//         userName: item.userId ? item.userId.fullName : "Unknown Name",
//         avatar:
//           item.userId && item.userId.avatar
//             ? item.userId.avatar
//             : "/assets/images/avatar.jpg",
//         productId: item.productId,
//         rating: item.point,
//         createAt: new Date(item.createAt),
//         productName: "", // Sửa "productNamme" thành "productName"
//         size: "",
//         material: "",
//         comment: item.content ? item.content : "No comment",
//         image: item.images.map((image: any) => image.url)
//       }));

//       setComments(reviews);

//       console.log(data);
//     };
//     getReview();
//   }, [id]);

//   useEffect(() => {
//     let userId = localStorage.getItem("userId");
//     //if(!userId) return;
//     if (!userId) userId = "676c26abbc53a1913f2c9581";
//     const getDetailOrderById = async () => {
//       const orderList: any = await fetchOrder();

//       if (orderList) {
//         const userOrders = orderList.filter(
//           (item: any) => item.customer._id === userId
//         );
//         console.log(userOrders, "check");
//         setUserName(userOrders[0].customer.fullName);
//         for (const order of userOrders) {
//           const productList = order.products.map((item: any) => item.product);
//           const exists = productList.some((product: any) => product._id === id);
//           if (exists) {
//             setCheckProductOrder(true);
//           }
//           setProductOrder((prev) => ({
//             ...prev,
//             productList
//           }));
//         }
//       }
//     };
//     getDetailOrderById();
//   }, []);

//   const handleCreateReview = () => {
//     setOpenReview(true);
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-4 p-4">
//         {comments && comments.length > 0 ? (
//           comments.map((item) => <CommentCard key={item.id} item={item} />)
//         ) : (
//           <p>No reviews available for this product.</p>
//         )}
//       </div>
//       {/* Footer */}
//       {checkProductOrder && (
//         <div className="w-full flex justify-end p-6 ">
//           <MyButton
//             event={handleCreateReview}
//             width="w-28"
//             background="bg-primary-100"
//             text_color="text-white"
//             title="Let's review"
//           />
//         </div>
//       )}

//       {openReview && (
//         <CreateReview
//           setOpenReview={setOpenReview}
//           setComments={setComments}
//           userName={userName}
//         />
//       )}
//     </>
//   );
// };

// export default Reviews;

"use client";
import MyButton from "@/components/shared/button/MyButton";
import CommentCard from "@/components/shared/card/CommentCard";
import {
  getReviewById,
  calculateRatingStats,
} from "@/lib/services/rating.service";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CreateReview from "./CreateReview";
import { fetchOrder } from "@/lib/service/order.service";
import { Star, MessageSquare } from "lucide-react";

export interface CommentData {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  productId: string;
  rating: number;
  createAt: Date;
  productName: string;
  size: string;
  material: string;
  comment: string;
  image: string[];
}

interface ReviewsProps {
  productId?: string;
  setTotalReviews?: (total: number) => void;
  ratingStats?: {
    averageRating: number;
    totalReviews: number;
    distribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
  };
}

const Reviews: React.FC<ReviewsProps> = ({
  productId,
  setTotalReviews,
  ratingStats: initialStats,
}) => {
  const params = useParams();
  const id = (productId || params?.id) as string;

  const [comments, setComments] = useState<CommentData[]>([]);
  const [openReview, setOpenReview] = useState(false);
  const [checkProductOrder, setCheckProductOrder] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [ratingStats, setRatingStats] = useState(
    initialStats || {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  );

  useEffect(() => {
    const getReview = async () => {
      try {
        setLoading(true);
        const data = await getReviewById(id);

        // Map reviews data
        const reviews: CommentData[] = data.map((item: any) => ({
          id: item._id,
          userId: item.userId?._id || "",
          userName: item.userId?.fullName || "Anonymous User",
          avatar: item.userId?.avatar || "/assets/images/avatar.jpg",
          productId: item.productId,
          rating: item.point,
          createAt: new Date(item.createAt),
          productName: "",
          size: "",
          material: "",
          comment: item.content || "No comment provided",
          image: item.images?.map((img: any) => img.url) || [],
        }));

        setComments(reviews);

        // Calculate statistics
        const stats = calculateRatingStats(data);
        setRatingStats(stats);

        if (setTotalReviews) {
          setTotalReviews(stats.totalReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getReview();
    }
  }, [id, setTotalReviews]);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) userId = "676c26abbc53a1913f2c9581"; // Test user

    const checkUserOrder = async () => {
      try {
        const orderList: any = await fetchOrder();
        if (orderList) {
          const userOrders = orderList.filter(
            (item: any) => item.customer._id === userId
          );

          if (userOrders.length > 0) {
            setUserName(userOrders[0].customer.fullName);

            for (const order of userOrders) {
              const productList = order.products.map(
                (item: any) => item.product
              );
              const exists = productList.some(
                (product: any) => product._id === id
              );
              if (exists) {
                setCheckProductOrder(true);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking user orders:", error);
      }
    };

    checkUserOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Rating Summary Section */}
      <div className="px-6 py-8 bg-gray-50 dark:bg-dark-400">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Overall Rating */}
            <div className="flex flex-col items-center justify-center md:w-1/3 bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm">
              <div className="text-5xl font-bold text-dark100_light500 mb-2">
                {ratingStats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(ratingStats.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on {ratingStats.totalReviews}{" "}
                {ratingStats.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  ratingStats.distribution[
                    rating as keyof typeof ratingStats.distribution
                  ];
                const percentage =
                  ratingStats.totalReviews > 0
                    ? (count / ratingStats.totalReviews) * 100
                    : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-dark100_light500">
                        {rating}
                      </span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-primary-100" />
            <h3 className="text-xl font-semibold text-dark100_light500">
              Customer Reviews
            </h3>
          </div>

          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((item) => (
                <CommentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                No reviews yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Be the first to review this product
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Button */}
      {checkProductOrder && (
        <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-400">
          <div className="max-w-4xl mx-auto flex justify-end">
            <MyButton
              event={() => setOpenReview(true)}
              width="w-fit"
              background="bg-primary-100 hover:bg-primary-200"
              text_color="text-white"
              title="Write a Review"
            />
          </div>
        </div>
      )}

      {/* Create Review Modal */}
      {openReview && (
        <CreateReview
          setOpenReview={setOpenReview}
          setComments={setComments}
          userName={userName}
        />
      )}
    </div>
  );
};

export default Reviews;
