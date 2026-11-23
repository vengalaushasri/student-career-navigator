import React, { useEffect, useState } from "react";
import { fetchAiCareerGuidance } from "../api";

export default function AiCareerAdvisor({ student, onSelectCareerForRoadmap }) {
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [compareTitles, setCompareTitles] = useState([]);

  const loadGuidance = () => {
    if (!student?.id) return;
    setLoading(true);
    setError("");
    fetchAiCareerGuidance(student.id)
      .then((data) => {
        setGuidance(data);
        setCompareTitles([]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGuidance();
  }, [student?.id]);

  const toggleCompare = (title) => {
    setCompareTitles((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : prev.length < 2
        ? [...prev, title]
        : [prev[1], title]
    );
  };

  const recs = guidance?.recommendations || [];
  const comparedItems = recs.filter((r) => compareTitles.includes(r.careerTitle));

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ margin: 0, color: "#0f172a" }}>AI Career Guidance & Path Comparison</h3>
          {guidance?.source && (
            <span style={{ fontSize: 12, color: "#0369a1", background: "#e0f2fe", padding: "3px 10px", borderRadius: 999, display: "inline-block", marginTop: 6 }}>
              Engine: {guidance.source}
            </span>
          )}
        </div>
        <button onClick={loadGuidance} disabled={loading}
          style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          {loading ? "Analyzing Profile..." : "Refresh AI Recommendations"}
        </button>
      </div>

      {error && <p style={{ color: "#dc2626", marginTop: 12 }}>{error}</p>}

      {guidance?.studentSummary && (
        <div style={{ background: "#f8fafc", borderLeft: "4px solid #2563eb", padding: 12, borderRadius: 6, marginTop: 14, color: "#334155", fontSize: 14 }}>
          {guidance.studentSummary}
        </div>
      )}

      {/* Side-by-Side Comparison Panel */}
      {comparedItems.length === 2 && (
        <div style={{ marginTop: 18, border: "2px solid #0284c7", borderRadius: 10, padding: 16, background: "#f0f9ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, color: "#0c4a6e" }}>Side-by-Side Career Comparison</h4>
            <button onClick={() => setCompareTitles([])} style={{ border: "none", background: "transparent", color: "#0369a1", cursor: "pointer", fontWeight: 600 }}>
              Clear Comparison
            </button>
          </div>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f172a", color: "#fff" }}>
                  <th style={thStyle}>Criteria</th>
                  <th style={thStyle}>{comparedItems[0].careerTitle}</th>
                  <th style={thStyle}>{comparedItems[1].careerTitle}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdBold}>Match Score</td>
                  <td style={tdStyle}>{comparedItems[0].matchScore}%</td>
                  <td style={tdStyle}>{comparedItems[1].matchScore}%</td>
                </tr>
                <tr>
                  <td style={tdBold}>Required Qualification</td>
                  <td style={tdStyle}>{comparedItems[0].qualificationsRequired}</td>
                  <td style={tdStyle}>{comparedItems[1].qualificationsRequired}</td>
                </tr>
                <tr>
                  <td style={tdBold}>Expected Salary (India)</td>
                  <td style={tdStyle}>{comparedItems[0].salaryRangeIndia}</td>
                  <td style={tdStyle}>{comparedItems[1].salaryRangeIndia}</td>
                </tr>
                <tr>
                  <td style={tdBold}>Industry Demand</td>
                  <td style={tdStyle}>{comparedItems[0].industryDemand}</td>
                  <td style={tdStyle}>{comparedItems[1].industryDemand}</td>
                </tr>
                <tr>
                  <td style={tdBold}>Budget Fit</td>
                  <td style={tdStyle}>{comparedItems[0].budgetFitNote}</td>
                  <td style={tdStyle}>{comparedItems[1].budgetFitNote}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Career Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 18 }}>
        {recs.map((rec) => {
          const isCompared = compareTitles.includes(rec.careerTitle);
          return (
            <div key={rec.careerTitle} style={{ border: isCompared ? "2px solid #0284c7" : "1px solid #e2e8f0", borderRadius: 10, padding: 16, background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                <h4 style={{ margin: 0, color: "#0f172a" }}>{rec.careerTitle}</h4>
                <span style={{ background: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: 12, padding: "4px 10px", borderRadius: 999 }}>
                  {rec.matchScore}% Fit
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>{rec.whySuitable}</p>

              <div style={{ fontSize: 13, color: "#1e293b", display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                <div><strong>Qualification:</strong> {rec.qualificationsRequired}</div>
                <div><strong>Salary (India):</strong> {rec.salaryRangeIndia}</div>
                <div><strong>Demand:</strong> {rec.industryDemand}</div>
                <div><strong>Budget Fit:</strong> {rec.budgetFitNote}</div>
              </div>

              {Array.isArray(rec.keySkillsNeeded) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {rec.keySkillsNeeded.map((sk) => (
                    <span key={sk} style={{ background: "#f1f5f9", color: "#334155", fontSize: 12, padding: "3px 8px", borderRadius: 6 }}>
                      {sk}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12, fontSize: 12 }}>
                <div style={{ background: "#f0fdf4", padding: 8, borderRadius: 6, color: "#166534" }}>
                  <strong>Pros:</strong>
                  <ul style={{ margin: "4px 0 0 14px", padding: 0 }}>
                    {(rec.advantages || []).map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
                <div style={{ background: "#fef2f2", padding: 8, borderRadius: 6, color: "#991b1b" }}>
                  <strong>Cons:</strong>
                  <ul style={{ margin: "4px 0 0 14px", padding: 0 }}>
                    {(rec.disadvantages || []).map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button type="button" onClick={() => toggleCompare(rec.careerTitle)}
                  style={{ flex: 1, padding: "7px 10px", borderRadius: 6, border: "1px solid #0284c7", background: isCompared ? "#0284c7" : "#fff", color: isCompared ? "#fff" : "#0284c7", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  {isCompared ? "Selected to Compare" : "Compare Path"}
                </button>
                {onSelectCareerForRoadmap && (
                  <button type="button" onClick={() => onSelectCareerForRoadmap(rec.careerTitle)}
                    style={{ flex: 1, padding: "7px 10px", borderRadius: 6, border: "none", background: "#0f172a", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Build Roadmap →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const thStyle = { padding: 10, textAlign: "left", border: "1px solid #cbd5e1" };
const tdStyle = { padding: 10, border: "1px solid #cbd5e1", color: "#334155" };
const tdBold = { ...tdStyle, fontWeight: 600, background: "#f8fafc" };
