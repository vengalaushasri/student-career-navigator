import { useState, useEffect } from "react";

function App() {
  const [careers, setCareers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/careers")
      .then((response) => response.json())
      .then((data) => setCareers(data))
      .catch(() => setError("Could not reach the backend"));
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Student Career Navigator</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
          <h2>{career.title}</h2>
          <p>{career.description}</p>
          <small>Category: {career.category}</small>
        </div>
      ))}
    </div>
  );
}

export default App;