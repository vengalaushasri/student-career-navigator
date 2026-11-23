import React from "react";

export default function ParentSummaryView({ student, profile, budgetData, schemes }) {
  if (!student) return null;

  const budget = profile?.annualBudgetInr || budgetData?.studentAnnualBudgetInr || 50000;
  const affordableColleges = (budgetData?.evaluations || []).filter((e) => e.withinBudget);

  return (
    <div style={{ background: "#fff", border: "2px solid #0f172a", borderRadius: 12, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: 999 }}>
            PARENT & FAMILY DECISION SUMMARY
          </span>
          <h3 style={{ margin: "8px 0 0", color: "#0f172a" }}>Education & Financial Overview for {student.name}</h3>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginTop: 16 }}>
        <div style={statCard}>
          <div style={statLabel}>Current Academic Stage</div>
          <div style={statVal}>{profile?.currentQualification || student.educationLevel || "Not specified"}</div>
          <div style={statSub}>{profile?.stream || "General Stream"}</div>
        </div>
        <div style={statCard}>
          <div style={statLabel}>Planned Annual Family Budget</div>
          <div style={statVal}>₹{Number(budget).toLocaleString("en-IN")} / yr</div>
          <div style={statSub}>Preferred Location: {profile?.preferredCity || profile?.homeState || "Telangana"}</div>
        </div>
        <div style={statCard}>
          <div style={statLabel}>Colleges Fitting Within Budget</div>
          <div style={statVal}>{affordableColleges.length} Institutions</div>
          <div style={statSub}>Government & Fee-Reimbursement Eligible</div>
        </div>
        <div style={statCard}>
          <div style={statLabel}>Matching Govt Scholarships</div>
          <div style={statVal}>{schemes?.length || 0} Verified Schemes</div>
          <div style={statSub}>NSP, State ePASS & AICTE Portals</div>
        </div>
      </div>

      <div style={{ marginTop: 18, background: "#f8fafc", padding: 14, borderRadius: 8, fontSize: 14, color: "#334155" }}>
        <strong>Key Takeaways for Parents:</strong>
        <ul style={{ margin: "8px 0 0 18px", lineHeight: 1.6 }}>
          <li>
            <strong>Affordable Pathways Exist:</strong> Government Universities (like JNTUH & Osmania University) and Government Polytechnics offer quality, AICTE-approved technical education between <strong>₹4,200 and ₹35,000/year</strong> in tuition.
          </li>
          <li>
            <strong>Fee Reimbursement & Scholarships:</strong> Eligible students in Telangana and across India can reduce tuition and maintenance expenses through <strong>Telangana ePASS</strong>, <strong>NSP Central Sector Scholarships</strong>, and <strong>AICTE Pragati/Saksham</strong>.
          </li>
          <li>
            <strong>Zero-Cost Skill Building:</strong> Free government platforms (<strong>NPTEL, SWAYAM, Skill India</strong>) allow {student.name} to gain job-ready coding and analytics skills without expensive private coaching.
          </li>
        </ul>
      </div>
    </div>
  );
}

const statCard = { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14 };
const statLabel = { fontSize: 12, color: "#64748b", fontWeight: 600 };
const statVal = { fontSize: 18, color: "#0f172a", fontWeight: 700, marginTop: 4 };
const statSub = { fontSize: 12, color: "#475569", marginTop: 2 };
