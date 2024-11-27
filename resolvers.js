import { GraphQLScalarType, Kind } from "graphql";
import data from "./data.json" assert { type: "json" };

const VINScalar = new GraphQLScalarType({
  name: "VIN",
  description: "Vehicle Identification Number (17-character alphanumeric code)",
  serialize(value) {
    return value; // Przy zwracaniu do klienta
  },
  parseValue(value) {
    if (typeof value !== "string" || !/^[A-HJ-NPR-Z0-9]{17}$/.test(value)) {
      throw new Error("Invalid VIN");
    }
    return value; // Przy otrzymywaniu od klienta
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING || !/^[A-HJ-NPR-Z0-9]{17}$/.test(ast.value)) {
      throw new Error("Invalid VIN");
    }
    return ast.value;
  },
});

export const resolvers = {
  VIN: VINScalar,
  Query: {
    cars: (_, { filter, limit, offset, sortBy, sortOrder = "ASC" }) => {
      let cars = data.cars;

      // Filtrowanie
      if (filter) {
        if (filter.vin) {
          cars = cars.filter((car) => car.vin === filter.vin);
        }
        if (filter.model) {
          if (filter.model.eq) {
            cars = cars.filter((car) => car.model === filter.model.eq);
          }
          if (filter.model.contains) {
            cars = cars.filter((car) =>
              car.model.includes(filter.model.contains)
            );
          }
          if (filter.model.neq) {
            cars = cars.filter((car) => car.model !== filter.model.neq);
          }
          if (filter.model.notContains) {
            cars = cars.filter(
              (car) => !car.model.includes(filter.model.notContains)
            );
          }
        }
        if (filter.year) {
          if (filter.year.eq !== undefined) {
            cars = cars.filter((car) => car.year === filter.year.eq);
          }
          if (filter.year.gt !== undefined) {
            cars = cars.filter((car) => car.year > filter.year.gt);
          }
          if (filter.year.lt !== undefined) {
            cars = cars.filter((car) => car.year < filter.year.lt);
          }
          if (filter.year.gte !== undefined) {
            cars = cars.filter((car) => car.year >= filter.year.gte);
          }
          if (filter.year.lte !== undefined) {
            cars = cars.filter((car) => car.year <= filter.year.lte);
          }
        }
        if (filter.price) {
          if (filter.price.eq !== undefined) {
            cars = cars.filter((car) => car.price === filter.price.eq);
          }
          if (filter.price.gt !== undefined) {
            cars = cars.filter((car) => car.price > filter.price.gt);
          }
          if (filter.price.lt !== undefined) {
            cars = cars.filter((car) => car.price < filter.price.lt);
          }
          if (filter.price.gte !== undefined) {
            cars = cars.filter((car) => car.price >= filter.price.gte);
          }
          if (filter.price.lte !== undefined) {
            cars = cars.filter((car) => car.price <= filter.price.lte);
          }
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
      if (typeof offset === "number") {
        cars = cars.slice(offset);
      }
      if (typeof limit === "number") {
        cars = cars.slice(0, limit);
      }

      return cars;
    },
    manufacturers: () => data.manufacturers,
    car: (_, { id }) => data.cars.find((car) => car.id === id),
    manufacturer: (_, { id }) => data.manufacturers.find((m) => m.id === id),
  },
  Mutation: {
    createCar: (_, { carInput }) => {
      const id = data.cars[data.cars.length - 1]?.id + 1 || 1;
      const newCar = { id, ...carInput };
      data.cars.push(newCar);
      return newCar;
    },
    updateCar: (_, { id, carInput }) => {
      const index = data.cars.findIndex((car) => car.id === id);
      if (index === -1) throw new Error("Car not found");
      data.cars[index] = { id, ...carInput };
      return data.cars[index];
    },
    deleteCar: (_, { id }) => {
      const index = data.cars.findIndex((car) => car.id === id);
      if (index === -1)
        return { success: false, message: "Car not found", code: "NOT_FOUND" };
      data.cars.splice(index, 1);
      return { success: true, message: "Deleted", code: "SUCCESS" };
    },

    createManufacturer: (_, { manufacturerInput }) => {
      const id = data.manufacturers[data.manufacturers.length - 1]?.id + 1 || 1;
      const newManufacturer = { id, ...manufacturerInput };
      data.manufacturers.push(newManufacturer);
      return newManufacturer;
    },
    updateManufacturer: (_, { id, manufacturerInput }) => {
      const index = data.manufacturers.findIndex((m) => m.id === id);
      if (index === -1) throw new Error("Manufacturer not found");
      data.manufacturers[index] = { id, ...manufacturerInput };
      return data.manufacturers[index];
    },
    deleteManufacturer: (_, { id }) => {
      const index = data.manufacturers.findIndex((m) => m.id === id);
      if (index === -1)
        return {
          success: false,
          message: "Manufacturer not found",
          code: "NOT_FOUND",
        };
      data.manufacturers.splice(index, 1);
      return { success: true, message: "Deleted", code: "SUCCESS" };
    },
  },
};
