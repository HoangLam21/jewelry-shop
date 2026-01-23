import { Schema, model, models, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { AuditSchema, IAudit } from "./audit.model";

export interface IOrder extends Document, IAudit {
    cost: number;
    discount: number;
    details: [
        {
            id: Schema.Types.ObjectId;
            material: string;
            size: string;
            unitPrice: number;
            quantity: number;
            discount: string;
        }
    ];
    status: string;
    shippingMethod: string;
    ETD: Date;
    customer?: Schema.Types.ObjectId;
    phoneNumber?:Schema.Types.ObjectId;
    note?:string;
    address?:string;
    staff?: Schema.Types.ObjectId;
}

const OrderSchema = new Schema<IOrder>({
    cost: { type: Number, required: true },
    discount: { type: Number, required: true },
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
    status: { type: String, required: true },
    shippingMethod: { type: String, required: true },
    ETD: { type: Date, required: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    phoneNumber:{type:String},
    note:{type:String},
    address:{type:String},
    staff: { type: Schema.Types.ObjectId, required: false, ref: "Staff", default: null },
}, {
    // Force schema update to clear cache
    strict: true,
    strictQuery: false
});

OrderSchema.add(AuditSchema);

// Delete existing model to force recreation with new schema
if (models.Order) {
    delete models.Order;
}

const Order = model<IOrder>("Order", OrderSchema);
// added new value for order
export default Order;
