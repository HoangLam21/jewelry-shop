import { Schema, model, models, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { AuditSchema, IAudit } from "./audit.model";

export interface IUser extends Document, IAudit {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  avatar: string;
  birthday: string;
  gender: string;
  clerkId: string;
}

export const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  avatar: { type: String, default: "" },
  birthday: { type: String },
  gender: { type: String },
  clerkId: { type: String, required: false }
});

UserSchema.add(AuditSchema);

const User = models.User || model("User", UserSchema);

export default User;
