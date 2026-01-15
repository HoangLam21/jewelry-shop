import { NextApiRequest, NextApiResponse } from "next/types";
import formidable from "formidable";
import { updateProduct } from "@/lib/actions/product.action";
import { IncomingForm } from "formidable";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

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
  if (req.method === "PUT") {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing product ID" });
    }

    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing FormData:", err);
        return res.status(400).json({ error: "Failed to parse FormData" });
      }

      const {
        name,
        cost,
        description,
        vouchers,
        provider,
        category,
        collections,
        variants,
      } = fields;

      const images = files.images
        ? Array.isArray(files.images)
          ? files.images
          : [files.images]
        : [];
      console.log("parsedimge: ", images);

      if (!name || !cost || !description || !collections) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      try {
        const parsedVouchers = Array.isArray(vouchers)
          ? vouchers
          : vouchers
          ? [vouchers]
          : [];

        let parsedVariants: {
          material: string;
          sizes: { size: string; stock: number }[];
          addOn: number;
        }[] = [];

        if (variants) {
          parsedVariants = JSON.parse(variants[0]);
          if (!Array.isArray(parsedVariants)) {
            throw new Error("Variants is not an array");
          }
        }
        console.log("variants: ", variants);
        console.log("parseVariant: ", parsedVariants);

        const productData = {
          name: typeof name === "string" ? name : name[0],
          cost: parseFloat(Array.isArray(cost) ? cost[0] : (cost as string)),
          images: images as formidable.File[],
          description: Array.isArray(description)
            ? description[0]
            : (description as string),
          vouchers: parsedVouchers.map((voucher) => String(voucher)),
          provider: provider
          ? String(Array.isArray(provider) ? provider[0] : (provider as string))
          : undefined,
          category: category
            ? String(
                Array.isArray(category) ? category[0] : (category as string)
              )
            : undefined,
          collections:
            typeof collections === "string" ? collections : collections[0],
          variants: parsedVariants,
        };

        const updatedProduct = await updateProduct(id, productData);
        return res.status(201).json(updatedProduct);
      } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ error: "Failed to update product" });
      }
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withStaffOrAdmin(handler);