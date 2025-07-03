"use client";
import { FaLocationCrosshairs } from "react-icons/fa6";
import React, { useState } from "react";

type Store = {
  store_id: number;
  store_name: string;
  latitude: number;
  longitude: number;
  distance_km: number;
};

type ApiResult = {
  total_stores_found: number;
  closest_store: Store | null;
  all_stores: Store[];
};

const PAGE_SIZES = [10, 20, 50, 100];

const Page: React.FC = () => {
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [radius, setRadius] = useState<string>("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showCount, setShowCount] = useState<number>(10);
  const [selectedStoreIds, setSelectedStoreIds] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch(
        `/api/proxy?lat=${lat}&lon=${lon}&radius_km=${radius}`
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || `API error: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setResult(data);
      // Select all visible stores by default
      setSelectedStoreIds(
        data.all_stores
          .slice(0, showCount)
          .map((store: Store) => store.store_id)
      );
    } catch (err: any) {
      setError(
        "Failed to fetch data. Please ensure the backend is running and accessible. Error: " +
          (err?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError("");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toString());
        setLon(position.coords.longitude.toString());
        setLoading(false);
      },
      (err) => {
        setError("Failed to get current location: " + err.message);
        setLoading(false);
      }
    );
  };

  const handleCheckboxChange = (storeId: number) => {
    setSelectedStoreIds((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleDownload = () => {
    if (!result) return;
    const selectedStores = result.all_stores.filter((store) =>
      selectedStoreIds.includes(store.store_id)
    );
    const dataToDownload = {
      ...result,
      all_stores: selectedStores,
      total_stores_found: selectedStores.length,
      closest_store:
        result.closest_store &&
        selectedStoreIds.includes(result.closest_store.store_id)
          ? result.closest_store
          : null,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(dataToDownload, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "stores_result.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f8fa",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: 36,
          maxWidth: 520,
          width: "100%",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 24,
            fontWeight: 700,
            fontSize: 28,
          }}
        >
          Find Nearest Stores
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={loading}
            style={{
              marginTop: 8,
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "10px 12px",
              justifyContent: "space-between",
              fontSize: 18,
              marginBottom: 16,
              gap: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaLocationCrosshairs className="mr-1" />
            Use Current Location
          </button>
          <label style={{ fontWeight: 500 }}>
            Latitude:
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
              step="any"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 16,
                marginBottom: 4,
              }}
            />
          </label>
          <label style={{ fontWeight: 500 }}>
            Longitude:
            <input
              type="number"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              required
              step="any"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 16,
                marginBottom: 4,
              }}
            />
          </label>
          <label style={{ fontWeight: 500 }}>
            Radius (km):
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              required
              step="any"
              min="0"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 16,
                marginBottom: 4,
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontWeight: 600,
              fontSize: 18,
              marginTop: 8,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background 0.2s, opacity 0.2s",
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: 8,
              padding: 12,
              marginTop: 18,
              fontWeight: 500,
              textAlign: "center",
              border: "1px solid #fca5a5",
            }}
          >
            {error}
          </div>
        )}
        {result && (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
              Result
            </h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 500, marginRight: 8 }}>
                Show only:
                <select
                  value={showCount}
                  onChange={(e) => {
                    const newCount = Number(e.target.value);
                    setShowCount(newCount);

                    if (result) {
                      setSelectedStoreIds(
                        result.all_stores
                          .slice(0, newCount)
                          .map((store: Store) => store.store_id)
                      );
                    }
                  }}
                  style={{
                    marginLeft: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                  }}
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                  {result.all_stores.length > Math.max(...PAGE_SIZES) && (
                    <option value={result.all_stores.length}>
                      All ({result.all_stores.length})
                    </option>
                  )}
                </select>
              </label>
              <span style={{ color: "#6b7280", fontSize: 14 }}>
                (Total found: {result.total_stores_found})
              </span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Select stores to include in download:</strong>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {result.all_stores.slice(0, showCount).map((store) => (
                  <li key={store.store_id} style={{ margin: "8px 0" }}>
                    <label
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStoreIds.includes(store.store_id)}
                        onChange={() => handleCheckboxChange(store.store_id)}
                      />
                      {store.store_name} (ID: {store.store_id},{" "}
                      {store.distance_km} km)
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <pre
              style={{
                background: "#f4f4f4",
                padding: 14,
                borderRadius: 8,
                fontSize: 15,
                overflowX: "auto",
              }}
            >
              {JSON.stringify(
                {
                  ...result,
                  all_stores: result.all_stores.filter((store) =>
                    selectedStoreIds.includes(store.store_id)
                  ),
                  total_stores_found: selectedStoreIds.length,
                  closest_store:
                    result.closest_store &&
                    selectedStoreIds.includes(result.closest_store.store_id)
                      ? result.closest_store
                      : null,
                },
                null,
                2
              )}
            </pre>
            <button
              onClick={handleDownload}
              style={{
                background: "#059669",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 600,
                fontSize: 16,
                marginTop: 10,
                width: "100%",
                cursor:
                  selectedStoreIds.length === 0 ? "not-allowed" : "pointer",
                opacity: selectedStoreIds.length === 0 ? 0.7 : 1,
                transition: "background 0.2s",
              }}
              disabled={selectedStoreIds.length === 0}
            >
              Download Selected as JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;