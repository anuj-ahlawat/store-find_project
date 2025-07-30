# Nearest Store Finder

A web application built with [Next.js](https://nextjs.org/) and a Python backend to help users find the nearest store based on their location. The project leverages geolocation, efficient data processing, and modern UI/UX for a seamless experience.

## Motivation

Finding the nearest physical store is a common need for users, whether for shopping, services, or logistics. This project demonstrates how to combine geospatial search, scalable backend processing (using PySpark), and a modern frontend to solve this problem efficiently.

## Features

- **Find Nearest Stores:** Enter your location (or use your device's geolocation) and search for stores within a specified radius.
- **Store List Selection:** Browse and select stores from a dynamically filtered list.
- **Download Options:**
  - Download the list of stores as a JSON file for easy integration with other tools.
  - **ORC Download:** Download the list in ORC (Optimized Row Columnar) format for efficient analytics and big data workflows.
- **Responsive UI:** Built with React and Next.js for a fast, mobile-friendly experience.
- **Geolocation Support:** Use your device's location to quickly find nearby stores.

## Technology Stack

- **Frontend:** Next.js (React), TypeScript, CSS Modules, React Icons
- **Backend:** Python, Flask, PySpark, Flask-CORS
- **Data Storage:** CSV file for store data (can be extended to databases)
- **Data Export:** JSON and ORC formats

## Data Format

The backend expects a CSV file (`stores.csv`) with the following columns:

| store_id | store_name | latitude | longitude |
|----------|------------|----------|-----------|
| 1        | Store A    | 28.7041  | 77.1025   |
| 2        | Store B    | 19.0760  | 72.8777   |
| ...      | ...        | ...      | ...       |

- `store_id`: Integer, unique identifier for each store
- `store_name`: String, name of the store
- `latitude`/`longitude`: Float, geographic coordinates

## API Endpoints

### `/nearest-stores` (GET)
Returns a list of stores within a given radius of the provided latitude and longitude.

**Query Parameters:**
- `lat`: Latitude (required)
- `lon`: Longitude (required)
- `radius_km`: Search radius in kilometers (required)

**Response:**
```json
{
  "total_stores_found": 3,
  "closest_store": { "store_id": 1, "store_name": "Store A", ... },
  "all_stores": [ { "store_id": 1, ... }, ... ]
}
```

### `/nearest-stores-orc` (GET)
Returns the same filtered list as an ORC file (binary download).

**Query Parameters:** Same as above.

**Response:**
- ORC file download (`stores.orc`)

## Usage

1. **Open the App:** Start the development server and open [http://localhost:3000](http://localhost:3000).
2. **Find Stores:**
   - Enter your latitude, longitude, and search radius, or use the "Use Current Location" button.
   - Click "Search" to view nearby stores.
3. **Select Stores:**
   - Browse the list and select stores as needed.
4. **Download Data:**
   - Click the JSON or ORC download buttons to export the filtered list.

### Screenshots

<img width="1067" height="769" alt="Screenshot 2025-07-30 at 11 46 52 PM" src="https://github.com/user-attachments/assets/5a4a3c86-a9eb-4e82-b3ea-60fb44cf22c8" />

<img width="589" height="632" alt="Screenshot 2025-07-30 at 11 47 24 PM" src="https://github.com/user-attachments/assets/e90ff7a2-caca-4ae2-9aba-fbbcec48e76e" />


## Development & Testing

### Prerequisites
- Node.js (v18 or later)
- Python 3.x
- Java (required for PySpark)
- npm, yarn, or pnpm

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nearest-store-finder.git
   cd nearest-store-finder
   ```
2. **Install frontend dependencies:**
   ```bash
   npm install
   # or yarn install
   ```
3. **Install backend dependencies:**
   ```bash
   pip install flask flask-cors pyspark
   ```
4. **Run the backend:**
   ```bash
   cd store-finder/backend
   python api.py
   ```
5. **Run the frontend:**
   ```bash
   cd store-finder/ui
   npm run dev
   ```

### Testing
- Ensure both backend and frontend are running.
- Use the UI to search, select, and download store data.
- Test API endpoints directly with tools like Postman or curl.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

## FAQ

**Q: What is ORC format?**
A: ORC (Optimized Row Columnar) is a columnar storage file format optimized for big data processing, commonly used with Apache Spark and Hadoop.

**Q: Can I use a database instead of CSV?**
A: Yes, the backend can be extended to use a database for store data.

**Q: How is distance calculated?**
A: The backend uses the Haversine formula to compute the great-circle distance between two points on the Earth.

## Contact

For questions or support, please open an issue on GitHub or contact the project maintainer.

## License

This project is licensed under the MIT License.




