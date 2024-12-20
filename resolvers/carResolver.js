import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as grpc from "@grpc/grpc-js";

// Definicja __dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funkcja do danych z JSON
function loadData() {
  const dataPath = path.resolve(__dirname, "../data.json");
  try {
    const jsonData = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading data.json:", error);
    return { cars: [], manufacturers: [] };
  }
}

// Wczytanie danych przy starcie
let data = loadData();

// Funkcja do zapisywania danych
function saveData() {
  const dataPath = path.resolve(__dirname, "../data.json");
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to data.json:", error);
  }
}

export function getCars(call, callback) {
  let cars = data.cars;
  const { filter, limit, offset, sortBy, sortOrder } = call.request;

  // Filtrowanie
  if (filter) {
    if (filter.model_eq) {
      cars = cars.filter((car) => car.model === filter.model_eq);
    }
    if (filter.model_contains) {
      cars = cars.filter((car) => car.model.includes(filter.model_contains));
    }
    if (filter.model_neq) {
      cars = cars.filter((car) => car.model !== filter.model_neq);
    }
    if (filter.model_notContains) {
      cars = cars.filter(
        (car) => !car.model.includes(filter.model_notContains)
      );
    }

    if (filter.year_eq !== undefined) {
      cars = cars.filter((car) => car.year === filter.year_eq);
    }
    if (filter.year_gt !== undefined) {
      cars = cars.filter((car) => car.year > filter.year_gt);
    }
    if (filter.year_lt !== undefined) {
      cars = cars.filter((car) => car.year < filter.year_lt);
    }
    if (filter.year_gte !== undefined) {
      cars = cars.filter((car) => car.year >= filter.year_gte);
    }
    if (filter.year_lte !== undefined) {
      cars = cars.filter((car) => car.year <= filter.year_lte);
    }

    if (filter.price_eq !== undefined) {
      cars = cars.filter((car) => car.price === filter.price_eq);
    }
    if (filter.price_gt !== undefined) {
      cars = cars.filter((car) => car.price > filter.price_gt);
    }
    if (filter.price_lt !== undefined) {
      cars = cars.filter((car) => car.price < filter.price_lt);
    }
    if (filter.price_gte !== undefined) {
      cars = cars.filter((car) => car.price >= filter.price_gte);
    }
    if (filter.price_lte !== undefined) {
      cars = cars.filter((car) => car.price <= filter.price_lte);
    }
  }

  // Sortowanie
  if (sortBy) {
    cars.sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      if (fieldA < fieldB) return sortOrder === "DESC" ? 1 : -1;
      if (fieldA > fieldB) return sortOrder === "DESC" ? -1 : 1;
      return 0;
    });
  }

  // Paginacja
  const start = offset || 0;
  const end = limit ? start + limit : cars.length;
  cars = cars.slice(start, end);

  callback(null, { cars });
}

export function getCarById(call, callback) {
  const carId = call.request.id;
  const car = data.cars.find((car) => car.id === carId);
  if (car) {
    callback(null, car);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Car not found",
    });
  }
}

export function createCar(call, callback) {
  const newCar = call.request;

  // Walidacja danych wejściowych
  if (
    !newCar.vin ||
    !newCar.model ||
    !newCar.year ||
    !newCar.price ||
    !newCar.manufacturer
  ) {
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: "Missing required fields",
    });
    return;
  }

  // Ustalanie nowego ID
  newCar.id = data.cars.length > 0 ? data.cars[data.cars.length - 1].id + 1 : 1;

  // Dodanie nowego samochodu do danych
  data.cars.push(newCar);

  // Zapisywanie do JSON
  saveData();

  callback(null, newCar);
}

export function updateCar(call, callback) {
  const carId = call.request.id;
  const updatedData = call.request.car;

  // check updatedData.id nie jest nadpisywany
  delete updatedData.id;

  const index = data.cars.findIndex((car) => car.id === carId);
  if (index !== -1) {
    data.cars[index] = { ...data.cars[index], ...updatedData };
    saveData();
    callback(null, data.cars[index]);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Car not found",
    });
  }
}

export function deleteCar(call, callback) {
  const carId = call.request.id;

  const index = data.cars.findIndex((car) => car.id === carId);
  if (index !== -1) {
    data.cars.splice(index, 1);
    saveData();
    callback(null, { success: true, message: "Deleted", code: "SUCCESS" });
  } else {
    callback(null, {
      success: false,
      message: "Car not found",
      code: "NOT_FOUND",
    });
  }
}
