"use client";
import TitleSession from "@/components/shared/label/TitleSession";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LabelInformation from "@/components/shared/label/LabelInformation";
import MyButton from "@/components/shared/button/MyButton";
import InputEdit from "@/components/shared/input/InputEdit";
import { generateRandomID } from "@/lib/utils";
import { createCustomer } from "@/lib/service/customer.service";
const defaultDetail: CreateCustomer = {
  fullName: "",
  phoneNumber: "",
  email: "",
  address: "",
};
const AddCustomerInformation = () => {
  const [updateCustomer, setUpdateCustomer] =
    useState<CreateCustomer>(defaultDetail);
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
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
      {/* ===== GENERAL INFORMATION ===== */}
      <div className="p-6 border-b border-gray-100">
        <TitleSession
          icon="flowbite:profile-card-outline"
          title="General Information"
        />

        <div className="mt-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <LabelInformation content={randomValue} title="Customer ID" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            <InputEdit
              titleInput="Full name"
              width="w-full"
              name="fullName"
              onChange={handleChange}
              placeholder="Enter customer's full name"
            />

            <InputEdit
              titleInput="Phone number"
              width="w-full"
              name="phoneNumber"
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <InputEdit
              titleInput="Email"
              width="w-full"
              name="email"
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>

      {/* ===== ADDRESS INFORMATION ===== */}
      <div className="p-6 border-b border-gray-100">
        <TitleSession
          icon="mdi:address-marker-outline"
          title="Address Information"
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <InputEdit
            titleInput="Address"
            width="w-full"
            name="address"
            onChange={handleChange}
            placeholder="Enter full address"
          />
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="p-6 flex justify-end gap-4 bg-gray-50 rounded-b-xl">
        <MyButton
          event={handleUpdate}
          width="w-32"
          height="h-10"
          background="bg-primary-100 hover:bg-primary-200 transition-all"
          text_color="text-white"
          title="Update"
        />
      </div>
    </div>
  );
};

export default AddCustomerInformation;
