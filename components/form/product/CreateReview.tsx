"use client";
import { convertFilesToFileContent } from "@/components/admin/product/AddProduct";
import InputEdit from "@/components/shared/input/InputEdit";
import LabelInformation from "@/components/shared/label/LabelInformation";
import TableImport from "@/components/shared/table/TableImport";
import { Button } from "@/components/ui/button";
import { FileContent } from "@/dto/ProductDTO";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { CommentData } from "./Reviews";
import { CreateRatingDTO } from "@/dto/RatingDTO";
import { useParams } from "next/navigation";
import { createReview } from "@/lib/services/rating.service";
interface props {
  userName: string;
  setOpenReview: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<React.SetStateAction<CommentData[]>>;
  productId?: string;
}
interface ContentReview {
  rating: number;
  comment: string;
}
const defaultContent = {
  rating: 0,
  comment: ""
};
const CreateReview = ({ setOpenReview, setComments, userName, productId }: props) => {
  const params = useParams<{ id?: string; slug?: string }>();
  // Ưu tiên productId từ props, sau đó thử id từ params, cuối cùng là slug
  const id = productId || params?.id || params?.slug || "";
  const [selectedFiles, setSelectedFiles] = useState<FileContent[]>([]);
  const [newReview, setNewReview] = useState<ContentReview>(defaultContent);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleRemoveFile = (url: string) => {
    const newFiles = selectedFiles.filter((file) => file.url !== url);
    setSelectedFiles(newFiles);
  };
  const handleAdd = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Chuyển đổi các file thành dạng FileContent trước
      const fileArray = Array.from(files);
      const convertedFiles = convertFilesToFileContent(fileArray);

      // Cập nhật lại trạng thái với các file đã chuyển đổi
      setSelectedFiles((prevFiles) => [...prevFiles, ...convertedFiles]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Nếu là trường rating (point), chỉ cho phép số từ 1-5
    if (name === "rating") {
      const numValue = parseInt(value);
      // Chỉ cập nhật nếu giá trị là số hợp lệ từ 1-5 hoặc rỗng
      if (value === "" || (!isNaN(numValue) && numValue >= 1 && numValue <= 5)) {
        setNewReview((prev) => ({
          ...prev,
          [name]: value === "" ? 0 : numValue
        }));
      }
      // Nếu giá trị không hợp lệ, không cập nhật (giữ nguyên giá trị cũ)
    } else {
      setNewReview((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const columns = [
    { header: "Image", accessor: "image" },
    {
      header: "Name",
      accessor: "name"
    }
  ];
  const renderRow = (img: FileContent) => {
    return (
      <tr
        key={`${img.fileName}`}
        className="border-t border-gray-300 text-sm dark:text-dark-360"
      >
        <td className="px-4 py-2">
          <Image
            src={img.url}
            alt="editImg"
            width={40}
            height={40}
            className="rounded-lg object-cover w-10 h-10"
          />
        </td>
        <td className="px-4 py-2">
          <div className="flex w-[100px] h-fit">
            <p className="text-sm dark:text-dark-360 truncate overflow-hidden whitespace-nowrap">
              {img.fileName}
            </p>
          </div>
        </td>
        <td className="px-4 py-2">
          <Icon
            icon="gg:trash"
            width={18}
            height={18}
            className="text-red-700 cursor-pointer"
            onClick={() => handleRemoveFile(img.url)}
          />
        </td>
      </tr>
    );
  };

  const handleConfirm = async () => {
    console.log("[CreateReview] handleConfirm - id:", id, "productId prop:", productId);

    if (!id || id.trim() === "") {
      alert("Product ID is missing. Please refresh the page and try again.");
      console.error("[CreateReview] Product ID is missing");
      return;
    }

    // Validate rating
    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }

    // Validate content
    if (!newReview.comment || newReview.comment.trim() === "") {
      alert("Please enter a description for your review.");
      return;
    }

    if (newReview) {
      const data: CreateRatingDTO = {
        productId: id,
        point: newReview.rating,
        content: newReview.comment,
        images: selectedFiles
      };
      console.log("[CreateReview] Sending data:", data);
      const result = await createReview(data);
      if (result) {
        const data: CommentData = {
          id: result._id,
          userId: result.userId,
          userName: userName,
          avatar: "/assets/images/avatar.jpg",
          productId: result.productId,
          rating: result.point,
          createAt: new Date(result.createAt),
          productName: "",
          size: "",
          material: "",
          comment: result.content,
          image: result.imageUrls
        };
        setComments((pre) => [...pre, data]);
        alert("Review is recorded.");
      } else {
        alert("Can't record your review");
      }
    } else alert("Error review this product");
  };
  return (
    <div className="modal-overlay">
      <div className="w-[700px] h-fit rounded-lg background-light800_dark300 items-center justify-start flex flex-col shadow-sm drop-shadow-sm shadow-zinc-700 p-2 gap-4 overflow-y-scroll overflow-x-hidden scrollable">
        <div className="flex flex-row justify-between items-start w-full h-fit">
          <label className="block mb-2 text-[18px] font-medium">
            Your review is our pleasure.
          </label>
          <Icon
            icon="iconoir:cancel"
            width={24}
            height={24}
            className="text-dark100_light500 cursor-pointer"
            onClick={() => setOpenReview(false)}
          />
        </div>

        <div className="flex flex-row justify-between items-start w-full h-full">
          <div className="flex flex-col gap-2 w-[45%]">
            <p className="text-text-dark-400">Images:</p>
            <div className="flex border border-border-color rounded-lg w-full h-fit">
              <TableImport
                columns={columns}
                data={selectedFiles}
                renderRow={renderRow}
              />
            </div>
            <div className="flex w-full h-fit justify-end items-center mt-2">
              <Button
                className="bg-import-bg-blue hover:bg-import-bg-blue text-primary-100 paragraph-regular p-2 rounded-[20px] gap-[2px] w-fit"
                onClick={handleAdd}
              >
                <Icon
                  icon="ic:round-add"
                  height={16}
                  width={16}
                  className="text-primary-100"
                />
                Add
              </Button>
            </div>
          </div>
          <div className="flex flex-col flex-grow-0 w-[50%] h-full justify-start items-center gap-4">
            <div className="flex flex-col gap-4 items-start justify-start w-full h-fit ">
              <div className="flex flex-row gap-4 w-full h-fit">
                <div className="flex flex-col gap-[8px] text-text-dark-500 w-full">
                  <p className="text-text-dark-400">Point:</p>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    step="1"
                    value={newReview.rating || ""}
                    onChange={handleChange}
                    className="h-[34px] border border-border-color rounded-lg px-2 focus:outline-none focus:ring-0"
                    placeholder="Enter your point (1-5)..."
                    onKeyDown={(e) => {
                      // Ngăn chặn nhập ký tự không phải số (trừ phím điều hướng và xóa)
                      if (
                        !/[0-9]/.test(e.key) &&
                        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) &&
                        !(e.ctrlKey || e.metaKey) // Cho phép Ctrl+C, Ctrl+V, etc.
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {newReview.rating && (newReview.rating < 1 || newReview.rating > 5) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a number between 1 and 5</p>
                  )}
                </div>
              </div>
              <div className="flex w-full h-fit">
                <InputEdit
                  titleInput="Description"
                  name="comment"
                  onChange={handleChange}
                  width="w-full"
                  placeholder="Enter some description..."
                />
              </div>
            </div>

            <div className="flex flex-row w-full h-fit gap-6 justify-end">
              <Button
                onClick={() => setOpenReview(false)}
                className="text-sm text-dark100_light500 py-2 px-3 rounded-lg bg-slate-200 w-fit"
              >
                Cancel
              </Button>
              <Button
                className="bg-primary-100 hover:bg-primary-100 text-white text-sm py-2 px-3 rounded-lg w-fit"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Input file ẩn để chọn file */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple // Cho phép chọn nhiều file
        onChange={handleFileChange}
      />
    </div>
  );
};

export default CreateReview;
