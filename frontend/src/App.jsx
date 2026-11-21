import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Could not reach the backend"));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Student Career Navigator</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;