"use client";
import StaffList from "@/components/admin/staff/StaffList";
import Headers from "@/components/shared/header/Headers";
import { Staff } from "@/dto/StaffDTO";
import { fetchStaff } from "@/lib/service/staff.service";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import router from "next/router";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const Page = () => {
  const router = useRouter();
  const [staffs, setStaffs] = useState<Staff[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadStaff = async () => {
      try {
        const data = await fetchStaff();
        if (isMounted) {
          setStaffs(data || []);
        }
      } catch (error) {
        console.error("Error loading staff:", error);
        if (isMounted) {
          setStaffs([]);
        }
      }
    };
    loadStaff();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    if (!staffs || staffs.length === 0) {
      alert("No vouchers available to export.");
      return;
    }

    // Prepare data for export (map the vouchers to a plain object)
    const staffData = staffs.map((staff) => ({
      ID: staff._id,
      FullName: staff.fullName,
      Position: staff.position,
      PhoneNumber: staff.phoneNumber,
      Email: staff.email,
      Address: staff.address,
      Avatar: staff.avatar,
      Salary: staff.salary,
      EnrolledDate: formatDate(staff.enrolledDate), // Format the date
      CreatedAt: formatDate(staff.createdAt), // Format the date
    }));
    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(staffData); // Convert JSON to sheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Staff"); // Append the sheet to the workbook

    // Write the file to a Blob and trigger the download
    XLSX.writeFile(wb, "staff_list.xlsx");
  };

  const handleAddStaff = () => {
    router.push(`/admin/staff/add`);
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Staff"
        firstIcon="clarity:export-line"
        titleFirstButton="Export"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Staff"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddStaff}
        type={2}
      ></Headers>
      <StaffList staffs={staffs} setStaffs={setStaffs} />
    </div>
  );
};

export default Page;
