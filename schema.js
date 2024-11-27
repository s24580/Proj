export const typeDefs = `#graphql
  scalar VIN

  type Car {
    id: Int!
    vin: VIN!
    model: String
    year: Int
    price: Float
    features: [String]!
    manufacturer: Int!
  }

  type Manufacturer {
    id: Int!
    name: String
    country: String
    foundedYear: Int
    cars: [Int]!
  }

  input CarInput {
    vin: VIN!
    model: String!
    year: Int!
    price: Float!
    features: [String]!
    manufacturer: Int!
  }

  input ManufacturerInput {
    name: String!
    country: String!
    foundedYear: Int!
    cars: [Int]!
  }

  input StringFilter {
    eq: String
    contains: String
    neq: String
    notContains: String
  }

  input IntFilter {
    eq: Int
    gt: Int
    lt: Int
    gte: Int
    lte: Int
  }

  input FloatFilter {
    eq: Float
    gt: Float
    lt: Float
    gte: Float
    lte: Float
  }

  input CarFilter {
    vin: VIN
    model: StringFilter
    year: IntFilter
    price: FloatFilter
  }

  # typy dla sortowania
  enum CarSortFields {
    id
    model
    year
    price
  }

  enum SortOrder {
    ASC
    DESC
  }

  type DeleteResponse {
    success: Boolean!
    message: String
    code: String!
  }

  type ErrorResponse {
    message: String
    code: String
  }

  type Query {
    cars(
      filter: CarFilter,
      limit: Int,
      offset: Int,
      sortBy: CarSortFields,
      sortOrder: SortOrder = ASC
    ): [Car]
    manufacturers: [Manufacturer]
    car(id: Int): Car
    manufacturer(id: Int): Manufacturer
  }

  type Mutation {
    createCar(carInput: CarInput): Car
    updateCar(id: Int, carInput: CarInput): Car
    deleteCar(id: Int): DeleteResponse

    createManufacturer(manufacturerInput: ManufacturerInput): Manufacturer
    updateManufacturer(id: Int, manufacturerInput: ManufacturerInput): Manufacturer
    deleteManufacturer(id: Int): DeleteResponse
  }
`;
