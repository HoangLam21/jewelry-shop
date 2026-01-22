// import { NextApiRequest, NextApiResponse } from "next/types";
// import { IncomingForm } from "formidable";
// import { uploadStaffAvatar } from "@/lib/actions/user.action";
// import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   auth: ApiAuthResult
// ) {
//   if (req.method === "POST") {
//     const form = new IncomingForm();
//     const { id } = req.query;
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error("Error parsing FormData:", err);
//         return res.status(400).json({ error: "Failed to parse FormData" });
//       }
//       const image = files.image
//         ? Array.isArray(files.image)
//           ? files.image[0]
//           : files.image
//         : null;
//       if (!image || image === null) {
//         return res.status(400).json({ message: "Missing image!" });
//       }
//       const result = await uploadStaffAvatar(id?.toString()!, image);
//       return res.status(200).json(result);
//     });
//   } else {
//     return res.status(405).json({ error: "Method not allowed" });
//   }
// }

// export default withCustomerOrAbove(handler);

import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Files } from "formidable";
import { uploadStaffAvatar } from "@/lib/actions/user.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  // ✅ Validate id trước
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing staff ID" });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, _fields, files: Files) => {
    if (err) {
      console.error("Error parsing FormData:", err);
      return res.status(400).json({ error: "Failed to parse FormData" });
    }

    const image = files.image
      ? Array.isArray(files.image)
        ? files.image[0]
        : files.image
      : undefined;

    if (!image) {
      return res.status(400).json({ error: "Missing image" });
    }

    try {
      const result = await uploadStaffAvatar(id, image);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error uploading staff avatar:", error);

      const message =
        error instanceof Error ? error.message : "Failed to upload avatar";

      return res.status(500).json({ error: message });
    }
  });
}

export default withCustomerOrAbove(handler);
