from flask import Flask, request, jsonify
from flask_cors import CORS
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf, round as spark_round, lit
from pyspark.sql.types import DoubleType
import math

spark = SparkSession.builder.appName("StoreFinder").getOrCreate()

app = Flask(__name__)
CORS(app)  
#haversine formula
def haversine(lat1, lon1, lat2, lon2):
    R = 6378.1
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c
#connect haversine with udf
haversine_udf = udf(haversine, DoubleType())
#input lat long from user
@app.route('/nearest-stores', methods=['GET'])
def get_nearest_stores():
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        radius_km = request.args.get('radius_km')
        if lat is None or lon is None or radius_km is None:
            return jsonify({"error": "Missing required query parameters: lat, lon, radius_km"}), 400
        lat = float(lat)
        lon = float(lon)
        radius_km = float(radius_km)
        #read csv file
        df = spark.read.csv("stores.csv")
        #rename columns
        df = df.withColumnRenamed("_c0", "store_id") \
            .withColumnRenamed("_c1", "store_name") \
            .withColumnRenamed("_c2", "latitude") \
            .withColumnRenamed("_c3", "longitude")
        df = df.withColumn("store_id", df["store_id"].cast("int")) \
            .withColumn("latitude", df["latitude"].cast("double")) \
            .withColumn("longitude", df["longitude"].cast("double"))
        df = df.withColumn("user_lat", lit(lat).cast("double")) \
            .withColumn("user_lon", lit(lon).cast("double"))
        df = df.withColumn("distance_km", haversine_udf("latitude", "longitude", "user_lat", "user_lon"))
        df = df.filter(df["distance_km"] <= radius_km)
        df = df.withColumn("distance_km", spark_round("distance_km", 2))
        #sort in assending order
        df = df.orderBy("distance_km")
        #count the total stores in radius
        count = df.count()
        #display output
        result = df.select("store_id", "store_name", "latitude", "longitude", "distance_km").collect()
        stores = [row.asDict() for row in result]
        return jsonify({
            "total_stores_found": count,
            "closest_store": stores[0] if stores else None,
            "all_stores": stores
        })
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, )
