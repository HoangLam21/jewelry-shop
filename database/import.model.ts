import { Schema, model, models, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { AuditSchema, IAudit } from "./audit.model";
export interface Import extends Document, IAudit {
  staff: ObjectId;
  totalCost: number;
  details: [
    {
      id: Schema.Types.ObjectId; // This will be the product id
      material: string; // material of that product
      size: string; // size of the product
      unitPrice: number; // price per unit
      quantity: number; // quantity that we import for this size-material of product
      discount: string; // percentage but in string. example: "60" => discount 60% => apply this to totalCost
    }
  ];
  status: boolean;
  provider: ObjectId;
}

const ImportSchema = new Schema<Import>({
  staff: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
  provider: {
    type: Schema.Types.ObjectId,
    ref: "ProductProvider",
    required: true,
  },
  totalCost: { type: Number, required: true },
  details: {
    type: [
      {
        id: { type: Schema.Types.ObjectId },
        material: { type: String },
        size: { type: String },
        quantity: { type: Number },
        discount: { type: Number },
      },
    ],
    required: true,
  },
  status: { type: Boolean, default: false },
});

ImportSchema.add(AuditSchema);

const Import = models.Import || model("Import", ImportSchema);

export default Import;

/*
- lấy tất cả import của 1 provider theo provider ID
- làm lại các function theo provider schema mới
- custom json trả về theo interface nó gửi
interface Import {
  id: string;
  suplier: {
    id: string;
    phoneNumber: string;
    fullname: string;
    address: string;
  };
  invoice: {
    id: string;
    productName: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    discount: number;
  }[];
  status: boolean;
  createAt: Date;
  createBy: string;
}
*/
