import { NextApiRequest, NextApiResponse } from "next/types";
import { IncomingForm } from "formidable";
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
  if (req.method === "POST") {
    const form = new IncomingForm();
    const { id } = req.query;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing FormData:", err);
        return res.status(400).json({ error: "Failed to parse FormData" });
      }
      const image = files.image
        ? Array.isArray(files.image)
          ? files.image[0]
          : files.image
        : null;
      if (!image || image === null) {
        return res.status(400).json({ message: "Missing image!" });
      }
      const result = await uploadStaffAvatar(id?.toString()!, image);
      return res.status(200).json(result);
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withCustomerOrAbove(handler);