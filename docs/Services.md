---
title: Services
---

This file describes all routes and operations for the Services resource. Below, you will find details on each endpoint, including example requests and responses.

---

## `GET /services`

**Description:** Retrieves a list of all services. \
**Response:** Returns a JSON object containing a list of services and a self-referencing link.

> Example Request:
> `http://localhost:3000/services`

```json
{
  "services": [
    { "id": 1, "name": "Oil Change" },
    { "id": 2, "name": "Tire Rotation" }
  ],
  "links": [{ "rel": "self", "method": "GET", "href": "/services" }]
}
```

## `POST /services`

**Description**: Adds a new service to the collection.\
**Request Body**: Requires id and name fields.\
**Response**: Returns a confirmation message and a link to the created resource.

> Example Request:
> `http://localhost:3000/services`
> Request Body:

```json
{
  "id": 3,
  "name": "Brake Inspection"
}
```

> Example Response:

```json
{
  "message": "Service created successfully",
  "links": [{ "rel": "self", "method": "POST", "href": "/services" }]
}
```

## `GET /services/{serviceId}`

**Description**: Retrieves details of a specific service identified by serviceId.\
**Response**: Returns the service details and related links. If the service is not found, returns a 404 error.

> Example Request
> `http://localhost:3000/services/1`

> Example Response:

```json
{
  "service": { "id": 1, "name": "Oil Change" },
  "links": [
    { "rel": "self", "method": "GET", "href": "/services/1" },
    { "rel": "cars", "method": "GET", "href": "/services/1/cars" }
  ]
}
```

## `PUT /services/{serviceId}`

**Description**: Updates the details of a specific service identified by serviceId.\
**Request Body**: Requires the name field.\
**Response**: Returns a confirmation message and a link to the updated resource.

> Example Request:
> `http://localhost:3000/services/1`

> Request Body:

```json
{
  "name": "Advanced Oil Change"
}
```

> Example Response:

```json
{
  "message": "Service updated successfully",
  "links": [{ "rel": "self", "method": "PUT", "href": "/services/1" }]
}
```

## `DELETE /services/{serviceId}`

**Description**: Deletes a specific service identified by serviceId.
**Response**: Returns a 204 No Content status if the service is successfully deleted.

> Example Request:
> `http://localhost:3000/services/1`

> Response: No content.

> Error Handling:
> If an internal server error occurs, the API returns a 500 error with the following structure:

```json
{
  "message": "Internal Server Error"
}
```
