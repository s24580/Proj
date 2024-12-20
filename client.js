import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

// Aby używać __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ścieżki do plików .proto
const PROTO_PATHS = [
  path.resolve(__dirname, "./proto/car.proto"),
  path.resolve(__dirname, "./proto/car_service.proto"),
];

const packageDefinition = protoLoader.loadSync(PROTO_PATHS, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

const carClient = new proto.carservice.CarService(
  "127.0.0.1:4000",
  grpc.credentials.createInsecure()
);

// Przykładowe wywołanie GetCars
carClient.GetCars({}, (err, response) => {
  if (err) {
    console.error("Error fetching cars:", err);
  } else {
    console.log("Cars:", response.cars);
  }
});

// Przykładowe wywołanie GetCar
const carId = { id: 1 };

carClient.GetCar(carId, (err, response) => {
  if (err) {
    console.error("Error fetching car:", err);
  } else {
    console.log("Fetched Car:", response);
  }
});

// Przykładowe wywołanie CreateCar
const newCar = {
  vin: "1HGCM82633A004352",
  model: "Camaro",
  year: 2021,
  price: 35000.0,
  features: ["Convertible", "Bluetooth"],
  manufacturer: 1,
};

carClient.CreateCar(newCar, (err, response) => {
  if (err) {
    console.error("Error creating car:", err);
  } else {
    console.log("Created Car:", response);
  }
});

// Przykładowe wywołanie UpdateCar
const updatedCar = {
  vin: "1HGCM82633A004352",
  model: "Camaro SS",
  year: 2021,
  price: 37000.0,
  features: ["Convertible", "Bluetooth", "Performance Package"],
  manufacturer: 1,
};

const updateCarRequest = {
  id: 1,
  car: updatedCar,
};

carClient.UpdateCar(updateCarRequest, (err, response) => {
  if (err) {
    console.error("Error updating car:", err);
  } else {
    console.log("Updated Car:", response);
  }
});

// Przykładowe wywołanie DeleteCar
const carIdToDelete = { id: 1 };

carClient.DeleteCar(carIdToDelete, (err, response) => {
  if (err) {
    console.error("Error deleting car:", err);
  } else {
    console.log("Delete Response:", response);
  }
});
