import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

// Aby używać __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "./resolvers/carResolver.js";

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
const carService = proto.carservice.CarService;
const server = new grpc.Server();

server.addService(carService.service, {
  GetCars: getCars,
  GetCar: getCarById,
  CreateCar: createCar,
  UpdateCar: updateCar,
  DeleteCar: deleteCar,
});

server.bindAsync(
  "127.0.0.1:4000",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Server running at http://127.0.0.1:${port}`);
  }
);
