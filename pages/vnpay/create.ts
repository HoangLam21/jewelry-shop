import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import crypto from "crypto";
import { _returnUrl, _secretKey, _tmnCode, _vnpUrl } from "@/vnpay.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Kiểm tra nếu phương thức không phải là POST
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, message: "Method Not Allowed" });
    }

    process.env.TZ = "Asia/Ho_Chi_Minh";

    const { orderId, amount } = req.body;

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const expireDate = moment(date).add(15, "minutes").format("YYYYMMDDHHmmss");

    // Địa chỉ IP của người dùng (có thể lấy từ headers nếu cần)
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "1.55.200.158";

    // Các tham số khác
    const tmnCode = _tmnCode;
    const secretKey = _secretKey;
    const vnpUrl = _vnpUrl;
    const returnUrl = _returnUrl;

    const locale = "vn";
    const currCode = "VND";

    // Tạo các tham số cho VNPay
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Payment for ${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100, // VNPay yêu cầu số tiền tính bằng đơn vị "đồng"
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: "172.0.0.1",
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    // Sắp xếp lại các tham số theo thứ tự alphabet
    const sortedParams = sortParams(vnp_Params);

    // Chuyển các tham số thành query string
    const urlParams = new URLSearchParams();
    for (let [key, value] of Object.entries(sortedParams)) {
      urlParams.append(key, (value as string | number).toString());
    }

    // Tạo chữ ký HMAC
    const querystring = urlParams.toString();
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(querystring).digest("hex");

    // Thêm chữ ký vào tham số
    urlParams.append("vnp_SecureHash", signed);

    // Tạo URL thanh toán VNPay
    const paymentUrl = `${vnpUrl}?${urlParams.toString()}`;
    // Chuyển hướng người dùng đến URL thanh toán
    res.status(200).json({url:paymentUrl});
  } catch (error) {
    console.error("Error creating payment URL:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Hàm sắp xếp tham số theo thứ tự
function sortParams(
  obj: Record<string, string | number>
): Record<string, string | number> {
  const sortedObj = Object.entries(obj)
    .filter(
      ([key, value]) => value !== "" && value !== undefined && value !== null
    )
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string | number>); // Explicitly typing the accumulator

  return sortedObj;
}
