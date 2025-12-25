"use client";
import AddStaffInformation from "@/components/admin/staff/AddStaffInformation";
import Headers from "@/components/shared/header/Headers";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };

  const handleAddStaff = () => {
    router.push(`/admin/staff/add`);
  };
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Add Staff"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Staff"
        onClickFirstButton={handleCancel}
        onClickSecondButton={handleAddStaff}
        type={2}
      ></Headers>
      <AddStaffInformation />
    </div>
  );
};

export default Page;
