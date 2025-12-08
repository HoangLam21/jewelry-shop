import { Schema, model, models, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { AuditSchema, IAudit } from "./audit.model";
interface ICartDetail {
  quantity: number;
  selectedMaterial: string;
  selectedSize: string;
}

export interface ICart extends Document, IAudit {
  user: Schema.Types.ObjectId;
  totalCost: number;
  details: Map<ObjectId, ICartDetail>;
}

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  totalCost: { type: Number, required: true },
  details: {
    type: Map,
    of: {
      quantity: { type: Number, required: true },
      selectedMaterial: { type: String, required: true },
      selectedSize: { type: String, required: true },
    },
    required: true,
  },
});

CartSchema.add(AuditSchema);

const Cart = models.Cart || model("Cart", CartSchema);

export default Cart;
