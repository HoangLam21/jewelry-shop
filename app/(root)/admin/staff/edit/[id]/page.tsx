"use client";
import EditStaffInformation from "@/components/admin/staff/EditStaffInformation";
import StaffInformation from "@/components/admin/staff/StaffInformation";
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
        title="Edit Staff"
        firstIcon="iconoir:cancel"
        titleFirstButton="Cancel"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Staff"
        onClickFirstButton={handleCancel}
        onClickSecondButton={handleAddStaff}
        type={2}
      ></Headers>
      <EditStaffInformation />
    </div>
  );
};

export default Page;
