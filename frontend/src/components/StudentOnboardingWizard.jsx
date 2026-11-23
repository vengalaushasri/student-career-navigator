import React, { useEffect, useState } from "react";
import { fetchStudentProfile, updateStudentProfile } from "../api";

const STEPS = [
  "1. Academics",
  "2. Interests & Goals",
  "3. Location & Mode",
  "4. Family Budget (₹)",
];

const BUDGET_PRESETS = [
  { label: "Up to ₹20,000 / yr", value: 20000 },
  { label: "Up to ₹50,000 / yr", value: 50000 },
  { label: "Up to ₹1,00,000 / yr", value: 100000 },
  { label: "Up to ₹2,00,000 / yr", value: 200000 },
];

export default function StudentOnboardingWizard({ student, onProfileSaved }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    age: "",
    currentQualification: "",
    boardOrUniversity: "",
    academicScore: "",
    stream: "",
    preferredSubjects: "",
    interestsAndPassions: "",
    preferredDomains: "",
    careerGoalType: "UNDECIDED",
    homeState: "Telangana",
    preferredCity: "",
    annualBudgetInr: "",
    willingToRelocate: true,
    learningMode: "HYBRID",
    socialCategory: "",
    additionalNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!student?.id) return;
    setLoading(true);
    setStatusMsg("");
    setErrorMsg("");
    fetchStudentProfile(student.id)
      .then((data) => {
        setForm({
          age: data.age ?? "",
          currentQualification: data.currentQualification ?? "",
          boardOrUniversity: data.boardOrUniversity ?? "",
          academicScore: data.academicScore ?? "",
          stream: data.stream ?? "",
          preferredSubjects: data.preferredSubjects ?? "",
          interestsAndPassions: data.interestsAndPassions ?? "",
          preferredDomains: data.preferredDomains ?? "",
          careerGoalType: data.careerGoalType || "UNDECIDED",
          homeState: data.homeState || "Telangana",
          preferredCity: data.preferredCity ?? "",
          annualBudgetInr: data.annualBudgetInr ?? "",
          willingToRelocate: data.willingToRelocate ?? true,
          learningMode: data.learningMode || "HYBRID",
          socialCategory: data.socialCategory ?? "",
          additionalNotes: data.additionalNotes ?? "",
        });
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, [student?.id]);

  if (!student) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const payload = {
        ...form,
        age: form.age === "" ? null : Number(form.age),
        annualBudgetInr:
          form.annualBudgetInr === "" ? null : Number(form.annualBudgetInr),
      };
      const saved = await updateStudentProfile(student.id, payload);
      setStatusMsg("Profile saved! AI guidance, budget planner, and schemes are now personalized.");
      if (onProfileSaved) onProfileSaved(saved);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={cardBox}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h3 style={{ margin: 0, color: "#0f172a" }}>Student Profile & Requirement Analysis</h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            Optional fields—fill what you know to tailor careers, budget analysis, and schemes for <strong>{student.name}</strong>.
          </p>
        </div>
        <span style={badgeBlue}>Step {step + 1} of {STEPS.length}</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        {STEPS.map((label, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(idx)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: idx === step ? "2px solid #2563eb" : "1px solid #cbd5e1",
              background: idx === step ? "#eff6ff" : "#f8fafc",
              color: idx === step ? "#1e40af" : "#475569",
              fontWeight: idx === step ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#64748b", marginTop: 16 }}>Loading profile...</p>
      ) : (
        <form onSubmit={handleSave} style={{ marginTop: 16 }}>
          {step === 0 && (
            <div style={gridStyle}>
              <label style={labelStyle}>
                Age
                <input type="number" min="13" max="60" placeholder="e.g., 18" value={form.age}
                  onChange={(e) => handleChange("age", e.target.value)} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                Current Qualification
                <select value={form.currentQualification}
                  onChange={(e) => handleChange("currentQualification", e.target.value)} style={inputStyle}>
                  <option value="">Select qualification...</option>
                  <option value="10th">10th Standard (SSC)</option>
                  <option value="Intermediate (12th)">Intermediate / 10+2</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                  <option value="ITI">ITI / Vocational</option>
                  <option value="Undergraduate">Undergraduate (B.Tech / B.Sc / B.Com / BA)</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </label>
              <label style={labelStyle}>
                Stream / Branch
                <input type="text" placeholder="e.g., MPC, BiPC, MEC, CSE" value={form.stream}
                  onChange={(e) => handleChange("stream", e.target.value)} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                Board / University
                <input type="text" placeholder="e.g., TS BIE, CBSE, JNTUH" value={form.boardOrUniversity}
                  onChange={(e) => handleChange("boardOrUniversity", e.target.value)} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                Academic Score (% or CGPA)
                <input type="text" placeholder="e.g., 85% or 8.4 CGPA" value={form.academicScore}
                  onChange={(e) => handleChange("academicScore", e.target.value)} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                Preferred Subjects
                <input type="text" placeholder="e.g., Mathematics, Coding, Biology" value={form.preferredSubjects}
                  onChange={(e) => handleChange("preferredSubjects", e.target.value)} style={inputStyle} />
              </label>
            </div>
          )}

          {step === 1 && (
            <div style={gridStyle}>
              <label style={labelStyle}>
                Primary Career Goal
                <select value={form.careerGoalType}
                  onChange={(e) => handleChange("careerGoalType", e.target.value)} style={inputStyle}>
                  <option value="UNDECIDED">Confused / Need Career Guidance</option>
                  <option value="HIGHER_EDUCATION">Pursue Higher Education (Degree / PG)</option>
                  <option value="EARLY_EARNING">Start Earning Early (Diploma / Job-oriented)</option>
                  <option value="PRIVATE_JOB">Private Sector / Tech / Corporate Job</option>
                  <option value="GOVT_JOB">Government Job / Competitive Exams</option>
                  <option value="ENTREPRENEURSHIP">Start a Business / Entrepreneurship</option>
                </select>
              </label>
              <label style={labelStyle}>
                Preferred Career Domains
                <input type="text" placeholder="e.g., Software, Data Analytics, Civil Services" value={form.preferredDomains}
                  onChange={(e) => handleChange("preferredDomains", e.target.value)} style={inputStyle} />
              </label>
              <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                Interests, Strengths & Passions
                <textarea rows={3} placeholder="What do you enjoy learning or building?"
                  value={form.interestsAndPassions}
                  onChange={(e) => handleChange("interestsAndPassions", e.target.value)} style={inputStyle} />
              </label>
            </div>
          )}

          {step === 2 && (
            <div style={gridStyle}>
              <label style={labelStyle}>
                Home State
                <input type="text" placeholder="e.g., Telangana" value={form.homeState}
                  onChange={(e) => handleChange("homeState", e.target.value)} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                Preferred Study City / District
                <input type="text" placeholder="e.g., Hyderabad, Warangal" value={form.preferredCity}
                  onChange={(e) => handleChange("preferredCity", e.target.value)} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                Preferred Learning Mode
                <select value={form.learningMode}
                  onChange={(e) => handleChange("learningMode", e.target.value)} style={inputStyle}>
                  <option value="OFFLINE">Offline (Regular College)</option>
                  <option value="HYBRID">Hybrid (College + Online Skills)</option>
                  <option value="ONLINE">Online / Distance Learning</option>
                </select>
              </label>
              <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8, marginTop: 22 }}>
                <input type="checkbox" checked={!!form.willingToRelocate}
                  onChange={(e) => handleChange("willingToRelocate", e.target.checked)} />
                Willing to relocate for quality college/job
              </label>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {BUDGET_PRESETS.map((preset) => (
                  <button key={preset.value} type="button"
                    onClick={() => handleChange("annualBudgetInr", preset.value)}
                    style={{
                      padding: "6px 12px", borderRadius: 999,
                      border: Number(form.annualBudgetInr) === preset.value ? "2px solid #059669" : "1px solid #cbd5e1",
                      background: Number(form.annualBudgetInr) === preset.value ? "#ecfdf5" : "#fff",
                      color: "#065f46", cursor: "pointer", fontSize: 13,
                    }}>
                    {preset.label}
                  </button>
                ))}
              </div>
              <div style={gridStyle}>
                <label style={labelStyle}>
                  Annual Family Education Budget (₹ INR)
                  <input type="number" min="0" step="1000" placeholder="e.g., 50000"
                    value={form.annualBudgetInr}
                    onChange={(e) => handleChange("annualBudgetInr", e.target.value)} style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Category (Optional — for State/Central Scholarship matching)
                  <select value={form.socialCategory}
                    onChange={(e) => handleChange("socialCategory", e.target.value)} style={inputStyle}>
                    <option value="">Prefer not to say / General</option>
                    <option value="General / EWS">General / EWS</option>
                    <option value="OBC / BC">OBC / BC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="Minority">Minority</option>
                  </select>
                </label>
                <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                  Financial / Scholarship Notes (Optional)
                  <input type="text" placeholder="e.g., Need hostel support or fee reimbursement"
                    value={form.additionalNotes}
                    onChange={(e) => handleChange("additionalNotes", e.target.value)} style={inputStyle} />
                </label>
              </div>
            </div>
          )}

          {errorMsg && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 12 }}>{errorMsg}</p>}
          {statusMsg && <p style={{ color: "#059669", fontSize: 13, marginTop: 12, fontWeight: 500 }}>{statusMsg}</p>}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            <button type="button" disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              style={secondaryBtn}>
              Previous
            </button>
            <div style={{ display: "flex", gap: 10 }}>
              {step < STEPS.length - 1 && (
                <button type="button"
                  onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                  style={outlineBtn}>
                  Next Step →
                </button>
              )}
              <button type="submit" disabled={saving} style={primaryBtn}>
                {saving ? "Saving..." : "Save Student Profile"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

const cardBox = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 20 };
const badgeBlue = { fontSize: 12, background: "#eff6ff", color: "#1d4ed8", padding: "4px 10px", borderRadius: 999, fontWeight: 600 };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 };
const labelStyle = { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 500, color: "#334155" };
const inputStyle = { padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, fontFamily: "inherit" };
const primaryBtn = { padding: "8px 18px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer" };
const outlineBtn = { padding: "8px 16px", borderRadius: 8, border: "1px solid #2563eb", background: "#eff6ff", color: "#1d4ed8", fontWeight: 600, cursor: "pointer" };
const secondaryBtn = { padding: "8px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" };
