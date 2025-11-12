import { Schema, Document, model, models } from "mongoose";
import { AuditSchema, IAudit } from "./audit.model";

export interface IProductProvider extends Document, IAudit {
    name: string;
    address: string;
    contact: string;
    representativeName: string;
    city: string;
    country: string;
}

const ProductProviderSchema = new Schema<IProductProvider>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    representativeName: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
});

ProductProviderSchema.add(AuditSchema);

const ProductProvider =
    models.ProductProvider || model("ProductProvider", ProductProviderSchema);

export default ProductProvider;
