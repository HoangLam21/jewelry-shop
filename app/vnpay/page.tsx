"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Thêm useRouter cho chức năng quay lại
import { updatedStatusOrder } from "@/lib/service/order.service";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter(); // Dùng useRouter để điều hướng trang
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleResult = async () => {
      const vnp_ResponseCode = searchParams?.get("vnp_ResponseCode");
      const vnp_OrderInfo = searchParams?.get("vnp_OrderInfo");

      if (vnp_ResponseCode) {
        if (vnp_ResponseCode === "00") {
          setPaymentStatus("Payment success!");
          setOrderInfo(vnp_OrderInfo!);
          await updatedStatusOrder(vnp_OrderInfo?.split(" ").pop()!, "paid");
        } else {
          setPaymentStatus("Payment unsucess!");
          setErrorMessage(`Error code: ${vnp_ResponseCode}`);
        }
      }
    };
    handleResult();
  }, [searchParams]);

  return (
    <div className="mx-auto p-6 font-sans text-center background-light700_dark400 w-screen h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white ">
        Payment result
      </h1>
      <div className="result">
        {paymentStatus && (
          <div
            className={`p-6 rounded-lg mb-4 ${
              paymentStatus.includes("Payment success!")
                ? " text-green-600"
                : " text-red-600"
            }`}
          >
            <p className="text-lg">{paymentStatus}</p>
            {orderInfo && <p className="mt-2">Order Message: {orderInfo}</p>}
            {errorMessage && <p className="mt-2">Error: {errorMessage}</p>}
          </div>
        )}
      </div>

      {/* Nút quay lại trang chủ */}
      <div className="mt-6">
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Page;
