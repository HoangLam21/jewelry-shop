import { Schema, model, models, Document } from "mongoose";
import { AuditSchema, IAudit } from "./audit.model";

export interface IProduct extends Document, IAudit {
  name: string;
  slug: string; // Thêm slug field
  cost: number;
  files: Schema.Types.ObjectId[];
  description: string;
  vouchers: Schema.Types.ObjectId[];
  provider: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  collections: string;
  variants: {
    material: string;
    sizes: { size: string; stock: number }[];
    addOn: number;
  }[];
  sales: number;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // Thêm slug
  cost: { type: Number, required: true },
  files: { type: [Schema.Types.ObjectId], ref: "File", required: true },
  description: { type: String, required: true },
  vouchers: {
    type: [Schema.Types.ObjectId],
    ref: "Voucher",
    required: false,
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: "ProductProvider",
    required: false,
  },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: false },
  collections: { type: String },
  variants: {
    type: [
      {
        material: { type: String },
        sizes: {
          type: [{ size: { type: String }, stock: { type: Number } }],
        },
        addOn: Number,
      },
    ],
  },
  sales: { type: Number, default: 0 },
});

ProductSchema.add(AuditSchema);

const Product = models.Product || model("Product", ProductSchema);

export default Product;