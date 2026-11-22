import { useState } from "react";
import {
  createStudent,
  addStudentSkill,
  removeStudentSkill,
  matchCareers,
} from "../api";
import {
  inputStyle,
  badgeStyle,
  matchedBadgeStyle,
  missingBadgeStyle,
  removeButtonStyle,
} from "../styles";

function StudentProfile({
  students,
  skills,
  careers,
  onStudentsChanged,
  onError,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [result, setResult] = useState(null);

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) || null;
  const studentSkills = selectedStudent ? selectedStudent.skills || [] : [];
  const availableSkills = skills.filter(
    (skill) => !studentSkills.some((ss) => ss.id === skill.id)
  );

  // Recommendations are only shown while they belong to the current careers
  // list. If a career changes, "careers" becomes a new array and the old
  // recommendations are hidden automatically.
  const matches =
    result !== null && result.careers === careers ? result.data : null;

  const handleSelect = (value) => {
    setSelectedStudentId(value === "" ? null : Number(value));
    setResult(null);
  };

  const handleCreate = (event) => {
    event.preventDefault();

    createStudent({ name: name.trim(), email: email.trim() })
      .then((created) => {
        setName("");
        setEmail("");
        setSelectedStudentId(created.id);
        setResult(null);
        onError("");
        onStudentsChanged();
      })
      .catch((err) =>
        onError(
          "Could not create the student: the email may already be used (" +
            err.message +
            ")"
        )
      );
  };

  const handleAddSkill = (skillId) => {
    addStudentSkill(selectedStudentId, skillId)
      .then(() => {
        setResult(null);
        onError("");
        onStudentsChanged();
      })
      .catch((err) => onError("Could not add the skill: " + err.message));
  };

  const handleRemoveSkill = (skillId) => {
    removeStudentSkill(selectedStudentId, skillId)
      .then(() => {
        setResult(null);
        onError("");
        onStudentsChanged();
      })
      .catch((err) => onError("Could not remove the skill: " + err.message));
  };

  const handleShowRecommendations = () => {
    matchCareers(studentSkills.map((skill) => skill.id))
      .then((data) => {
        setResult({ data, careers });
        onError("");
      })
      .catch((err) =>
        onError("Could not load recommendations: " + err.message)
      );
  };

  return (
    <>
      <h2>Student profile</h2>
      <select
        value={selectedStudentId ?? ""}
        onChange={(e) => handleSelect(e.target.value)}
        style={{ ...inputStyle, width: "auto", minWidth: "250px" }}
      >
        <option value="">Select a student...</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name} ({student.email})
          </option>
        ))}
      </select>

      <form onSubmit={handleCreate} style={{ marginBottom: "1.5rem" }}>
        <input
          style={inputStyle}
          placeholder="New student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          type="email"
          placeholder="New student email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
                  onClick={() => handleRemoveSkill(skill.id)}
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
              onChange={(e) => e.target.value && handleAddSkill(e.target.value)}
            >
              <option value="">+ Add a skill you have...</option>
              {availableSkills.map((skill) => (
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
    </>
  );
}

export default StudentProfile;
