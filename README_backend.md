# Store Finder API

This project provides a Flask API to find the nearest stores within a given radius using PySpark for fast geospatial calculations.

## Features
- Find nearest stores by latitude, longitude, and radius (km)
- Returns results as JSON or downloadable ORC file
- Uses the Haversine formula for distance calculation

## Requirements
- Python 3.8–3.10 (PySpark is not yet compatible with Python 3.13)
- Java 17 (required by recent PySpark/Spark builds)
- pip (Python package manager)
- macOS/Linux/Windows

## Setup

1. **Clone the repository** (if not already):
   ```sh
   git clone <repo-url>
   cd bigdata-docker-env
   ```

2. **Create and activate a virtual environment:**
   ```sh
   python3.10 -m venv .venv
   source .venv/bin/activate
   ```
   *(Replace `python3.10` with your installed Python 3.8–3.10 version)*

3. **Install dependencies:**
   ```sh
   pip install flask flask-cors pyspark
   ```

4. **Set JAVA_HOME to Java 17:**
   ```sh
   export JAVA_HOME=$(/usr/libexec/java_home -v17)
   export PATH=$JAVA_HOME/bin:$PATH
   java -version  # Should show Java 17
   ```

5. **Ensure `stores.csv` is present in the project root.**

## Running the API

```sh
python api.py
```

The API will be available at `http://127.0.0.1:5000/`.

### Endpoints
- `/nearest-stores?lat=<lat>&lon=<lon>&radius_km=<radius>`
  - Returns JSON with nearest stores within the radius.
- `/nearest-stores-orc?lat=<lat>&lon=<lon>&radius_km=<radius>`
  - Returns an ORC file with the results.

## Example Request

```
curl "http://127.0.0.1:5000/nearest-stores?lat=28.61&lon=77.23&radius_km=10"
```

## Troubleshooting
- **Java errors:**
  - Make sure you are using Java 17 (`java -version`).
  - Set `JAVA_HOME` as shown above.
- **Python errors:**
  - Use Python 3.8–3.10. PySpark is not compatible with Python 3.13.
- **PySpark errors:**
  - Reinstall PySpark after setting the correct Java version.

## License
MIT 
