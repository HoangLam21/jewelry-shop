import { Document, Schema, model, models } from "mongoose";
import { IUser, UserSchema } from "./user.model";

export interface IStaff extends IUser, Document {
  province: string;
  district: string;
  enrolledDate: Date;
  salary: string;
  position: string;
  experience: string;
  kindOfJob: string;
  description: string;
}

const StaffSchema = new Schema<IStaff>({
  province: { type: String, required: true },
  district: { type: String, required: true },
  enrolledDate: { type: Date, required: true },
  salary: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  kindOfJob: { type: String, required: true },
  description: { type: String, required: true },
});

StaffSchema.add(UserSchema);

const Staff = models.Staff || model("Staff", StaffSchema);

export default Staff;
