import mongoose, { Schema, Document } from 'mongoose';

// Interface for the DamageReport document
interface IDamageReport extends Document {
    itemName: string;
    quantity: number;
    damageType: string;
    actionRequired: string;
    supplierName?: string;
    description: string;
    date: string;
    reportedBy: string;
}

// Define the schema
const DamageReportSchema: Schema = new Schema<IDamageReport>({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    damageType: { type: String, required: true },
    actionRequired: { type: String, required: true },
    supplierName: { type: String, required: false },
    description: { type: String, required: true },
    date: { type: String, required: true },
    reportedBy: { type: String, required: true },
});

// Create and export the model
const DamageReport = mongoose.model<IDamageReport>('DamageReport', DamageReportSchema);
export default DamageReport;