"use client";
import TitleSession from "@/components/shared/label/TitleSession";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LabelInformation from "@/components/shared/label/LabelInformation";
import MyButton from "@/components/shared/button/MyButton";
import InputEdit from "@/components/shared/input/InputEdit";
import { Customer, defaultDetail } from "./CustomerList";
import {
  getDetailCustomer,
  updateInfoCustomer
} from "@/lib/service/customer.service";

const EditCustomerInformation = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const [detail, setDetail] = useState<Customer>(defaultDetail);
  const [updateCustomer, setUpdateCustomer] = useState<Customer>(defaultDetail);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDetailCustomer(id);
        if (result) {
          const totalCost = result.orders.reduce(
            (total, order) => total + order.cost,
            0
          );
          const data: Customer = {
            id: result._id,
            fullName: result.fullName,
            phoneNumber: result.phoneNumber,
            email: result.email,
            address: result.address,
            avatar: "",
            point: result.point,
            sales: totalCost,
            orders: result.orders.map((order) => ({
              id: order._id,
              createAt: order.createAt,
              createBy: order.staff,
              cost: order.cost
            }))
          };
          setDetail(data);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        const errorMessage = err?.message || "An unexpected error occurred.";
        alert(`Error fetching data: ${errorMessage}`);
      }
    };
    fetchData();
  }, [id]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updateCustomer) {
      setUpdateCustomer({
        ...updateCustomer,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleUpdate = async () => {
    if (updateCustomer) {
      const data: CreateCustomer = {
        fullName: updateCustomer.fullName,
        phoneNumber: updateCustomer.phoneNumber,
        email: updateCustomer.email,
        address: updateCustomer.address
      };

      const result = await updateInfoCustomer(id, data);
      if (result) {
        setDetail((prev) => {
          if (prev) {
            return {
              ...prev,
              ...data
            };
          }
          return prev;
        });
        alert("Update information of customer");
      } else {
        alert("Can't update information of customer");
      }
    } else alert("No information of customer to update");
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
              src={
                detail && detail.avatar
                  ? detail.avatar
                  : "/assets/images/avatar.jpg"
              }
              width={115}
              height={115}
              className="rounded-full"
            />
          </div> */}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <LabelInformation
            content={detail ? `#${detail.id}` : ""}
            title="ID"
          />
          {/* <div className="flex gap-8 ">
            <MyButton
              event={handleUploadFile}
              width="w-40"
              title="Upload photo"
              px="px-4"
              height="h-9"
            />
            <MyButton
              event={handleDeleteFile}
              width="w-40"
              title="Delete photo"
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
          placeholder={detail.fullName ? detail.fullName : "Enter Fullname"}
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
          placeholder={detail.email ? detail.email : "Enter Email"}
        />
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
            placeholder={detail.address ? detail.address : "Enter Address"}
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
            name="username"
            onChange={handleChange}
            placeholder="Enter Username"
          />
          <InputEdit
            titleInput="Password"
            width="w-full"
            name="password"
            onChange={handleChange}
            placeholder="Enter password"
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

export default EditCustomerInformation;
