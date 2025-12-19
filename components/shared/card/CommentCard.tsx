import Image from "next/image";
import React from "react";

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
  return (
    <div className="w-full flex border-b border-border-color pb-4">
      <div className="w-20">
        <Image
          alt="avatar"
          src={item.avatar}
          width={45}
          height={45}
          className="rounded-full"
        />
      </div>
      <div className="w-full flex flex-col">
        <p className="text-dark100_light500">{item.userName}</p>
        <p>
          {" "}
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={
                index < item.rating ? "text-yellow-500" : "text-gray-300"
              }
            >
              ★
            </span>
          ))}
        </p>
        <p className="text-sm text-dark100_light500">
          {" "}
          {`${new Date(item.createAt).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          })} ${new Date(item.createAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          })} |  Phân loại hàng: ${item.productName} | Size: ${
            item.size
          } | Material: ${item.material}`}
        </p>
        <p className="text-dark100_light500">{item.comment}</p>
        <div className="flex gap-2 mt-2">
          {item.image.map((it, index) => (
            <div className="w-32 h-32" key={index}>
              <Image
                src={it || "/assets/images/avatar.jpg"}
                alt="product image"
                className="w-full h-full object-cover"
                width={125}
                height={125125}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
