import mongoose from "mongoose";

const Schema = mongoose.Schema;

const constantSchema = new Schema(
  {
    id: { type: String, require: true },
    penalty: { type: Number, require: true },
    farePerKM: { type: Number, require: true },
    minFare: { type: Number, require: true },
    minLoad: { type: Number, require: true },
    maintenance: { type: Boolean, require: true },
  },
  { timestamps: true }
);

export const constModel = mongoose.model(
  "Constant",
  constantSchema,
  "Constant"
);

export const getConstants = () => constModel.find();
export const getConstById = (id: String) => constModel.findOne({ id });
export const createConst = (values: Record<string, any>) =>
  new constModel(values).save().then((cons) => cons.toObject());
export const deleteConstById = (id: String) =>
  constModel.findOneAndDelete({ id: id });
export const updateConst = (id: String, values: Record<string, any>) =>
  constModel.findOneAndUpdate({ id: id }, values, { new: true });
