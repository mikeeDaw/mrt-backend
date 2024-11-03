import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MobileTapSchema = new Schema(
  {
    uid: { type: String, require: true, unique: true },
    balance: { type: Number, require: true },
    tapped: { type: Boolean, require: true },
    origin: { type: String, require: true },
    transactions: { type: [{ date: String, amount: Number, desc: String }] },
  },
  { timestamps: true }
);

export const MobileTapModel = mongoose.model(
  "MobileTap",
  MobileTapSchema,
  "mobileTap"
);
