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
}
interface ContentReview {
  rating: number;
  comment: string;
}
const defaultContent = {
  rating: 0,
  comment: ""
};
const CreateReview = ({ setOpenReview, setComments, userName }: props) => {
  const { id } = useParams<{ id: string }>() as { id: string };
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
    setNewReview((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
    console.log(newReview);
    if (newReview) {
      const data: CreateRatingDTO = {
        productId: id,
        point: newReview.rating,
        content: newReview.comment,
        images: selectedFiles
      };
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
                <InputEdit
                  titleInput="Point"
                  name="rating"
                  onChange={handleChange}
                  width="w-full"
                  placeholder="Enter your point..."
                />
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
