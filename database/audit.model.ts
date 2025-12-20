import { Schema, Document, model, models } from 'mongoose';

export interface IAudit extends Document {
  createAt: Date;
}

export const AuditSchema = new Schema<IAudit>({
  createAt: { type: Date, required: true, default: () => new Date() }
},{timestamps:false});


const Audit = models.Audit || model('Audit', AuditSchema);

export default Audit;