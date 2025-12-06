"use client";
import TitleSession from "@/components/shared/label/TitleSession";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { StaffData } from "@/constants/data";
import Image from "next/image";
import LabelInformation from "@/components/shared/label/LabelInformation";
import MyButton from "@/components/shared/button/MyButton";
import InputEdit from "@/components/shared/input/InputEdit";
import InputDate from "@/components/shared/input/InputDate";
import InputSelection from "@/components/shared/input/InputSelection";
import { CreateProvider } from "@/dto/ProviderDTO";
import { FileContent } from "@/dto/ProductDTO";
import { createProvider } from "@/lib/service/provider.service";

const defaultStaff: CreateProvider = {
  name: "",
  address: "",
  contact: "",
  representativeName: "none",
  city: "",
  country: "",
};

const AddProviderInformation = () => {
  const [updateProvider, setUpdateProvider] = useState<CreateProvider | null>(
    defaultStaff
  );
  const [avatar, setAvatar] = useState<FileContent>({
    _id: "",
    fileName: "avatar.jpg", // You can adjust this if needed
    publicId: "",
    bytes: "0",
    url: "/assets/images/avatar.jpg", // Default avatar URL
    width: "", // Set default if necessary
    height: "", // Set default if necessary
    format: "image/jpeg", // Set default format if necessary
    type: "image", // Set default type if necessary
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updateProvider) {
      setUpdateProvider({
        ...updateProvider,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (file) {
      const fileContent: FileContent = {
        _id: "", // Set _id if you have one
        fileName: file.name,
        url: URL.createObjectURL(file),
        publicId: "", // If you have publicId, set it here
        bytes: file.size.toString(),
        width: "", // Set width if you have it
        height: "", // Set height if you have it
        format: file.type,
        type: "image", // Set the file type accordingly
      };
      setAvatar(fileContent); // Now set it as FileContent
    }
  };

  const handleDeleteFile = () => {
    setAvatar({
      _id: "",
      fileName: "",
      publicId: "",
      bytes: "0",
      url: "",
      width: "",
      height: "",
      format: "",
      type: "",
    });
  };

  const handleUpdate = async () => {
    if (updateProvider) {
      console.log(updateProvider);
      try {
        const data: CreateProvider = {
          name: updateProvider.name,
          address: updateProvider.address,
          contact: updateProvider.contact,
          representativeName: updateProvider.representativeName,
          city: updateProvider.city,
          country: updateProvider.country,
        };

        // Create the staff first
        console.log(data, "data of create staff");
        const result = await createProvider(data);
        alert("Staff created successfully, but no avatar uploaded.");
        // if (result) {
        //   // Only upload avatar if there is an avatar to upload
        //   if (avatar && avatar.url) {
        //     await createAvatar(result._id, avatar); // Pass the staff ID and avatar
        //     alert("Staff and avatar created successfully.");
        //   } else {
        //     alert("Staff created successfully, but no avatar uploaded.");
        //   }
        // } else {
        //   alert("Can't create staff.");
        // }
      } catch (err: any) {
        console.error("Error creating data:", err);
        const errorMessage = err?.message || "An unexpected error occurred.";
        alert(`Error creating data: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="w-full flex flex-col p-4 rounded-md shadow-md">
      {/* General Information */}
      <TitleSession
        icon="flowbite:profile-card-outline"
        title="General Information"
      />

      <div className="w-full p-6 flex flex-col gap-6">
        <div className="flex w-full gap-8">
          <div className="w-[115px] h-[115px]">
            {/* Use the url property from the avatar object */}
            <Image
              alt="avatar"
              src={avatar?.url || "/assets/images/avatar.jpg"} // Default to fallback image if avatar.url is not available
              width={115}
              height={115}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <div className="flex gap-8 ">
              <MyButton
                event={() => document.getElementById("fileInput")?.click()} // Open file dialog when the button is clicked
                width="w-40"
                title="Upload photo"
                px="px-4"
                height="h-9"
              />
              <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={handleUploadFile} // File upload event
              />
              <MyButton
                event={handleDeleteFile} // Delete file event
                width="w-40"
                title="Delete photo"
                px="px-4"
                height="h-9"
              />
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-x-20 gap-y-4">
          <InputEdit
            titleInput="Fullname"
            width="w-full"
            name="name"
            onChange={handleChange}
            placeholder="Enter Fullname"
            value={updateProvider?.name ?? ""}
          />
          <InputEdit
            titleInput="Representative"
            width="w-full"
            name="representativeName"
            onChange={handleChange}
            placeholder="Enter Representative"
            value={updateProvider?.representativeName ?? ""}
          />
          {/* <InputDate
            titleInput="Date of birth"
            width="w-full"
            value={updateProvider ? formatDate(updateProvider.dob) : ""}
            onChange={() => {}}
          /> */}
          <InputEdit
            titleInput="Contact"
            width="w-full"
            name="contact"
            onChange={handleChange}
            placeholder="Enter Contact"
            value={updateProvider?.contact ?? ""}
          />
          {/* <InputEdit
            titleInput="Email"
            width="w-full"
            name="email"
            onChange={handleChange}
            placeholder="Enter Fullname"
            value={updateProvider?.email ?? ""}
          /> */}
          {/* <InputSelection
            width="w-full"
            titleInput="Gender"
            options={["Male", "Female", "Orther"]}
            value={updateProvider?.gender ?? "Male"}
            onChange={(value) => {
              setUpdateProvider((prev) => ({
                ...prev!,
                gender: value,
              }));
            }}
          /> */}
        </div>
      </div>

      {/* Address Information */}
      <TitleSession
        icon="mdi:address-marker-outline"
        title="Address Information"
      />

      <div className="w-full p-6 flex flex-col gap-6">
        <div className="w-full grid grid-cols-2 gap-x-20 gap-y-4">
          <InputSelection
            width="w-full"
            titleInput="Country"
            options={["VietNam", "UK", "US", "JP", "C", "K", "Canada"]}
            value={updateProvider?.country ?? "VietNam"}
            onChange={(value) => {
              setUpdateProvider((prev) => ({
                ...prev!,
                country: value,
              }));
            }}
          />
          <InputSelection
            width="w-full"
            titleInput="City"
            options={["TP.HCM", "HN", "DN", "HP", "PT", "VT"]}
            value={updateProvider?.city ?? "TP.HCM"}
            onChange={(value) => {
              setUpdateProvider((prev) => ({
                ...prev!,
                city: value,
              }));
            }}
          />
          {/* <InputSelection
            width="w-full"
            titleInput="District"
            options={["Q1", "Q2", "BT", "Q7", "Q9", "TD"]}
            value={updateProvider?.district ?? "Q1"}
            onChange={(value) => {
              setUpdateProvider((prev) => ({
                ...prev!,
                district: value,
              }));
            }}
          /> */}
          <InputEdit
            titleInput="Address"
            width="w-full"
            name="address"
            onChange={handleChange}
            placeholder="Enter Address"
            value={updateProvider?.address ?? ""}
          />
        </div>
      </div>

      {/* Account Information */}
      {/* <TitleSession icon="codicon:account" title="Account Information" />

      <div className="w-full p-6 flex flex-col gap-6">
        <div className="w-full grid grid-cols-2 gap-x-20 gap-y-4">
          <InputEdit
            titleInput="Username"
            width="w-full"
            name="email"
            onChange={handleChange}
            placeholder="Enter Username"
            value={updateProvider?.email ?? ""}
          />
          <InputEdit
            titleInput="Password"
            width="w-full"
            name="phone"
            onChange={handleChange}
            placeholder="Enter Password"
            value={updateProvider?.phone ?? ""}
          />
        </div>
      </div> */}

      {/* Footer */}
      <div className="w-full flex justify-end p-6 ">
        <MyButton
          event={handleUpdate}
          width="w-28"
          background="bg-primary-100"
          text_color="text-white"
          title="Update"
        />
      </div>
    </div>
  );
};

export default AddProviderInformation;
