const mongoose = require("mongoose");

const EngineSchema = new mongoose.Schema({
  model: { type: String, required: true },
  displacement: Number,
  horsepower: Number,
  fuelType: { type: String, enum: ["Benzyna", "Diesel"], required: true },
});

const YearSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  engines: [EngineSchema],
  features: [String],
  bodyTypes: [
    {
      type: [String],
      enum: ["Coupe", "Convertible", "Sedan", "SUV", "Hatchback", "Kombi"],
    },
  ],
  driveTypes: [
    {
      type: [String],
      enum: ["RWD", "FWD", "AWD", "4WD"],
    },
  ],
  transmissions: [
    {
      type: [String],
      enum: ["Manualna", "Automatyczna"],
    },
  ],
});

const ModelSchema = new mongoose.Schema({
  name: { type: String, required: true, uniqe: true },
  porducionYears: [YearSchema],
});

module.exports = mongoose.model("model", ModelSchema);
