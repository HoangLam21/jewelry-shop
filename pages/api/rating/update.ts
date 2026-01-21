// import { NextApiRequest, NextApiResponse } from "next";
// import { createRating, updateRating } from "@/lib/actions/rating.action";
// import { IncomingForm } from "formidable";
// import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

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
//     const { id } = req.query;
//     if (!id || typeof id !== "string") {
//       return res.status(400).json({ error: "Invalid or missing product ID" });
//     }
//     try {
//       const { fields, files }: any = await parseFormData(req);

//       const { point, content } = fields;
//       const images = files?.images
//         ? Array.isArray(files.images)
//           ? files.images
//           : [files.images]
//         : [];

//       // Validate required fields
//       if (!point || !content) {
//         return res.status(400).json({ error: "Missing required fields" });
//       }

//       // Create the rating
//       const newRating = await updateRating(id, {
//         point: Number(point),
//         content: typeof content === "string" ? content : content[0],
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
import { updateRating } from "@/lib/actions/rating.action";
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

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing rating ID" });
  }

  try {
    const { fields, files } = await parseFormData(req);

    const point = getFieldValue(fields.point);
    const content = getFieldValue(fields.content);

    if (!point || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const images = files.images
      ? Array.isArray(files.images)
        ? files.images
        : [files.images]
      : [];

    const updatedRating = await updateRating(id, {
      point: Number(point),
      content,
      images,
    });

    return res.status(200).json(updatedRating);
  } catch (error) {
    console.error("Error updating rating:", error);

    const message =
      error instanceof Error ? error.message : "Failed to update rating";

    return res.status(500).json({ error: message });
  }
}

export default withCustomerOrAbove(handler);
