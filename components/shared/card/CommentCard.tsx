// import Image from "next/image";
// import React from "react";

// interface Comment {
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

// const CommentCard = ({ item }: { item: Comment }) => {
//   return (
//     <div className="w-full flex border-b border-border-color pb-4">
//       <div className="w-20">
//         <Image
//           alt="avatar"
//           src={item.avatar}
//           width={45}
//           height={45}
//           className="rounded-full"
//         />
//       </div>
//       <div className="w-full flex flex-col">
//         <p className="text-dark100_light500">{item.userName}</p>
//         <p>
//           {" "}
//           {[...Array(5)].map((_, index) => (
//             <span
//               key={index}
//               className={
//                 index < item.rating ? "text-yellow-500" : "text-gray-300"
//               }
//             >
//               ★
//             </span>
//           ))}
//         </p>
//         <p className="text-sm text-dark100_light500">
//           {" "}
//           {`${new Date(item.createAt).toLocaleDateString("vi-VN", {
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit"
//           })} ${new Date(item.createAt).toLocaleTimeString("vi-VN", {
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit"
//           })} |  Phân loại hàng: ${item.productName} | Size: ${
//             item.size
//           } | Material: ${item.material}`}
//         </p>
//         <p className="text-dark100_light500">{item.comment}</p>
//         <div className="flex gap-2 mt-2">
//           {item.image.map((it, index) => (
//             <div className="w-32 h-32" key={index}>
//               <Image
//                 src={it || "/assets/images/avatar.jpg"}
//                 alt="product image"
//                 className="w-full h-full object-cover"
//                 width={125}
//                 height={125125}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommentCard;

import Image from "next/image";
import React, { useState } from "react";
import { Star, Calendar, Package } from "lucide-react";

interface Comment {
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

const CommentCard = ({ item }: { item: Comment }) => {
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Get initials from username
  const getInitials = (name: string) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
              {item.avatar && !imageError ? (
                <Image
                  alt={item.userName || "User"}
                  src={item.avatar}
                  fill
                  className="object-cover"
                  onError={() => {
                    console.log("Avatar load error, showing initials");
                    setImageError(true);
                  }}
                  unoptimized={item.avatar.startsWith("http")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(item.userName)}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h4 className="font-semibold text-dark100_light500 text-lg">
                  {item.userName || "Anonymous User"}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= item.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-500">
                    {item.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(item.createAt)}</span>
              </div>
            </div>

            {/* Product Info (if available) */}
            {(item.productName || item.size || item.material) && (
              <div className="flex flex-wrap gap-3 mb-3 text-sm">
                {item.productName && (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Package className="w-4 h-4" />
                    <span>{item.productName}</span>
                  </div>
                )}
                {item.size && (
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                    Size: {item.size}
                  </span>
                )}
                {item.material && (
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                    Material: {item.material}
                  </span>
                )}
              </div>
            )}

            {/* Comment Text */}
            <p className="text-dark100_light500 leading-relaxed mb-4">
              {item.comment || "No comment provided"}
            </p>

            {/* Images */}
            {item.image && item.image.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {item.image.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imageUrl)}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 hover:opacity-90 transition-opacity group"
                  >
                    <Image
                      src={imageUrl}
                      alt={`Review image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Review image enlarged"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CommentCard;
