"use client";
import TitleSession from "@/components/shared/label/TitleSession";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LabelInformation from "@/components/shared/label/LabelInformation";
import MyButton from "@/components/shared/button/MyButton";
import InputEdit from "@/components/shared/input/InputEdit";
import { Customer, defaultDetail } from "./CustomerList";
import { generateRandomID } from "@/lib/utils";
import { createCustomer } from "@/lib/service/customer.service";

const AddCustomerInformation = () => {
  const [updateCustomer, setUpdateCustomer] = useState<Customer>(defaultDetail);
  const [randomValue, setRandomValue] = useState<string>(generateRandomID(8));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updateCustomer) {
      setUpdateCustomer({
        ...updateCustomer,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleUpdate = async () => {
    if (updateCustomer) {
      console.log(updateCustomer);
      try {
        const data: CreateCustomer = {
          fullName: updateCustomer.fullName,
          phoneNumber: updateCustomer.phoneNumber,
          email: updateCustomer.email,
          address: updateCustomer.address,
        };
        const result = await createCustomer(data);
        if (result) {
          alert("Create customer successfully.");
        } else {
          alert("Can't create customer.");
        }
      } catch (error) {
        console.error("Error create data:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";

        alert(`Error create data: ${errorMessage}`);
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
        <div className="flex w-full">
          {/* <div className="w-1/5">
            <Image
              alt="avatar"
              src={updateCustomer.avatar || "/assets/images/avatar.jpg"}
              width={115}
              height={115}
              className="rounded-full"
            />
          </div> */}
          <div className="flex-1 flex flex-col justify-between">
            <LabelInformation content={randomValue} title="ID" />
            {/* <div className="flex gap-8 ">
              <MyButton
                event={handleUploadFile}
                width="w-40"
                title="Upload photo"
                px="px-4"
                height="h-9"
              />
              <MyButton
                event={handlecreateFile}
                width="w-40"
                title="create photo"
                px="px-4"
                height="h-9"
              />
            </div> */}
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-x-20 gap-y-4">
          <InputEdit
            titleInput="Fullname"
            width="w-full"
            name="fullName"
            onChange={handleChange}
            placeholder={"Enter Fullname"}
          />
          <InputEdit
            titleInput="Phone"
            width="w-full"
            name="phoneNumber"
            onChange={handleChange}
            placeholder="Enter Phone"
          />
          <InputEdit
            titleInput="Email"
            width="w-full"
            name="email"
            onChange={handleChange}
            placeholder="Enter Email"
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
          <InputEdit
            titleInput="Address"
            width="w-full"
            name="address"
            onChange={handleChange}
            placeholder="Enter Address"
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
          />
          <InputEdit
            titleInput="Password"
            width="w-full"
            name="phone"
            onChange={handleChange}
            placeholder="Enter Password"
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

export default AddCustomerInformation;
