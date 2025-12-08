import { Schema, model, models, Document } from "mongoose";
import { AuditSchema, IAudit } from "./audit.model";

export interface ISchedule extends Document, IAudit {
  staff: Schema.Types.ObjectId;
  shift: number;
  date: Schema.Types.ObjectId;
}

const ScheduleSchema = new Schema<ISchedule>({
  staff: { type: Schema.Types.ObjectId, required: true },
  shift: { type: Number, required: true },
  date: { type: Date, required: true },
});
ScheduleSchema.add(AuditSchema);

const Schedule = models.Schedule || model("Schedule", ScheduleSchema);

export default Schedule;
