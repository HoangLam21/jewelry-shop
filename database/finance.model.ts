import { Schema, Document, model, models } from "mongoose";
import { AuditSchema, IAudit } from "./audit.model";

export interface IFinance extends Document, IAudit {
    type: string;
    date: Date;
    value: Number;
}

const FinanceSchema = new Schema<IFinance>({
    type: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    value: { type: Number, default: 0 },
});

FinanceSchema.add(AuditSchema);

const Finance = models.Finance || model("Finance", FinanceSchema);

export default Finance;
