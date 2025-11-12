import { Schema, model, models, Document } from "mongoose";
import { AuditSchema, IAudit } from "./audit.model";

export interface IReport extends Document, IAudit {
    staff: Schema.Types.ObjectId;
    finances: Schema.Types.ObjectId[];
    revenue: number;
}

const ReportSchema = new Schema<IReport>({
    staff: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    finances: { type: [Schema.Types.ObjectId], ref: "Finance", required: true },
    revenue: { type: Number, required: true },
});

ReportSchema.add(AuditSchema);

const Report = models.Report || model("Report", ReportSchema);

export default Report;
