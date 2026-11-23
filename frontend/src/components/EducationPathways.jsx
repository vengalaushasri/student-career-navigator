import React, { useEffect, useState } from "react";
import { fetchPathways } from "../api";

export default function EducationPathways() {
  const [stage, setStage] = useState("ALL");
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPathways(stage)
      .then(setPathways)
      .finally(() => setLoading(false));
  }, [stage]);

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ margin: 0, color: "#0f172a" }}>Education Pathway Navigation (Post-10th & Beyond)</h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            Compare Intermediate + Degree, Polytechnic Diploma, ITI Vocational, and alternative routes.
          </p>
        </div>
        <select value={stage} onChange={(e) => setStage(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1" }}>
          <option value="ALL">All Starting Stages</option>
          <option value="AFTER_10TH">After 10th Standard</option>
          <option value="AFTER_12TH">After 12th / Intermediate</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: "#64748b", marginTop: 14 }}>Loading pathways...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 16, marginTop: 16 }}>
          {pathways.map((p) => {
            const totalEst = (p.approxAnnualTuitionInr || 0) + (p.approxHostelLivingInr || 0) + (p.approxBooksExamInr || 0);
            return (
              <div key={p.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "3px 8px", borderRadius: 999 }}>
                    {p.startingStage.replace("_", " ")} • {p.pathwayType.replace("_", " ")}
                  </span>
                  <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{p.duration}</span>
                </div>
                <h4 style={{ margin: "10px 0 6px", color: "#0f172a" }}>{p.title}</h4>
                <div style={{ fontSize: 13, color: "#334155", display: "flex", flexDirection: "column", gap: 5 }}>
                  <div><strong>Eligibility:</strong> {p.eligibilityCriteria}</div>
                  <div><strong>Admission:</strong> {p.admissionProcess}</div>
                  <div><strong>Subjects:</strong> {p.requiredSubjects}</div>
                  <div>
                    <strong>Approx. Annual Cost ({p.isEstimatedFee ? "Estimated" : "Verified"}):</strong>{" "}
                    Tuition ₹{p.approxAnnualTuitionInr?.toLocaleString("en-IN")} + Living ₹{p.approxHostelLivingInr?.toLocaleString("en-IN")} + Books ₹{p.approxBooksExamInr?.toLocaleString("en-IN")} = <strong>₹{totalEst.toLocaleString("en-IN")}/yr</strong>
                  </div>
                  <div><strong>Further Studies:</strong> {p.furtherStudyOptions}</div>
                  <div><strong>Jobs:</strong> {p.employmentOpportunities}</div>
                  <div style={{ color: "#166534" }}><strong>Pros:</strong> {p.pros}</div>
                  <div style={{ color: "#991b1b" }}><strong>Cons:</strong> {p.cons}</div>
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 10 }}>
                  Source: {p.sourceReference} (Verified: {p.lastVerifiedDate})
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
