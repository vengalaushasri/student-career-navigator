import React, { useEffect, useState } from "react";
import { fetchBudgetAnalysis, fetchSchemes } from "../api";

export default function BudgetAndSchemesHub({ student, profile }) {
  const [includeHostel, setIncludeHostel] = useState(false);
  const [budgetData, setBudgetData] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [stateFilter, setStateFilter] = useState(profile?.homeState || "ALL");

  useEffect(() => {
    if (!student?.id) return;
    fetchBudgetAnalysis(student.id, includeHostel).then(setBudgetData).catch(() => {});
  }, [student?.id, includeHostel, profile]);

  useEffect(() => {
    fetchSchemes(stateFilter).then(setSchemes).catch(() => {});
  }, [stateFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Financial & Budget Planner */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h3 style={{ margin: 0, color: "#0f172a" }}>Financial Planning & Total Cost vs. Budget Analysis</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              Your Saved Annual Budget: <strong>₹{(budgetData?.studentAnnualBudgetInr || 50000).toLocaleString("en-IN")} / year</strong>
            </p>
          </div>
          <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={includeHostel} onChange={(e) => setIncludeHostel(e.target.checked)} />
            Include Hostel & Food Expenses
          </label>
        </div>

        <div style={{ overflowX: "auto", marginTop: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a", color: "#fff" }}>
                <th style={thStyle}>Institution</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Tuition (₹)</th>
                <th style={thStyle}>Hostel/Food (₹)</th>
                <th style={thStyle}>Books/Exam (₹)</th>
                <th style={thStyle}>Total Annual Cost</th>
                <th style={thStyle}>Budget Status & Guidance</th>
              </tr>
            </thead>
            <tbody>
              {(budgetData?.evaluations || []).map((row) => (
                <tr key={row.collegeId}>
                  <td style={tdBold}>{row.collegeName} ({row.city})</td>
                  <td style={tdStyle}>{row.institutionType}</td>
                  <td style={tdStyle}>₹{row.tuitionFee.toLocaleString("en-IN")}</td>
                  <td style={tdStyle}>₹{row.hostelFoodFee.toLocaleString("en-IN")}</td>
                  <td style={tdStyle}>₹{row.booksExamTransportFee.toLocaleString("en-IN")}</td>
                  <td style={tdBold}>
                    ₹{row.totalAnnualCost.toLocaleString("en-IN")}{" "}
                    <span style={{ fontSize: 11, fontWeight: 400, color: "#64748b" }}>
                      ({row.feeIsEstimated ? "Est." : "Verified"})
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: row.withinBudget ? "#166534" : "#b45309" }}>
                    <strong>{row.withinBudget ? "Within Budget" : `Gap: ₹${row.financialGap.toLocaleString("en-IN")}/yr`}</strong>
                    <div style={{ fontSize: 12, marginTop: 2 }}>{row.recommendation}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Government Schemes & Scholarships */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h3 style={{ margin: 0, color: "#0f172a" }}>Verified Government Schemes & Scholarships</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              Official Central & State schemes with source portals and verification dates. Always verify active deadlines on the official portal.
            </p>
          </div>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1" }}>
            <option value="ALL">All India + State Schemes</option>
            <option value="Telangana">Telangana + Central</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 16 }}>
          {schemes.map((s) => (
            <div key={s.id} style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 16, background: "#f8fafc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: s.level === "CENTRAL" ? "#e0e7ff" : "#dcfce7", color: s.level === "CENTRAL" ? "#3730a3" : "#166534", padding: "3px 8px", borderRadius: 999 }}>
                  {s.level} • {s.applicableState}
                </span>
                <span style={{ fontSize: 11, color: "#475569" }}>Verified: {s.lastVerifiedDate}</span>
              </div>
              <h4 style={{ margin: "10px 0 4px", color: "#0f172a" }}>{s.name}</h4>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{s.department}</div>
              <div style={{ fontSize: 13, color: "#334155", display: "flex", flexDirection: "column", gap: 5 }}>
                <div><strong>Benefit:</strong> {s.financialBenefit}</div>
                <div><strong>Eligibility:</strong> {s.eligibilityRequirements}</div>
                <div><strong>Documents:</strong> {s.documentsRequired}</div>
                <div><strong>How to Apply:</strong> {s.applicationProcedure}</div>
                <div><strong>Deadline:</strong> {s.deadlineInfo}</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <a href={s.officialWebsite} target="_blank" rel="noreferrer"
                  style={{ display: "inline-block", padding: "6px 12px", borderRadius: 6, background: "#2563eb", color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                  Official Portal ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const thStyle = { padding: 10, textAlign: "left", border: "1px solid #cbd5e1" };
const tdStyle = { padding: 10, border: "1px solid #cbd5e1", color: "#334155" };
const tdBold = { ...tdStyle, fontWeight: 600, background: "#f8fafc" };
