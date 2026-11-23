const API_BASE_URL = "http://localhost:8080/api";

function authHeaders(extra = {}) {
  const token = localStorage.getItem("cn_token");
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Invalid email or password");
  return data;
}

export async function registerUser(payload) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

export async function fetchStudents() {
  const res = await fetch(`${API_BASE_URL}/students`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load students");
  return res.json();
}

export async function createStudent(student) {
  const res = await fetch(`${API_BASE_URL}/students`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
}

export async function updateStudent(studentId, student) {
  const res = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
}

export async function deleteStudent(studentId) {
  const res = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete student");
}

export async function fetchCareers() {
  const res = await fetch(`${API_BASE_URL}/careers`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load careers");
  return res.json();
}

export async function createCareer(career) {
  const res = await fetch(`${API_BASE_URL}/careers`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(career),
  });
  if (!res.ok) throw new Error("Failed to create career (Admin role required)");
  return res.json();
}

export async function updateCareer(careerId, career) {
  const res = await fetch(`${API_BASE_URL}/careers/${careerId}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(career),
  });
  if (!res.ok) throw new Error("Failed to update career (Admin role required)");
  return res.json();
}

export async function deleteCareer(careerId) {
  const res = await fetch(`${API_BASE_URL}/careers/${careerId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete career (Admin role required)");
}

export async function fetchSkills() {
  const res = await fetch(`${API_BASE_URL}/skills`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load skills");
  return res.json();
}

export async function createSkill(skill) {
  const res = await fetch(`${API_BASE_URL}/skills`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(skill),
  });
  if (!res.ok) throw new Error("Failed to create skill (Admin role required)");
  return res.json();
}

export async function updateSkill(skillId, skill) {
  const res = await fetch(`${API_BASE_URL}/skills/${skillId}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(skill),
  });
  if (!res.ok) throw new Error("Failed to update skill (Admin role required)");
  return res.json();
}

export async function deleteSkill(skillId) {
  const res = await fetch(`${API_BASE_URL}/skills/${skillId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete skill (Admin role required)");
}

export async function addSkillToStudent(studentId, skillId) {
  const res = await fetch(`${API_BASE_URL}/students/${studentId}/skills/${skillId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to add skill");
  return res.json();
}

export async function removeSkillFromStudent(studentId, skillId) {
  const res = await fetch(`${API_BASE_URL}/students/${studentId}/skills/${skillId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove skill");
  return res.json();
}

export async function addCareerSkill(careerId, skillId) {
  const res = await fetch(`${API_BASE_URL}/careers/${careerId}/skills/${skillId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to link skill to career");
  return res.json();
}

export async function removeCareerSkill(careerId, skillId) {
  const res = await fetch(`${API_BASE_URL}/careers/${careerId}/skills/${skillId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove skill from career");
  return res.json();
}

export async function matchCareers(skillIds) {
  const ids = Array.isArray(skillIds) ? skillIds : [];
  const res = await fetch(`${API_BASE_URL}/careers/match?skillIds=${ids.join(",")}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const careersRes = await fetch(`${API_BASE_URL}/careers`, { headers: authHeaders() });
    const careers = await careersRes.json();
    const ownedSet = new Set(ids.map(Number));
    return careers
      .map((career) => {
        const req = career.skills || [];
        const matchedSkills = req.filter((s) => ownedSet.has(Number(s.id)));
        const missingSkills = req.filter((s) => !ownedSet.has(Number(s.id)));
        const matchPercent = req.length ? Math.round((matchedSkills.length * 100) / req.length) : 0;
        return { career, matchPercent, matchedSkills, missingSkills };
      })
      .filter((m) => m.matchedSkills.length > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent);
  }
  return res.json();
}

export async function fetchStudentProfile(studentId) {
  const res = await fetch(`${API_BASE_URL}/students/${studentId}/profile`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load student profile");
  return res.json();
}

export async function updateStudentProfile(studentId, profileData) {
  const res = await fetch(`${API_BASE_URL}/students/${studentId}/profile`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to save profile");
  }
  return res.json();
}

export async function fetchAiCareerGuidance(studentId) {
  const res = await fetch(`${API_BASE_URL}/students/${studentId}/ai-guidance`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to generate AI career guidance");
  return res.json();
}

export async function fetchPathways(stage = "ALL") {
  const res = await fetch(`${API_BASE_URL}/navigator/pathways?stage=${encodeURIComponent(stage)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load education pathways");
  return res.json();
}

export async function fetchSchemes(state = "ALL") {
  const res = await fetch(`${API_BASE_URL}/navigator/schemes?state=${encodeURIComponent(state)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load government schemes");
  return res.json();
}

export async function fetchColleges({ city = "", type = "ALL", maxBudget = "" } = {}) {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (type && type !== "ALL") params.set("type", type);
  if (maxBudget) params.set("maxBudget", maxBudget);
  const res = await fetch(`${API_BASE_URL}/navigator/colleges?${params.toString()}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load colleges");
  return res.json();
}

export async function fetchResources(freeOnly = false) {
  const res = await fetch(`${API_BASE_URL}/navigator/resources?freeOnly=${freeOnly}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load learning resources");
  return res.json();
}

export async function fetchBudgetAnalysis(studentId, includeHostel = false) {
  const res = await fetch(`${API_BASE_URL}/navigator/budget-analysis/${studentId}?includeHostel=${includeHostel}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to analyze budget");
  return res.json();
}

export async function fetchStudentRoadmap(studentId) {
  const res = await fetch(`${API_BASE_URL}/navigator/roadmap/${studentId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load roadmap");
  return res.json();
}

export async function generateStudentRoadmap(studentId, career) {
  const res = await fetch(
    `${API_BASE_URL}/navigator/roadmap/${studentId}/generate?career=${encodeURIComponent(career)}`,
    { method: "POST", headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Failed to generate roadmap");
  return res.json();
}

export async function updateRoadmapStepStatus(stepId, status) {
  const res = await fetch(
    `${API_BASE_URL}/navigator/roadmap/step/${stepId}/status?status=${encodeURIComponent(status)}`,
    { method: "PATCH", headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Failed to update step status");
  return res.json();
}

export const getStudents = fetchStudents;
export const getCareers = fetchCareers;
export const getSkills = fetchSkills;
export const addStudentSkill = addSkillToStudent;
export const removeStudentSkill = removeSkillFromStudent;
