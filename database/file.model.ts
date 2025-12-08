import { Schema, Document, model, models } from "mongoose";
import { AuditSchema, IAudit } from "./audit.model";

export interface IFile extends Document, IAudit {
    fileName: string;
    url: string;
    publicId: string;
    bytes: string;
    width: string;
    height: string;
    format: string;
}

const FileSchema = new Schema<IFile>({
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    bytes: { type: String, required: true },
    width: { type: String, required: false },
    height: { type: String, required: false },
    format: { type: String, required: false },
});

FileSchema.add(AuditSchema);

const File = models.File || model("File", FileSchema);

export default File;
