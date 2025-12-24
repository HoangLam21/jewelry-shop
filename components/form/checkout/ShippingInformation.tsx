import React, { useState } from "react";

const ShippingInfomation = ({
  city,
  setCity,
  setAddress,
  setPhoneNumber,
  setNote,
}: any) => {
  const [district, setDistrict] = useState("");
  const [street, setStreet] = useState("");

  const combineAddress = () => {
    const fullAddress = `${street}, ${district}, ${city}`;
    setAddress(fullAddress);
  };

  return (
    <div>
      <label className="font-light text-[16px]">
        Name<span className="text-primary-100">*</span>
      </label>
      <input
        type="text"
        placeholder="Name"
        className="w-full p-3 border bg-transparent mb-5 "
      />
      {/* <label className="font-light mt-2 text-[16px]">
        Country / Region<span className="text-primary-100">*</span>
      </label>
      <input
        type="text"
        placeholder="Country"
        className="w-full p-3 border bg-transparent dark:bg-dark-400"
      /> */}
      <label className="font-light text-[16px] mt-5">
        City / Province<span className="text-primary-100">*</span>
      </label>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          combineAddress(); // Gọi hàm mỗi khi giá trị thay đổi
        }}
        className="w-full p-3 border bg-transparent mb-5 "
      />
      <label className="font-light mt-2 text-[16px]">
        District<span className="text-primary-100">*</span>
      </label>
      <input
        type="text"
        placeholder="District"
        value={district}
        onChange={(e) => {
          setDistrict(e.target.value);
          combineAddress();
        }}
        className="w-full p-3 border bg-transparent mb-5"
      />
      <label className="font-light mt-2 text-[16px]">
        Street address<span className="text-primary-100">*</span>
      </label>
      <input
        type="text"
        placeholder="Street Address"
        value={street}
        onChange={(e) => {
          setStreet(e.target.value);
          combineAddress();
        }}
        className="w-full p-3 border bg-transparent mb-5"
      />
      <label className="font-light mt-2 text-[16px]">
        Phone<span className="text-primary-100">*</span>
      </label>
      <input
        type="text"
        placeholder="Phone"
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-3 border bg-transparent mb-5"
      />
      {/* <label className="font-light mt-2 text-[16px]">
        Email<span className="text-primary-100">*</span>
      </label>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 border bg-transparent dark:bg-dark-400"
      /> */}
      <label className="font-light mt-2 text-[16px]">
        Note<span className="text-primary-100"></span>
      </label>
      <textarea
        placeholder="Note"
        rows={4}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-3 border bg-transparent mb-5"
      ></textarea>
    </div>
  );
};

export default ShippingInfomation;