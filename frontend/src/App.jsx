import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/careers";
const SKILLS_URL = "http://localhost:8080/api/skills";

function App() {
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  useEffect(() => {
    loadCareers();
    loadSkills();
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
        loadCareers();
      })
      .catch((err) => setError("Could not delete the career: " + err.message));
  };

  const handleAddSkill = (careerId, skillId) => {
    fetch(`${API_URL}/${careerId}/skills/${skillId}`, { method: "PUT" })
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        setError("");
        loadCareers();
      })
      .catch((err) => setError("Could not add the skill: " + err.message));
  };

  const handleRemoveSkill = (careerId, skillId) => {
    fetch(`${API_URL}/${careerId}/skills/${skillId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Server error " + response.status);
        setError("");
        loadCareers();
      })
      .catch((err) => setError("Could not remove the skill: " + err.message));
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

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Student Career Navigator</h1>

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

      {error && <p style={{ color: "red" }}>{error}</p>}

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
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#1a3c8f",
                        padding: 0,
                      }}
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