import { NextApiRequest, NextApiResponse } from "next";
import { createRating } from "@/lib/actions/rating.action";
import { IncomingForm } from "formidable";
import { withCustomerOrAbove, ApiAuthResult } from "@/lib/utils/api-auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseFormData = async (req: NextApiRequest) => {
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

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
) {
  if (req.method === "POST") {
    try {
      const { fields, files }: any = await parseFormData(req);

      const { userId, productId, point, content } = fields;
      const images = files?.images
        ? Array.isArray(files.images)
          ? files.images
          : [files.images]
        : [];

      // Validate required fields
      if (!userId || !productId || !point || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create the rating
      const newRating = await createRating({
        userId,
        productId,
        point: Number(point),
        content:typeof content ==="string"? content:content[0],
        images,
      });

      return res.status(201).json(newRating);
    } catch (error) {
      console.error("Error creating rating: ", error);
      return res.status(500).json({ error: "Failed to create rating" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withCustomerOrAbove(handler);
