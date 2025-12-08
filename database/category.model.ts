import { Schema, models, model, Document } from "mongoose";
import { AuditSchema, IAudit } from "./audit.model";
import Product from "./product.model";

export interface ICategory extends Document, IAudit {
  name: string;
  hot: boolean;
  products: Schema.Types.ObjectId[];
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  hot: { type: Boolean, required: true, default: false },
  products: { type: [Schema.Types.ObjectId], required: false, ref: "Product" }
});

CategorySchema.add(AuditSchema);

const Category = models.Category || model("Category", CategorySchema);

export default Category;
