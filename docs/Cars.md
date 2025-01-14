---
title: Cars
---

This section describes all endpoints and data regarding the Car entity included in this project.
You can find samples of requests and examples of the data format that should be returned.

---

### All routes regarding Cars

- `GET` `http://localhost:3000/cars` -> Returns all Cars
- `GET` `http://localhost:3000/cars/{carId}` -> Returns a specific Car based on provided carId
- `POST` `http://localhost:3000/cars` -> Adds a new Car
- `PUT` `http://localhost:3000/cars/{carId}` -> Updates the whole entity of a Car
- `DELETE` `http://localhost:3000/cars/{carId}` -> Deletes a Car
- `GET` `http://localhost:3000/cars/{carId}/features` -> Returns features of a specific Car
- `POST` `http://localhost:3000/cars/{carId}/features` -> Adds a new feature to a Car

---

## `/cars`

This is the route that will provide you with the data for all Cars.

### Route for the request

This section describes all routes and operations for the Cars resource. Below, you will find details on each endpoint, including example requests and responses.

---

## `GET /cars`

**Description**: Retrieves a list of all cars.\
**Response**: Returns a JSON object containing a list of cars and a self-referencing link.

> Example Request:
> `http://localhost:3000/cars`

```json
{
  "cars": [
    { "id": 1, "model": "Camaro", "year": 2020 },
    { "id": 2, "model": "Corvette", "year": 2021 }
  ],
  "links": [{ "rel": "self", "method": "GET", "href": "/cars" }]
}
```

---

## `POST /cars`

**Description**: Adds a new car to the collection.\
**Request Body**: Requires `id`, `model`, and `year` fields.\
**Response**: Returns a confirmation message and a link to the created resource.

> Example Request:
> `http://localhost:3000/cars`

```json
{
  "id": 3,
  "model": "Impala",
  "year": 2019
}
```

> Example Response:

```json
{
  "message": "Car created successfully",
  "links": [{ "rel": "self", "method": "POST", "href": "/cars" }]
}
```

---

## `GET /cars/{carId}`

**Description**: Retrieves details of a specific car identified by `carId`.\
**Response**: Returns the car details and related links. If the car is not found, returns a 404 error.

> Example Request:
> `http://localhost:3000/cars/1`

> Example Response:

```json
{
  "car": { "id": 1, "model": "Camaro", "year": 2020 },
  "links": [
    { "rel": "self", "method": "GET", "href": "/cars/1" },
    { "rel": "features", "method": "GET", "href": "/cars/1/features" }
  ]
}
```

---

## `PUT /cars/{carId}`

**Description**: Updates the details of a specific car identified by `carId`.\
**Request Body**: Requires `model` and `year` fields.\
**Response**: Returns a confirmation message and a link to the updated resource.

> Example Request:
> `http://localhost:3000/cars/1`

> Request Body:

```json
{
  "model": "Corvette",
  "year": 2022
}
```

> Example Response:

```json
{
  "message": "Car updated successfully",
  "links": [{ "rel": "self", "method": "PUT", "href": "/cars/1" }]
}
```

---

## `DELETE /cars/{carId}`

**Description**: Deletes a specific car identified by `carId`.\
**Response**: Returns a 204 No Content status if the car is successfully deleted.

> Example Request:
> `http://localhost:3000/cars/1`

**Response**: No content.

---

## `GET /cars/{carId}/features`

**Description**: Retrieves the list of features for a specific car identified by `carId`.\
**Response**: Returns a JSON array of features.

> Example Request:
> `http://localhost:3000/cars/1/features`

> Example Response:

```json
{
  "features": ["Air Conditioning", "Navigation System"]
}
```

---

## `POST /cars/{carId}/features`

**Description**: Adds a new feature to a specific car identified by `carId`.\
**Request Body**: Requires the `feature` field.\
**Response**: Returns a confirmation message.

> Example Request:
> `http://localhost:3000/cars/1/features`

> Request Body:

```json
{
  "feature": "Heated Seats"
}
```

> Example Response:

```json
{
  "message": "Feature added successfully"
}
```
