import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/careers";

function App() {
  const [careers, setCareers] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadCareers = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setCareers(data))
      .catch(() => setError("Could not reach the backend"));
  };

  useEffect(() => {
    loadCareers();
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
      .then((response) => response.json())
      .then(() => {
        resetForm();
        loadCareers();
      })
      .catch(() => setError("Could not save the career"));
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
      .then(() => {
        if (editingId === id) resetForm();
        loadCareers();
      })
      .catch(() => setError("Could not delete the career"));
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.75rem",
    boxSizing: "border-box",
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
      {careers.map((career) => (
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
          <br />
          <button
            onClick={() => handleEdit(career)}
            style={{ marginTop: "0.5rem" }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(career.id)}
            style={{ marginTop: "0.5rem", marginLeft: "0.5rem" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
