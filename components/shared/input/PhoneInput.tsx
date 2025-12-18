import React, { useState, useEffect } from "react";
import InputEdit from "./InputEdit";

const PhoneNumberInput = ({ item, setItem }: { item: any; setItem: any }) => {
  const [phoneNumber, setPhoneNumber] = useState(
    item.suplier.phoneNumber || ""
  );
  const [isValid, setIsValid] = useState(true);

  const isValidPhoneNumber = (phoneNumber: string) => {
    // Kiểm tra nếu phoneNumber chỉ chứa số và có độ dài 10
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);

    // Kiểm tra ngay lập tức tính hợp lệ
    if (value === "" || isValidPhoneNumber(value)) {
      setIsValid(true);
      // Cập nhật vào state nếu hợp lệ
      setItem((prevSuplier: any) => ({
        ...prevSuplier,
        suplier: {
          ...prevSuplier.suplier,
          phoneNumber: value,
        },
      }));
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="w-full">
      <InputEdit
        titleInput="Phone number"
        value={phoneNumber}
        onChange={handleChange}
        width="w-full"
        placeholder="Enter phone number..."
      />
      {!isValid && (
        <p className="text-red-500 text-sm mt-1">
          Số điện thoại phải là số và có đúng 10 chữ số.
        </p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
