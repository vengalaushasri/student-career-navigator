import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/careers";
const SKILLS_URL = "http://localhost:8080/api/skills";
const STUDENTS_URL = "http://localhost:8080/api/students";

function App() {
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [matches, setMatches] = useState(null);

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) || null;

  const loadCareers = () => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        return response.json();
      })
      .then((data) => {
        setCareers(data);
        setError("");
      })
      .catch(() => setError("Could not reach the backend"));
  };

  const loadSkills = () => {
    fetch(SKILLS_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        return response.json();
      })
      .then((data) => setSkills(data))
      .catch(() => setError("Could not load skills"));
  };

  const loadStudents = () => {
    fetch(STUDENTS_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        return response.json();
      })
      .then((data) => setStudents(data))
      .catch(() => setError("Could not load students"));
  };

  useEffect(() => {
    loadCareers();
    loadSkills();
    loadStudents();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        return response.json();
      })
      .then(() => {
        resetForm();
        setError("");
        loadCareers();
      })
      .catch((err) => setError("Could not save the career: " + err.message));
  };

  const handleEdit = (career) => {
    setEditingId(career.id);
    setTitle(career.title);
    setDescription(career.description || "");
    setCategory(career.category || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        if (editingId === id) resetForm();
        setError("");
        setMatches(null);
        loadCareers();
      })
      .catch((err) => setError("Could not delete the career: " + err.message));
  };

  const handleAddSkill = (careerId, skillId) => {
    fetch(`${API_URL}/${careerId}/skills/${skillId}`, { method: "PUT" })
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        setError("");
        setMatches(null);
        loadCareers();
      })
      .catch((err) => setError("Could not add the skill: " + err.message));
  };

  const handleRemoveSkill = (careerId, skillId) => {
    fetch(`${API_URL}/${careerId}/skills/${skillId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        setError("");
        setMatches(null);
        loadCareers();
      })
      .catch((err) => setError("Could not remove the skill: " + err.message));
  };

  const handleCreateSkill = (event) => {
    event.preventDefault();

    fetch(SKILLS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: skillName.trim(), category: skillCategory }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "the skill name may already exist (server error " +
              response.status +
              ")"
          );
        }
        return response.json();
      })
      .then(() => {
        setSkillName("");
        setSkillCategory("");
        setError("");
        loadSkills();
      })
      .catch((err) => setError("Could not create the skill: " + err.message));
  };

  const handleCreateStudent = (event) => {
    event.preventDefault();

    fetch(STUDENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: studentName.trim(),
        email: studentEmail.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "the email may already be used (server error " +
              response.status +
              ")"
          );
        }
        return response.json();
      })
      .then((created) => {
        setStudentName("");
        setStudentEmail("");
        setSelectedStudentId(created.id);
        setMatches(null);
        setError("");
        loadStudents();
      })
      .catch((err) => setError("Could not create the student: " + err.message));
  };

  const handleSelectStudent = (value) => {
    setSelectedStudentId(value === "" ? null : Number(value));
    setMatches(null);
  };

  const handleStudentAddSkill = (skillId) => {
    fetch(`${STUDENTS_URL}/${selectedStudentId}/skills/${skillId}`, {
      method: "PUT",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        setError("");
        setMatches(null);
        loadStudents();
      })
      .catch((err) => setError("Could not add the skill: " + err.message));
  };

  const handleStudentRemoveSkill = (skillId) => {
    fetch(`${STUDENTS_URL}/${selectedStudentId}/skills/${skillId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        setError("");
        setMatches(null);
        loadStudents();
      })
      .catch((err) => setError("Could not remove the skill: " + err.message));
  };

  const handleShowRecommendations = () => {
    const ids = selectedStudent.skills.map((skill) => skill.id).join(",");

    fetch(`${API_URL}/match?skillIds=${ids}`)
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        return response.json();
      })
      .then((data) => {
        setMatches(data);
        setError("");
      })
      .catch((err) =>
        setError("Could not load recommendations: " + err.message)
      );
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.75rem",
    boxSizing: "border-box",
  };

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "#e8f0fe",
    color: "#1a3c8f",
    borderRadius: "999px",
    padding: "0.2rem 0.7rem",
    marginRight: "0.4rem",
    marginBottom: "0.4rem",
    fontSize: "0.9rem",
  };

  const matchedBadgeStyle = {
    ...badgeStyle,
    background: "#e3f6e8",
    color: "#14622b",
  };

  const missingBadgeStyle = {
    ...badgeStyle,
    background: "#f1f1f1",
    color: "#555",
  };

  const removeButtonStyle = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#1a3c8f",
    padding: 0,
  };

  const studentSkills = selectedStudent ? selectedStudent.skills || [] : [];
  const studentAvailableSkills = skills.filter(
    (skill) => !studentSkills.some((ss) => ss.id === skill.id)
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Student Career Navigator</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Student profile</h2>
      <select
        value={selectedStudentId ?? ""}
        onChange={(e) => handleSelectStudent(e.target.value)}
        style={{ ...inputStyle, width: "auto", minWidth: "250px" }}
      >
        <option value="">Select a student...</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name} ({student.email})
          </option>
        ))}
      </select>

      <form onSubmit={handleCreateStudent} style={{ marginBottom: "1.5rem" }}>
        <input
          style={inputStyle}
          placeholder="New student name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          type="email"
          placeholder="New student email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          required
        />
        <button type="submit">Create student</button>
      </form>

      {selectedStudent && (
        <div
          style={{
            border: "1px solid #b7dfc2",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Hi, {selectedStudent.name}</h3>
          <strong>Your skills:</strong>{" "}
          {studentSkills.length === 0 && <span>none yet</span>}
          <div style={{ marginTop: "0.4rem" }}>
            {studentSkills.map((skill) => (
              <span key={skill.id} style={badgeStyle}>
                {skill.name}
                <button
                  onClick={() => handleStudentRemoveSkill(skill.id)}
                  title="Remove skill"
                  style={removeButtonStyle}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {studentAvailableSkills.length > 0 && (
            <select
              value=""
              onChange={(e) =>
                e.target.value && handleStudentAddSkill(e.target.value)
              }
            >
              <option value="">+ Add a skill you have...</option>
              {studentAvailableSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          )}

          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={handleShowRecommendations}
              disabled={studentSkills.length === 0}
            >
              Show recommendations
            </button>
          </div>

          {matches !== null && (
            <div style={{ marginTop: "1rem" }}>
              {matches.length === 0 && (
                <p>
                  No careers match yet. Make sure careers have skills attached
                  further down the page.
                </p>
              )}
              {matches.map((match) => (
                <div
                  key={match.career.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>
                    {match.career.title} ({match.matchPercent}% match)
                  </h4>
                  <div>
                    <strong>You have: </strong>
                    {match.matchedSkills.map((skill) => (
                      <span key={skill.id} style={matchedBadgeStyle}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  {match.missingSkills.length > 0 && (
                    <div>
                      <strong>To learn: </strong>
                      {match.missingSkills.map((skill) => (
                        <span key={skill.id} style={missingBadgeStyle}>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <h2>{editingId !== null ? "Edit career" : "Add a career"}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          style={inputStyle}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit">
          {editingId !== null ? "Save changes" : "Add career"}
        </button>
        {editingId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "0.5rem" }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Skills</h2>
      <form onSubmit={handleCreateSkill} style={{ marginBottom: "1rem" }}>
        <input
          style={inputStyle}
          placeholder="Skill name (e.g. Python)"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          placeholder="Skill category (e.g. Programming)"
          value={skillCategory}
          onChange={(e) => setSkillCategory(e.target.value)}
        />
        <button type="submit">Add skill</button>
      </form>

      <div style={{ marginBottom: "2rem" }}>
        {skills.length === 0 && <span>No skills yet.</span>}
        {skills.map((skill) => (
          <span key={skill.id} style={badgeStyle}>
            {skill.name}
          </span>
        ))}
      </div>

      <h2>All careers</h2>
      {careers.map((career) => {
        const careerSkills = career.skills || [];
        const availableSkills = skills.filter(
          (skill) => !careerSkills.some((cs) => cs.id === skill.id)
        );

        return (
          <div
            key={career.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3>{career.title}</h3>
            <p>{career.description}</p>
            <small>Category: {career.category}</small>

            <div style={{ marginTop: "0.75rem" }}>
              <strong>Skills:</strong>{" "}
              {careerSkills.length === 0 && <span>none yet</span>}
              <div style={{ marginTop: "0.4rem" }}>
                {careerSkills.map((skill) => (
                  <span key={skill.id} style={badgeStyle}>
                    {skill.name}
                    <button
                      onClick={() => handleRemoveSkill(career.id, skill.id)}
                      title="Remove skill"
                      style={removeButtonStyle}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {availableSkills.length > 0 && (
                <select
                  value=""
                  onChange={(e) =>
                    e.target.value && handleAddSkill(career.id, e.target.value)
                  }
                >
                  <option value="">+ Add skill...</option>
                  {availableSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              onClick={() => handleEdit(career)}
              style={{ marginTop: "0.75rem" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(career.id)}
              style={{ marginTop: "0.75rem", marginLeft: "0.5rem" }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;