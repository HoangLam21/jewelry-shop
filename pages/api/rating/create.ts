// import { NextApiRequest, NextApiResponse } from "next";
// import { createRating } from "@/lib/actions/rating.action";
// import { IncomingForm } from "formidable";
// import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";
// import type { Fields, Files } from "formidable";
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const parseFormData = async (req: NextApiRequest) => {
//   return new Promise((resolve, reject) => {
//     const form = new IncomingForm();
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve({ fields, files });
//       }
//     });
//   });
// };

// async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   auth: ApiAuthResult
// ) {
//   if (req.method === "POST") {
//     try {
//       const { fields, files }: any = await parseFormData(req);

//       const { userId, productId, point, content } = fields;
//       const images = files?.images
//         ? Array.isArray(files.images)
//           ? files.images
//           : [files.images]
//         : [];

//       // Validate required fields
//       if (!userId || !productId || !point || !content) {
//         return res.status(400).json({ error: "Missing required fields" });
//       }

//       // Create the rating
//       const newRating = await createRating({
//         userId,
//         productId,
//         point: Number(point),
//         content:typeof content ==="string"? content:content[0],
//         images,
//       });

//       return res.status(201).json(newRating);
//     } catch (error) {
//       console.error("Error creating rating: ", error);
//       return res.status(500).json({ error: "Failed to create rating" });
//     }
//   } else {
//     return res.status(405).json({ error: "Method not allowed" });
//   }
// }

// export default withCustomerOrAbove(handler);

import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import { createRating } from "@/lib/actions/rating.action";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

/* =======================
   Types
======================= */

type ParsedFormData = {
  fields: Fields;
  files: Files;
};

/* =======================
   Helpers
======================= */

const parseFormData = async (req: NextApiRequest): Promise<ParsedFormData> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

const getFieldValue = (value?: string | string[]): string | undefined => {
  return Array.isArray(value) ? value[0] : value;
};

/* =======================
   Handler
======================= */

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseFormData(req);

    const userId = getFieldValue(fields.userId);
    const productId = getFieldValue(fields.productId);
    const point = getFieldValue(fields.point);
    const content = getFieldValue(fields.content);

    console.log("[Rating Create API] Received fields:", { userId, productId, point, content: content?.substring(0, 50) });

    // Validate required fields
    if (!userId || !productId || !point || !content) {
      console.error("[Rating Create API] Missing required fields:", { userId: !!userId, productId: !!productId, point: !!point, content: !!content });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate productId is not "undefined" string
    if (productId === "undefined" || productId.trim() === "") {
      console.error("[Rating Create API] Invalid productId:", productId);
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const images = files.images
      ? Array.isArray(files.images)
        ? files.images
        : [files.images]
      : [];

    const newRating = await createRating({
      userId,
      productId,
      point: Number(point),
      content,
      images,
    });

    return res.status(201).json(newRating);
  } catch (error) {
    console.error("Error creating rating:", error);

    const message =
      error instanceof Error ? error.message : "Failed to create rating";

    return res.status(500).json({ error: message });
  }
}

export default withCustomerOrAbove(handler);
