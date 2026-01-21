"use client";
import TitleSession from "@/components/shared/label/TitleSession";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import MyButton from "@/components/shared/button/MyButton";
import InputEdit from "@/components/shared/input/InputEdit";
import InputDate from "@/components/shared/input/InputDate";
import InputSelection from "@/components/shared/input/InputSelection";
import { CreateStaff, FileContent, Staff } from "@/dto/StaffDTO";
import { createAvatar, createStaff } from "@/lib/service/staff.service";

const defaultStaff: CreateStaff = {
  gender: "",
  position: "nonenone",
  salary: "0",
  phoneNumber: "",
  fullName: "",
  birthday: new Date(),
  email: "",
  address: "",
  province: "",
  district: "",
  experience: "",
  kindOfJob: "",
  description: "none",
  enrolledDate: new Date(),
  avatar: "/assets/images/avatar.jpg",
};

const AddStaffInformation = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const [updateStaff, setUpdateStaff] = useState<CreateStaff | null>(
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
    if (updateStaff) {
      setUpdateStaff({
        ...updateStaff,
        [e.target.name]: e.target.value,
      });
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

  const formatDate = (date: Date | string): string => {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) // Check for a valid date
      ? parsedDate.toISOString()
      : ""; // Return empty string if invalid date
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

  const handleUpdate = async () => {
    if (updateStaff) {
      console.log(updateStaff);
      try {
        const data: CreateStaff = {
          fullName: updateStaff.fullName,
          position: updateStaff.position,
          phoneNumber: updateStaff.phoneNumber,
          email: updateStaff.email,
          address: updateStaff.address,
          avatar: updateStaff.avatar, // No need to include avatar here for now
          salary: updateStaff.salary,
          enrolledDate: updateStaff.enrolledDate,
          province: updateStaff.province,
          district: updateStaff.district,
          experience: updateStaff.experience,
          kindOfJob: updateStaff.kindOfJob,
          description: updateStaff.description,
          birthday: updateStaff.birthday,
          gender: updateStaff.gender,
        };

        // Create the staff first
        console.log(data, "data of create staff");
        const result = await createStaff(data);

        if (result) {
          // Only upload avatar if there is an avatar to upload
          if (avatar && avatar.url) {
            try {
              await createAvatar(result._id, avatar); // Pass the staff ID and avatar
              alert("✅ Tạo nhân viên thành công! Đã tải lên ảnh đại diện.");
            } catch (avatarError: any) {
              // Staff đã được tạo nhưng upload avatar thất bại
              alert(
                `✅ Tạo nhân viên thành công!\n⚠️ Không thể tải lên ảnh đại diện: ${avatarError?.message || "Lỗi không xác định"}`
              );
            }
          } else {
            alert("✅ Tạo nhân viên thành công!");
          }
        } else {
          alert("❌ Không thể tạo nhân viên. Vui lòng thử lại.");
        }
      } catch (err: any) {
        console.error("Error creating staff:", err);
        // Hiển thị error message rõ ràng hơn
        const errorMessage =
          err?.message ||
          "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.";
        alert(`❌ Lỗi: ${errorMessage}`);
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
          <div className="flex-1 flex flex-col justify-end">
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
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-x-20 gap-y-4">
          <InputEdit
            titleInput="Fullname"
            width="w-full"
            name="fullName"
            onChange={handleChange}
            placeholder="Enter Fullname"
            value={updateStaff?.fullName ?? ""}
          />
          <InputDate
            titleInput="Date of birth"
            width="w-full"
            value={updateStaff ? formatDate(updateStaff.birthday) : ""}
            onChange={() => {}}
          />
          <InputEdit
            titleInput="Phone"
            width="w-full"
            name="phoneNumber"
            onChange={handleChange}
            placeholder="Enter Phone"
            value={updateStaff?.phoneNumber ?? ""}
          />
          <InputEdit
            titleInput="Email"
            width="w-full"
            name="email"
            onChange={handleChange}
            placeholder="Enter Email"
            value={updateStaff?.email ?? ""}
          />
          <InputSelection
            width="w-full"
            titleInput="Gender"
            options={["Male", "Female", "Orther"]}
            value={updateStaff?.gender ?? "Male"}
            onChange={(value) => {
              setUpdateStaff((prev) => ({
                ...prev!,
                gender: value,
              }));
            }}
          />
          <InputEdit
            titleInput="Experience"
            width="w-full"
            name="experience"
            onChange={handleChange}
            placeholder="Enter Experience"
            value={updateStaff?.experience ?? ""}
          />
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
            titleInput="Province"
            options={["VietNam", "UK", "US", "JP", "C", "K", "Canada"]}
            value={updateStaff?.province ?? "VietNam"}
            onChange={(value) => {
              setUpdateStaff((prev) => ({
                ...prev!,
                province: value,
              }));
            }}
          />
          {/* <InputSelection
            width="w-full"
            titleInput="City"
            options={["TP.HCM", "HN", "DN", "HP", "PT", "VT"]}
            value={updateStaff?.province ?? "TP.HCM"}
            onChange={(value) => {
              setUpdateStaff((prev) => ({
                ...prev!,
                city: value,
              }));
            }}
          /> */}
          <InputSelection
            width="w-full"
            titleInput="District"
            options={["Q1", "Q2", "BT", "Q7", "Q9", "TD"]}
            value={updateStaff?.district ?? "Q1"}
            onChange={(value) => {
              setUpdateStaff((prev) => ({
                ...prev!,
                district: value,
              }));
            }}
          />
          <InputEdit
            titleInput="Address"
            width="w-full"
            name="address"
            onChange={handleChange}
            placeholder="Enter Address"
            value={updateStaff?.address ?? ""}
          />
        </div>
      </div>

      {/* Account Information */}
      <TitleSession icon="codicon:account" title="Account Information" />

      <div className="w-full p-6 flex flex-col gap-6">
        <div className="w-full grid grid-cols-2 gap-x-20 gap-y-4">
          <InputEdit
            titleInput="Username"
            width="w-full"
            name="email"
            onChange={handleChange}
            placeholder="Enter Username"
            value={updateStaff?.email ?? ""}
          />
          <InputEdit
            titleInput="Password"
            width="w-full"
            name="phone"
            onChange={handleChange}
            placeholder="Enter Password"
            value={updateStaff?.phoneNumber ?? ""}
          />
        </div>
      </div>

      {/* Work Detail */}
      <TitleSession
        icon="material-symbols-light:work-outline"
        title="Work Detail"
      />

      <div className="w-full p-6 flex flex-col gap-6">
        <div className="w-full grid grid-cols-2 gap-x-20 gap-y-4">
          <InputSelection
            width="w-full"
            titleInput="Kind of job"
            options={["Fulltime", "Partime"]}
            value={updateStaff?.kindOfJob ?? "Fulltime"}
            onChange={(value) => {
              setUpdateStaff((prev) => ({
                ...prev!,
                kindOfJob: value,
              }));
            }}
          />
          <InputEdit
            titleInput="Description"
            width="w-full"
            name="description"
            onChange={handleChange}
            placeholder="Enter Description"
            value={updateStaff?.description ?? ""}
          />
          <InputEdit
            titleInput="Position"
            width="w-full"
            name="position"
            onChange={handleChange}
            placeholder="Enter Position"
            value={updateStaff?.position ?? ""}
          />
          <InputDate
            titleInput="Date of work"
            width="w-full"
            value={updateStaff ? formatDate(updateStaff.birthday) : ""}
            onChange={() => {}}
          />
          <InputEdit
            titleInput="Salary"
            width="w-full"
            name="earning"
            onChange={handleChange}
            placeholder="Enter Salary"
            value={updateStaff ? updateStaff.salary : ""}
          />
        </div>
      </div>

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

export default AddStaffInformation;
