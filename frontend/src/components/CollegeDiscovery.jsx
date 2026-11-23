import React, { useEffect, useState } from "react";
import { fetchColleges } from "../api";

export default function CollegeDiscovery({ defaultCity = "" }) {
  const [city, setCity] = useState(defaultCity);
  const [type, setType] = useState("ALL");
  const [maxBudget, setMaxBudget] = useState("");
  const [colleges, setColleges] = useState([]);

  const loadColleges = () => {
    fetchColleges({ city, type, maxBudget }).then(setColleges).catch(() => {});
  };

  useEffect(() => {
    loadColleges();
  }, [type]);

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
      <h3 style={{ margin: 0, color: "#0f172a" }}>College & Institution Discovery (Location & Budget Filters)</h3>
      <p style={{ margin: "4px 0 14px", fontSize: 13, color: "#64748b" }}>
        Filter accredited Government, Aided, and Private institutions by city (e.g., Hyderabad, Warangal), type, and annual tuition budget.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search city or state (e.g., Hyderabad, Warangal)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", minWidth: 240 }}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1" }}>
          <option value="ALL">All Institution Types</option>
          <option value="GOVERNMENT">Government (Low Fee)</option>
          <option value="PRIVATE">Private</option>
        </select>
        <input
          type="number"
          placeholder="Max Annual Tuition (₹)"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", width: 180 }}
        />
        <button type="button" onClick={loadColleges}
          style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Search Colleges
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {colleges.map((c) => (
          <div key={c.id} style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 16, background: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, background: c.institutionType === "GOVERNMENT" ? "#dcfce7" : "#fef3c7", color: c.institutionType === "GOVERNMENT" ? "#166534" : "#92400e", padding: "3px 8px", borderRadius: 999 }}>
                {c.institutionType}
              </span>
              <span style={{ fontSize: 12, color: "#475569" }}>{c.city}, {c.state}</span>
            </div>
            <h4 style={{ margin: "10px 0 6px", color: "#0f172a" }}>{c.name}</h4>
            <div style={{ fontSize: 13, color: "#334155", display: "flex", flexDirection: "column", gap: 5 }}>
              <div><strong>Courses:</strong> {c.coursesOffered} ({c.specializations})</div>
              <div><strong>Accreditation:</strong> {c.accreditation}</div>
              <div><strong>Entrance Exam:</strong> {c.entranceExam}</div>
              <div>
                <strong>Annual Tuition ({c.feeIsEstimated ? "Est." : "Verified"}):</strong> ₹{c.annualTuitionFeeInr?.toLocaleString("en-IN")} |{" "}
                <strong>Hostel/Food:</strong> ₹{c.annualHostelFoodFeeInr?.toLocaleString("en-IN")}
              </div>
              <div><strong>Hostel:</strong> {c.hostelAvailable ? "Available" : "Not Available"}</div>
              <div><strong>Placements:</strong> {c.placementInfo}</div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <a href={c.officialWebsite} target="_blank" rel="noreferrer"
                style={{ padding: "6px 12px", borderRadius: 6, background: "#0f172a", color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                Official Website ↗
              </a>
              <a href={c.mapsUrl} target="_blank" rel="noreferrer"
                style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #2563eb", color: "#1d4ed8", textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                Google Maps 📍
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
