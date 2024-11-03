import mongoose from "mongoose";

const Schema = mongoose.Schema;

const stationSchema = new Schema({
  name: { type: String, require: true, unique: true },
  code: { type: String, require: true, unique: true },
  connected: { type: [String], require: true },
  coordinates: { type: { x: Number, y: Number }, require: true },
});

export const StationModel = mongoose.model("Station", stationSchema, "Station");

export const getStations = () => StationModel.find();
export const getStationByCode = (code: String) =>
  StationModel.findOne({ code });
export const createStation = (values: Record<string, any>) =>
  new StationModel(values).save().then((user) => user.toObject());
export const deleteStationByCode = (code: String) =>
  StationModel.findOneAndDelete({ code });
export const updateStationByCode = (
  iCode: String,
  values: Record<string, any>
) => StationModel.findOneAndUpdate({ code: iCode }, values, { new: true });
