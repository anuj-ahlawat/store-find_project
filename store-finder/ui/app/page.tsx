"use client";
import { FaLocationCrosshairs, FaDownload } from "react-icons/fa6";
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

const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
    <div style={{
      border: "4px solid #e5e7eb",
      borderTop: "4px solid #2563eb",
      borderRadius: "50%",
      width: 36,
      height: 36,
      animation: "spin 1s linear infinite"
    }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f6f8fa" }}>
      {/* Header */}
      <header style={{
        background: "linear-gradient(90deg, #2563eb 60%, #1e40af 100%)",
        color: "#fff",
        padding: "18px 0 14px 0",
        textAlign: "center",
        fontWeight: 800,
        fontSize: 28,
        letterSpacing: 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        borderBottom: "1.5px solid #e5e7eb",
        minHeight: 64,
        boxSizing: "border-box"
      }}>
        <FaLocationCrosshairs style={{ fontSize: 28, color: "#fff", flexShrink: 0 }} />
        <span style={{ fontWeight: 800, fontSize: 24, lineHeight: 1.1 }}>Nearest Store Finder</span>
      </header>
      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: 36,
          maxWidth: 600,
          width: "100%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}>
          <h2 style={{ textAlign: "center", marginBottom: 8, fontWeight: 700, fontSize: 24, color: "#2563eb" }}>
            Find Nearest Stores
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <button type="button" onClick={handleUseCurrentLocation} disabled={loading} style={{
              backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 18, marginBottom: 8, gap: "8px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "center", transition: "background 0.2s"
            }}>
              <FaLocationCrosshairs style={{ marginRight: 8 }} />
              Use Current Location
            </button>
            <label style={{ fontWeight: 500 }}>
              Latitude:
              <input type="number" value={lat} onChange={(e) => setLat(e.target.value)} required step="any" style={{ width: "100%", padding: "10px 12px", marginTop: 6, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, marginBottom: 4 }} />
            </label>
            <label style={{ fontWeight: 500 }}>
              Longitude:
              <input type="number" value={lon} onChange={(e) => setLon(e.target.value)} required step="any" style={{ width: "100%", padding: "10px 12px", marginTop: 6, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, marginBottom: 4 }} />
            </label>
            <label style={{ fontWeight: 500 }}>
              Radius (km):
              <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} required step="any" min="0" style={{ width: "100%", padding: "10px 12px", marginTop: 6, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, marginBottom: 4 }} />
            </label>
            <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 600, fontSize: 20, marginTop: 8, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "background 0.2s, opacity 0.2s", alignSelf: "center" }} disabled={loading}>
              {loading ? <Spinner /> : "Submit"}
            </button>
          </form>
          {error && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: 8, padding: 12, marginTop: 0, fontWeight: 500, textAlign: "center", border: "1px solid #fca5a5" }}>
              {error}
            </div>
          )}
          {result && (
            <div style={{ marginTop: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <label style={{ fontWeight: 500, marginRight: 8 }}>
                    Show only:
                    <select value={showCount} onChange={(e) => {
                      const newCount = Number(e.target.value);
                      setShowCount(newCount);
                      if (result) {
                        setSelectedStoreIds(result.all_stores.slice(0, newCount).map((store: Store) => store.store_id));
                      }
                    }} style={{ marginLeft: 8, padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 15 }}>
                      {PAGE_SIZES.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                      {result.all_stores.length > Math.max(...PAGE_SIZES) && (
                        <option value={result.all_stores.length}>All ({result.all_stores.length})</option>
                      )}
                    </select>
                  </label>
                  <span style={{ color: "#6b7280", fontSize: 14 }}>(Total found: {result.total_stores_found})</span>
                </div>
                <button onClick={handleDownload} style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 16, display: "flex", alignItems: "center", gap: 8, cursor: selectedStoreIds.length === 0 ? "not-allowed" : "pointer", opacity: selectedStoreIds.length === 0 ? 0.7 : 1, transition: "background 0.2s" }} disabled={selectedStoreIds.length === 0}>
                  <FaDownload /> Download Selected as JSON
                </button>
              </div>
              <div style={{ overflowX: "auto", marginTop: 12, maxHeight: 350, overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                  <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                      <th style={{ padding: "8px 6px", borderBottom: "1px solid #e5e7eb" }}></th>
                      <th style={{ padding: "8px 6px", borderBottom: "1px solid #e5e7eb" }}>Store Name</th>
                      <th style={{ padding: "8px 6px", borderBottom: "1px solid #e5e7eb" }}>ID</th>
                      <th style={{ padding: "8px 6px", borderBottom: "1px solid #e5e7eb" }}>Distance (km)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.all_stores.slice(0, showCount).map((store, idx) => (
                      <tr key={store.store_id} style={{ background: result.closest_store && store.store_id === result.closest_store.store_id ? "#dbeafe" : idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                        <td style={{ textAlign: "center" }}>
                          <input type="checkbox" checked={selectedStoreIds.includes(store.store_id)} onChange={() => handleCheckboxChange(store.store_id)} />
                        </td>
                        <td style={{ padding: "8px 6px" }}>{store.store_name}</td>
                        <td style={{ padding: "8px 6px" }}>{store.store_id}</td>
                        <td style={{ padding: "8px 6px" }}>{store.distance_km}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer style={{
        background: "#fff",
        color: "#64748b",
        textAlign: "center",
        padding: "18px 0 14px 0",
        fontSize: 15,
        letterSpacing: 0.5,
        borderTop: "1.5px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
      }}>
        <span style={{ fontSize: 17, verticalAlign: "middle" }}>&copy;</span> {new Date().getFullYear()} Nearest Store Finder. All rights reserved.
      </footer>
    </div>
  );
};

export default Page;