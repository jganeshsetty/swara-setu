import mongoose, { Schema, Model, Document } from "mongoose";

export interface IRegion extends Document {
  regionId: string;
  name: string;
  nameKannada?: string;
  districts: string[];
  colorClass: string;
  badgeBg?: string;
  highlightHex?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RegionSchema = new Schema<IRegion>(
  {
    regionId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    nameKannada: { type: String, default: "" },
    districts: { type: [String], default: [] },
    colorClass: { type: String, required: true, default: "text-amber-800" },
    badgeBg: { type: String, default: "bg-amber-100 text-amber-950 border-amber-300" },
    highlightHex: { type: String, default: "#FFE500" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Region: Model<IRegion> =
  mongoose.models.Region || mongoose.model<IRegion>("Region", RegionSchema);

export default Region;