import mongoose, { Schema, Model, Document } from "mongoose";

export interface IDialectEntry extends Document {
  regionSlug: string;
  district: string;
  category: "word" | "phrase" | "idiom" | "cultural";
  regionalKannada: string;
  regionalPhonetic: string;
  standardKannada: string;
  standardPhonetic: string;
  englishMeaning: string;
  culturalContext: string;
  audioPitchProfile: string;
  upvotes: number;
  verified: boolean;
  contributorName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DialectEntrySchema = new Schema<IDialectEntry>(
  {
    regionSlug: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ["word", "phrase", "idiom", "cultural"],
      required: true,
      index: true,
    },
    regionalKannada: { type: String, required: true },
    regionalPhonetic: { type: String, default: "" },
    standardKannada: { type: String, required: true },
    standardPhonetic: { type: String, default: "" },
    englishMeaning: { type: String, required: true },
    culturalContext: { type: String, default: "" },
    audioPitchProfile: { type: String, default: "" },
    upvotes: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    contributorName: { type: String, default: "" },
  },
  { timestamps: true }
);

DialectEntrySchema.index({ regionSlug: 1, category: 1 });
DialectEntrySchema.index({ verified: 1, upvotes: -1 });

export const DialectEntry: Model<IDialectEntry> =
  mongoose.models.DialectEntry ||
  mongoose.model<IDialectEntry>("DialectEntry", DialectEntrySchema);

export default DialectEntry;