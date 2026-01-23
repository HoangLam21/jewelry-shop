"use client";

import React, { useEffect, useMemo, useState } from "react";
import provincesData from "@/data/provinces.json";

/* ================= TYPES ================= */

type Ward = {
  code: number;
  name: string;
};

type District = {
  code: number;
  name: string;
  wards: Ward[];
};

type Province = {
  code: number;
  name: string;
  districts: District[];
};

type Props = {
  setAddress: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setNote: (value: string) => void;
};

/* ================= COMPONENT ================= */

const ShippingInfomation = ({ setAddress, setPhoneNumber, setNote }: Props) => {
  /* ===== DATA ===== */
  const provinces = provincesData as Province[];

  /* ===== STATE ===== */
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [districtCode, setDistrictCode] = useState<number | null>(null);
  const [wardCode, setWardCode] = useState<number | null>(null);
  const [street, setStreet] = useState("");

  /* ===== DERIVED DATA ===== */
  const selectedProvince = useMemo(
    () => provinces.find((p) => p.code === provinceCode),
    [provinceCode, provinces]
  );

  const districts = selectedProvince?.districts || [];

  const selectedDistrict = useMemo(
    () => districts.find((d) => d.code === districtCode),
    [districtCode, districts]
  );

  const wards = selectedDistrict?.wards || [];

  const selectedWard = wards.find((w) => w.code === wardCode);

  /* ===== COMBINE ADDRESS ===== */
  useEffect(() => {
    if (street && selectedProvince && selectedDistrict && selectedWard) {
      const fullAddress = `${street}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
      setAddress(fullAddress);
    }
  }, [street, selectedProvince, selectedDistrict, selectedWard, setAddress]);

  /* ================= RENDER ================= */

  return (
    <div>
      {/* Name */}
      <label className="font-light text-[16px]">
        Name<span className="text-primary-100">*</span>
      </label>
      <input
        type="text"
        placeholder="Full name"
        className="w-full p-3 border bg-transparent mb-5"
      />

      {/* Province */}
      <label className="font-light text-[16px]">
        City / Province<span className="text-primary-100">*</span>
      </label>
      <select
        className="w-full p-3 border bg-transparent mb-5"
        value={provinceCode ?? ""}
        onChange={(e) => {
          setProvinceCode(Number(e.target.value));
          setDistrictCode(null);
          setWardCode(null);
        }}
      >
        <option value="" disabled>
          Select Province
        </option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>

      {/* District */}
      <label className="font-light text-[16px]">
        District<span className="text-primary-100">*</span>
      </label>
      <select
        className="w-full p-3 border bg-transparent mb-5"
        value={districtCode ?? ""}
        onChange={(e) => {
          setDistrictCode(Number(e.target.value));
          setWardCode(null);
        }}
        disabled={!districts.length}
      >
        <option value="" disabled>
          Select District
        </option>
        {districts.map((d) => (
          <option key={d.code} value={d.code}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Ward */}
      <label className="font-light text-[16px]">
        Ward<span className="text-primary-100">*</span>
      </label>
      <select
        className="w-full p-3 border bg-transparent mb-5"
        value={wardCode ?? ""}
        onChange={(e) => setWardCode(Number(e.target.value))}
        disabled={!wards.length}
      >
        <option value="" disabled>
          Select Ward
        </option>
        {wards.map((w) => (
          <option key={w.code} value={w.code}>
            {w.name}
          </option>
        ))}
      </select>

      {/* Street */}
      <label className="font-light text-[16px]">
        Street address<span className="text-primary-100">*</span>
      </label>
      <input
        type="text"
        placeholder="Street address"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        className="w-full p-3 border bg-transparent mb-5"
      />

      {/* Phone */}
      <label className="font-light text-[16px]">
        Phone<span className="text-primary-100">*</span>
      </label>
      <input
        type="text"
        placeholder="Phone number"
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-3 border bg-transparent mb-5"
      />

      {/* Note */}
      <label className="font-light text-[16px]">Note</label>
      <textarea
        placeholder="Note"
        rows={4}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-3 border bg-transparent mb-5"
      />
    </div>
  );
};

export default ShippingInfomation;
