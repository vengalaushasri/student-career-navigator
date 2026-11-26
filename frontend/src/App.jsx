import React, { useEffect, useState } from "react";
import {
  createCareer,
  createSkill,
  fetchBudgetAnalysis,
  fetchCareers,
  fetchSchemes,
  fetchSkills,
  fetchStudentProfile,
  fetchStudents,
} from "./api";
import AuthPage from "./components/AuthPage";
import StudentProfile from "./components/StudentProfile";
import CareerList from "./components/CareerList";
import CareerForm from "./components/CareerForm";
import SkillManager from "./components/SkillManager";
import StudentOnboardingWizard from "./components/StudentOnboardingWizard";
import AiCareerAdvisor from "./components/AiCareerAdvisor";
import EducationPathways from "./components/EducationPathways";
import BudgetAndSchemesHub from "./components/BudgetAndSchemesHub";
import CollegeDiscovery from "./components/CollegeDiscovery";
import RoadmapAndResources from "./components/RoadmapAndResources";
import ParentSummaryView from "./components/ParentSummaryView";

const BASE_TABS = [
  { id: "dashboard", label: "Profile & Skills", badge: "Step 1" },
  { id: "ai-advisor", label: "AI Career Match", badge: "AI" },
  { id: "pathways", label: "10th & 12th Pathways" },
  { id: "budget-schemes", label: "Budget & Govt Schemes" },
  { id: "colleges", label: "College Finder" },
  { id: "roadmap", label: "Skill Roadmap" },
  { id: "parent", label: "Parent Guide" },
];

export default function App() {
  const [authUser, setAuthUser] = useState(() => {
    const token = localStorage.getItem("cn_token");
    const saved = localStorage.getItem("cn_user");
    return token && saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [selectedRoadmapCareer, setSelectedRoadmapCareer] = useState("Full-Stack Software Developer");
  const [error, setError] = useState("");

  const handleAuthSuccess = (data) => {
    localStorage.setItem("cn_token", data.token);
    localStorage.setItem("cn_user", JSON.stringify(data));
    setError("");
    setAuthUser(data);
    if (data.studentId) {
      setSelectedStudentId(Number(data.studentId));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cn_token");
    localStorage.removeItem("cn_user");
    setAuthUser(null);
    setSelectedStudentId(null);
    setProfile(null);
    setError("");
    setActiveTab("dashboard");
  };

  const refreshAllData = async () => {
    try {
      setError("");
      const [studentList, careerList, skillList, schemeList] = await Promise.all([
        fetchStudents(),
        fetchCareers(),
        fetchSkills(),
        fetchSchemes("ALL"),
      ]);
      setStudents(studentList);
      setCareers(careerList);
      setSkills(skillList);
      setSchemes(schemeList);
      if (studentList.length > 0 && !selectedStudentId) {
        const preferred = authUser?.studentId
          ? studentList.find((s) => s.id === Number(authUser.studentId))
          : null;
        setSelectedStudentId(preferred ? preferred.id : studentList[0].id);
      }
    } catch (err) {
      setError("Backend connection error: " + err.message);
    }
  };

  useEffect(() => {
    if (authUser) {
      refreshAllData();
    }
  }, [authUser]);

  useEffect(() => {
    if (!authUser || !selectedStudentId) return;
    fetchStudentProfile(selectedStudentId).then(setProfile).catch(() => {});
    fetchBudgetAnalysis(selectedStudentId, false).then(setBudgetData).catch(() => {});
  }, [authUser, selectedStudentId]);

  if (!authUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const tabs =
    authUser.role === "ADMIN"
      ? [...BASE_TABS, { id: "admin", label: "Manage Catalog", badge: "ADMIN" }]
      : BASE_TABS;

  const selectedStudent = students.find((s) => s.id === Number(selectedStudentId)) || null;

  const handleCreateCareer = async (newCareer) => {
    const created = await createCareer(newCareer);
    setCareers((prev) => [...prev, created]);
  };

  const handleCreateSkill = async (newSkill) => {
    const created = await createSkill(newSkill);
    setSkills((prev) => [...prev, created]);
  };

  const formatInr = (val) =>
    val != null && val !== ""
      ? `₹${Number(val).toLocaleString("en-IN")}/yr`
      : "Not set";

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      {/* Sticky Naukri / Ed-Tech Top Bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          {/* Brand Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #275df5 0%, #4f46e5 100%)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 18,
                boxShadow: "0 4px 12px rgba(39, 93, 245, 0.28)",
              }}
            >
              CN
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", letterSpacing: "-0.02em" }}>
                  CareerNavigator
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: "#eff6ff",
                    color: "#275df5",
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid #bfdbfe",
                  }}
                >
                  {authUser.role}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Signed in as {authUser.fullName} ({authUser.email})
              </p>
            </div>
          </div>

          {/* Active Student Pill Switcher + Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {authUser.role === "ADMIN" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f8fafc",
                  padding: "6px 12px",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Student:</span>
                <select
                  value={selectedStudentId || ""}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontWeight: 700,
                    fontSize: 13,
                    background: "#fff",
                  }}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              selectedStudent && (
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "6px 12px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Profile: {selectedStudent.name}
                </div>
              )
            )}

            <button
              onClick={handleLogout}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#b91c1c",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Modern Pill Navigation Strip */}
        <nav
          className="nav-scroll"
          style={{
            maxWidth: 1240,
            margin: "12px auto 0",
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 15px",
                  borderRadius: 999,
                  border: isActive ? "1px solid #275df5" : "1px solid transparent",
                  background: isActive ? "#275df5" : "#f1f5f9",
                  color: isActive ? "#ffffff" : "#334155",
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  boxShadow: isActive ? "0 4px 10px rgba(39, 93, 245, 0.24)" : "none",
                }}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: 999,
                      background: isActive ? "rgba(255,255,255,0.22)" : "#e2e8f0",
                      color: isActive ? "#fff" : "#475569",
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Naukri-Style Student Snapshot Banner */}
      {selectedStudent && (
        <div style={{ maxWidth: 1240, margin: "18px auto 0", padding: "0 24px" }}>
          <div
            style={{
              background: "linear-gradient(120deg, #0f172a 0%, #1e293b 60%, #1e3a8a 100%)",
              color: "#fff",
              borderRadius: 16,
              padding: "18px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#93c5fd", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Active Career Profile
              </div>
              <h2 style={{ margin: "4px 0", fontSize: 20, fontWeight: 800 }}>
                Welcome back, {selectedStudent.name}
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1" }}>
                {profile?.currentQualification || "Complete your academic profile"}
                {profile?.stream ? ` • ${profile.stream}` : ""}
                {profile?.preferredCity ? ` • Target City: ${profile.preferredCity}` : ""}
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.08)", padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Annual Budget</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#34d399" }}>
                  {formatInr(profile?.annualBudgetInr)}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Verified Skills</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#60a5fa" }}>
                  {(selectedStudent.skills || []).length} Skills
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Matched Schemes</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fbbf24" }}>
                  {schemes.length} Available
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main style={{ maxWidth: 1240, margin: "20px auto", padding: "0 24px 48px" }}>
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "12px 16px",
              borderRadius: 12,
              marginBottom: 18,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <StudentOnboardingWizard
              student={selectedStudent}
              onProfileSaved={(saved) => {
                setProfile(saved);
                if (selectedStudentId) {
                  fetchBudgetAnalysis(selectedStudentId, false).then(setBudgetData).catch(() => {});
                }
              }}
            />
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px -2px rgba(15, 23, 42, 0.06)",
              }}
            >
              <StudentProfile
                students={students}
                skills={skills}
                careers={careers}
                onStudentsChanged={refreshAllData}
                onError={setError}
              />
            </div>
          </div>
        )}

        {activeTab === "ai-advisor" && (
          <AiCareerAdvisor
            student={selectedStudent}
            onSelectCareerForRoadmap={(careerTitle) => {
              setSelectedRoadmapCareer(careerTitle);
              setActiveTab("roadmap");
            }}
          />
        )}

        {activeTab === "pathways" && <EducationPathways />}

        {activeTab === "budget-schemes" && (
          <BudgetAndSchemesHub student={selectedStudent} profile={profile} />
        )}

        {activeTab === "colleges" && (
          <CollegeDiscovery defaultCity={profile?.preferredCity || ""} />
        )}

        {activeTab === "roadmap" && (
          <RoadmapAndResources
            student={selectedStudent}
            initialCareer={selectedRoadmapCareer}
          />
        )}

        {activeTab === "parent" && (
          <ParentSummaryView
            student={selectedStudent}
            profile={profile}
            budgetData={budgetData}
            schemes={schemes}
          />
        )}

        {activeTab === "admin" && authUser.role === "ADMIN" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <CareerForm
              skills={skills}
              onCreateCareer={handleCreateCareer}
              onCareerCreated={refreshAllData}
              onRefresh={refreshAllData}
            />
            <SkillManager
              skills={skills}
              onCreateSkill={handleCreateSkill}
              onSkillCreated={refreshAllData}
              onRefresh={refreshAllData}
            />
            <CareerList
              careers={careers}
              skills={skills}
              studentSkills={selectedStudent?.skills || []}
              onRefresh={refreshAllData}
            />
          </div>
        )}
      </main>
    </div>
  );
}
