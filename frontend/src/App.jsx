import { useState, useEffect } from "react";
import { getCareers, getSkills, getStudents, deleteCareer } from "./api";
import StudentProfile from "./components/StudentProfile";
import CareerForm from "./components/CareerForm";
import SkillManager from "./components/SkillManager";
import CareerList from "./components/CareerList";

function App() {
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingCareer, setEditingCareer] = useState(null);
  const [error, setError] = useState("");

  const loadCareers = () => {
    getCareers()
      .then((data) => {
        setCareers(data);
        setError("");
      })
      .catch(() => setError("Could not reach the backend"));
  };

  const loadSkills = () => {
    getSkills()
      .then((data) => setSkills(data))
      .catch(() => setError("Could not load skills"));
  };

  const loadStudents = () => {
    getStudents()
      .then((data) => setStudents(data))
      .catch(() => setError("Could not load students"));
  };

  useEffect(() => {
    loadCareers();
    loadSkills();
    loadStudents();
  }, []);

  const handleCareerSaved = () => {
    setEditingCareer(null);
    loadCareers();
  };

  const handleEditCareer = (career) => {
    setEditingCareer(career);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCareer = (id) => {
    deleteCareer(id)
      .then(() => {
        if (editingCareer && editingCareer.id === id) setEditingCareer(null);
        setError("");
        loadCareers();
      })
      .catch((err) => setError("Could not delete the career: " + err.message));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Student Career Navigator</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <StudentProfile
        students={students}
        skills={skills}
        careers={careers}
        onStudentsChanged={loadStudents}
        onError={setError}
      />

      <CareerForm
        key={editingCareer ? editingCareer.id : "new"}
        editingCareer={editingCareer}
        onSaved={handleCareerSaved}
        onCancel={() => setEditingCareer(null)}
        onError={setError}
      />

      <SkillManager
        skills={skills}
        onSkillsChanged={loadSkills}
        onError={setError}
      />

      <CareerList
        careers={careers}
        skills={skills}
        onEdit={handleEditCareer}
        onDelete={handleDeleteCareer}
        onCareersChanged={loadCareers}
        onError={setError}
      />
    </div>
  );
}

export default App;
