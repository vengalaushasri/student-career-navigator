import React, { useEffect, useState } from "react";
import {
  fetchResources,
  fetchStudentRoadmap,
  generateStudentRoadmap,
  updateRoadmapStepStatus,
} from "../api";

export default function RoadmapAndResources({ student, initialCareer = "Full-Stack Software Developer" }) {
  const [careerInput, setCareerInput] = useState(initialCareer);
  const [steps, setSteps] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCareerInput(initialCareer);
  }, [initialCareer]);

  useEffect(() => {
    if (!student?.id) return;
    fetchStudentRoadmap(student.id).then(setSteps).catch(() => {});
    fetchResources(true).then(setResources).catch(() => {});
  }, [student?.id]);

  const handleGenerate = async () => {
    if (!student?.id) return;
    setLoading(true);
    try {
      const generated = await generateStudentRoadmap(student.id, careerInput);
      setSteps(generated);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (stepId, newStatus) => {
    const updated = await updateRoadmapStepStatus(stepId, newStatus);
    setSteps((prev) => prev.map((s) => (s.id === stepId ? updated : s)));
  };

  const completedCount = steps.filter((s) => s.status === "COMPLETED").length;
  const pct = steps.length > 0 ? Math.round((completedCount * 100) / steps.length) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Actionable Roadmap Tracker */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h3 style={{ margin: 0, color: "#0f172a" }}>Personalized Learning Roadmap & Progress Tracker</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              Generate an ordered learning plan with free courses, hands-on projects, and live status tracking.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="text"
              value={careerInput}
              onChange={(e) => setCareerInput(e.target.value)}
              placeholder="Target Career (e.g., Data Analyst)"
              style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", minWidth: 220 }}
            />
            <button type="button" onClick={handleGenerate} disabled={loading}
              style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>
          </div>
        </div>

        {steps.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span>Overall Progress ({completedCount} of {steps.length} milestones completed)</span>
              <strong>{pct}%</strong>
            </div>
            <div style={{ width: "100%", height: 10, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "#10b981", transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {steps.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: 14 }}>
              No roadmap generated yet for {student?.name}. Enter a target career above and click <strong>Generate Roadmap</strong>.
            </p>
          ) : (
            steps.map((s) => (
              <div key={s.id} style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 14, background: s.status === "COMPLETED" ? "#f0fdf4" : "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <h4 style={{ margin: 0, color: "#0f172a" }}>{s.phaseTitle}</h4>
                  <select value={s.status} onChange={(e) => handleStatusChange(s.id, e.target.value)}
                    style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #94a3b8", fontWeight: 600, fontSize: 12 }}>
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">Currently Learning</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <p style={{ margin: "6px 0", fontSize: 13, color: "#334155" }}>{s.description}</p>
                <div style={{ fontSize: 12, color: "#475569", display: "flex", flexWrap: "wrap", gap: 14 }}>
                  <span><strong>Duration:</strong> {s.estimatedDuration}</span>
                  <span><strong>Hands-on Project:</strong> {s.practicalProject}</span>
                  <a href={s.freeResourceUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 600 }}>
                    Free Resource: {s.freeResourceTitle} ↗
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Free Government & Official Learning Resources */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: "0 0 12px", color: "#0f172a" }}>Free Government & Verified Learning Platforms (SWAYAM, NPTEL, Skill India)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {resources.map((r) => (
            <div key={r.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, background: "#f8fafc" }}>
              <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#166534", padding: "3px 8px", borderRadius: 999 }}>
                FREE • {r.provider}
              </span>
              <h4 style={{ margin: "8px 0 4px", color: "#0f172a", fontSize: 15 }}>{r.title}</h4>
              <div style={{ fontSize: 12, color: "#475569" }}>
                <div><strong>Skill:</strong> {r.skillTag} • {r.estimatedDuration}</div>
                <div style={{ marginTop: 4 }}><strong>Practice Project:</strong> {r.projectIdea}</div>
              </div>
              <a href={r.resourceUrl} target="_blank" rel="noreferrer"
                style={{ display: "inline-block", marginTop: 10, fontSize: 12, color: "#2563eb", fontWeight: 600 }}>
                Open Official Platform ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
