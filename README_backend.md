# 🗺️ Nearest Store Finder API

This project is a RESTful API built using **Flask**, **PySpark**, and the **Haversine formula** to calculate and return the nearest stores within a given radius from a user-provided latitude and longitude.

---

## 🚀 Features

- Accepts user location via query parameters
- Reads store data from a CSV file
- Calculates distance using the Haversine formula (via PySpark UDF)
- Returns all stores within a given radius
- Sorts results by closest distance
- Includes total count and nearest store in the response

---

## 📥 API Endpoint

### `GET /nearest-stores`

#### 🔸 Query Parameters:

| Name       | Type   | Required | Description                     |
|------------|--------|----------|---------------------------------|
| `lat`      | float  | ✅ Yes   | Latitude of the user           |
| `lon`      | float  | ✅ Yes   | Longitude of the user          |
| `radius_km`| float  | ✅ Yes   | Radius (in kilometers) to search within |

#### 📤 Sample Request:

```http
GET /nearest-stores?lat=28.6139&lon=77.2090&radius_km=10
