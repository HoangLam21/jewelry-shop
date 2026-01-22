"use client";
import StaffList from "@/components/admin/staff/StaffList";
import VoucherList from "@/components/admin/voucher/VoucherList";
import MyButton from "@/components/shared/button/MyButton";
import Headers from "@/components/shared/header/Headers";
import InputDate from "@/components/shared/input/InputDate";
import InputEdit from "@/components/shared/input/InputEdit";
import Modal from "@/components/shared/overlay/Modal";
import { CreateVoucher, Voucher } from "@/dto/VoucherDTO";
import { createVoucher, fetchVoucher } from "@/lib/service/voucher.service";
import { useRouter } from "next/navigation";
import router from "next/router";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const defaultVoucher: Voucher = {
  _id: "",
  name: "",
  discount: 0,
  expDate: new Date(),
};

const Page = () => {
  const [isAddVoucher, setIsAddVoucher] = useState(false);
  const [newVoucher, setNewVoucher] = useState<Voucher | null>(defaultVoucher);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voucher, setVoucher] = useState<Voucher[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadVoucher = async () => {
      try {
        const data = await fetchVoucher();
        if (isMounted) {
          setVoucher(data || []);
        }
      } catch (error) {
        console.error("Error loading voucher:", error);
        if (isMounted) {
          setVoucher([]);
        }
      }
    };
    loadVoucher();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    if (!voucher || voucher.length === 0) {
      alert("No vouchers available to export.");
      return;
    }

    // Prepare data for export (map the vouchers to a plain object)
    const voucherData =
      voucher?.map((v) => ({
        Name: v.name,
        Discount: v.discount,
        ExpiryDate: formatDate(v.expDate), // Format the date
      })) || [];

    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(voucherData); // Convert JSON to sheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Vouchers"); // Append the sheet to the workbook

    // Write the file to a Blob and trigger the download
    XLSX.writeFile(wb, "voucher_list.xlsx");
  };

  const handleAddVoucher = () => {
    setIsAddVoucher(true);
  };

  const handleClose = () => {
    setIsAddVoucher(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newVoucher) {
      setNewVoucher({
        ...newVoucher,
        [e.target.name]: e.target.value,
      });
    }
  };

  const formatDate = (date: Date | string): string => {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) // Check for a valid date
      ? parsedDate.toISOString()
      : ""; // Return empty string if invalid date
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication is required");
      setLoading(false);
      return;
    }

    try {
      const voucherPayload: CreateVoucher = {
        name: newVoucher?.name || "",
        discount: newVoucher?.discount || 0,
        expDate: newVoucher?.expDate || new Date(),
      };

      const newVoucherData = await createVoucher(voucherPayload);

      setVoucher((prevVouchers) =>
        prevVouchers ? [...prevVouchers, newVoucherData] : [newVoucherData]
      );

      alert("Repost voucher successfully!");
      handleClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating voucher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <Headers
        title="Voucher"
        firstIcon="clarity:export-line"
        titleFirstButton="Export"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Voucher"
        onClickFirstButton={handleExport}
        onClickSecondButton={handleAddVoucher}
        type={2}
      ></Headers>
      <VoucherList voucherList={voucher} setVoucherList={setVoucher} />
      <Modal isOpen={isAddVoucher} onClose={handleClose} title="Add Voucher">
        <div className="w-full flex flex-col gap-4">
          <InputEdit
            titleInput="Voucher name"
            width="w-full"
            placeholder="Voucher name..."
            value={newVoucher?.name || ""}
            name="name"
            onChange={handleChange}
          />
          <InputEdit
            titleInput="Voucher discount"
            width="w-full"
            placeholder="Voucher discount..."
            value={newVoucher?.discount.toString() || ""}
            name="discount"
            onChange={handleChange}
          />
          <InputDate
            titleInput="Expire date"
            width="w-full"
            value={newVoucher ? formatDate(newVoucher.expDate) : ""}
            onChange={() => {}}
          />
        </div>
        <div className="w-full flex items-end justify-end pt-6">
          <MyButton
            onClick={handleSave}
            width="w-24"
            title="Add"
            px="px-4 "
            height="h-9"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Page;
