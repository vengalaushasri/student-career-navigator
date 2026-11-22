const BASE_URL = "http://localhost:8080/api";

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error("Server error " + response.status);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function withJson(method, body) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// Careers
export const getCareers = () => request("/careers");
export const createCareer = (career) =>
  request("/careers", withJson("POST", career));
export const updateCareer = (id, career) =>
  request(`/careers/${id}`, withJson("PUT", career));
export const deleteCareer = (id) =>
  request(`/careers/${id}`, { method: "DELETE" });
export const addCareerSkill = (careerId, skillId) =>
  request(`/careers/${careerId}/skills/${skillId}`, { method: "PUT" });
export const removeCareerSkill = (careerId, skillId) =>
  request(`/careers/${careerId}/skills/${skillId}`, { method: "DELETE" });
export const matchCareers = (skillIds) =>
  request(`/careers/match?skillIds=${skillIds.join(",")}`);

// Skills
export const getSkills = () => request("/skills");
export const createSkill = (skill) =>
  request("/skills", withJson("POST", skill));

// Students
export const getStudents = () => request("/students");
export const createStudent = (student) =>
  request("/students", withJson("POST", student));
export const addStudentSkill = (studentId, skillId) =>
  request(`/students/${studentId}/skills/${skillId}`, { method: "PUT" });
export const removeStudentSkill = (studentId, skillId) =>
  request(`/students/${studentId}/skills/${skillId}`, { method: "DELETE" });
