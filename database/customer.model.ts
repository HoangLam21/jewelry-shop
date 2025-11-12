import { Document, Schema, model, models } from "mongoose";
import { IUser, UserSchema } from "./user.model";
import { AuditSchema, IAudit } from "./audit.model";

export interface ICustomer extends IUser {
  point: number;
  orders: Schema.Types.ObjectId[];
}

const CustomerSchema = new Schema<ICustomer>({
  point: { type: Number, default: 0 },
  orders: { type: [Schema.Types.ObjectId], ref: "Order", required: false },
});
CustomerSchema.add(UserSchema);
const Customer = models.Customer || model("Customer", CustomerSchema);

export default Customer;
