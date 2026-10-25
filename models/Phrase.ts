import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPhrase extends Document {
  regionId: string;
  districts: string[]; // specific districts in the cluster
  recordId?: string; // e.g. KN01-001
  textbook: string; // standard textbook Kannada
  regional: string; // regional spoken slang / dialect
  meaning: string; // English meaning
  topic?: string; // e.g. greeting, daily_life
  sentenceLengthClass?: string; // short, medium, long
  candidateFeature?: string; // phonetic or linguistic notes
  evidenceStatus?: string;
  nativeSpeakerValidation?: string;
  confidence?: string;
  notes?: string;
  audioUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PhraseSchema = new Schema<IPhrase>(
  {
    regionId: { type: String, required: true, ref: "Region", index: true },
    districts: { type: [String], default: [] },
    recordId: { type: String, default: "" },
    textbook: { type: String, required: true },
    regional: { type: String, required: true },
    meaning: { type: String, required: true },
    topic: { type: String, default: "" },
    sentenceLengthClass: { type: String, default: "" },
    candidateFeature: { type: String, default: "" },
    evidenceStatus: { type: String, default: "" },
    nativeSpeakerValidation: { type: String, default: "" },
    confidence: { type: String, default: "" },
    notes: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

PhraseSchema.index({ districts: 1 });
PhraseSchema.index({ regionId: 1, topic: 1 });

export const Phrase: Model<IPhrase> =
  mongoose.models.Phrase || mongoose.model<IPhrase>("Phrase", PhraseSchema);

export default Phrase;
