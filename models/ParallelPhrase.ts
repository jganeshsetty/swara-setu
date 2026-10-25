import mongoose, { Schema, Model, Document } from "mongoose";

export interface IRegionVariation {
  script: string;
  phonetic: string;
  grammarNote: string;
}

export interface IParallelPhrase extends Document {
  intentCategory: string;
  englishPrompt: string;
  standardKannada: string;
  standardPhonetic: string;
  variations: {
    old_mysuru?: IRegionVariation;
    uttara_karnataka?: IRegionVariation;
    karavali_kundapura?: IRegionVariation;
    malnad_havyaka?: IRegionVariation;
    kalyana_hosapete?: IRegionVariation;
    [key: string]: IRegionVariation | undefined;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const RegionVariationSchema = new Schema<IRegionVariation>(
  {
    script: { type: String, required: true },
    phonetic: { type: String, default: "" },
    grammarNote: { type: String, default: "" },
  },
  { _id: false }
);

const ParallelPhraseSchema = new Schema<IParallelPhrase>(
  {
    intentCategory: { type: String, required: true, index: true },
    englishPrompt: { type: String, required: true },
    standardKannada: { type: String, required: true },
    standardPhonetic: { type: String, default: "" },
    variations: {
      type: Map,
      of: RegionVariationSchema,
      default: {},
    },
  },
  { timestamps: true }
);

export const ParallelPhrase: Model<IParallelPhrase> =
  mongoose.models.ParallelPhrase ||
  mongoose.model<IParallelPhrase>("ParallelPhrase", ParallelPhraseSchema);

export default ParallelPhrase;