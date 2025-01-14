---
title: Dealerships
---

This section describes all routes and operations for the Dealerships resource. Below, you will find details on each endpoint, including example requests and responses.

---

## `GET /dealerships`

**Description** Retrieves a list of all dealerships. \
**Response** Returns a JSON object containing a list of dealerships and a self-referencing link.

> Example Request:
> `http://localhost:3000/dealerships`

> Example Response:

```json
{
  "dealerships": [
    { "id": 1, "name": "Chevrolet Center", "location": "Warsaw" },
    { "id": 2, "name": "Auto Market", "location": "Berlin" }
  ],
  "links": [{ "rel": "self", "method": "GET", "href": "/dealerships" }]
}
```

---

## `POST /dealerships`

**Description**: Adds a new dealership to the collection.\
**Request Body**: Requires id, name, and location fields.\
**Response**: Returns a confirmation message and a link to the created resource.

> Example Request:
> http://localhost:3000/dealerships

> Request Body:

```json
{
  "id": 3,
  "name": "New Dealership",
  "location": "Paris"
}
```

> Example Response:

```json
{
  "message": "Dealership created successfully",
  "links": [{ "rel": "self", "method": "POST", "href": "/dealerships" }]
}
```

## `GET /dealerships/{dealershipId}`

**Description**: Retrieves details of a specific dealership identified by dealershipId.\
**Response**: Returns the dealership details and related links. If the dealership is not found, returns a 404 error.

> Example Request:
> `http://localhost:3000/dealerships/1`

> Example Response:

```json
{
  "dealership": { "id": 1, "name": "Chevrolet Center", "location": "Warsaw" },
  "links": [
    { "rel": "self", "method": "GET", "href": "/dealerships/1" },
    { "rel": "cars", "method": "GET", "href": "/dealerships/1/cars" }
  ]
}
```

## `PUT /dealerships/{dealershipId}`

**Description**: Updates the details of a specific dealership identified by dealershipId.\
**Request Body**: Requires name and location fields.\
**Response**: Returns a confirmation message and a link to the updated resource.

> Example Request:
> `http://localhost:3000/dealerships/1`

> Request Body:

```json
{
  "name": "Updated Dealership",
  "location": "New York"
}
```

> Example Response:

```json
{
  "message": "Dealership updated successfully",
  "links": [{ "rel": "self", "method": "PUT", "href": "/dealerships/1" }]
}
```

## `DELETE /dealerships/{dealershipId}`

**Description**: Deletes a specific dealership identified by dealershipId.\
**Response**: Returns a 204 No Content status if the dealership is successfully deleted.

> Example Request:
> `http://localhost:3000/dealerships/1`

> Response: No content.

```json
{
  "status": 204
}
```
