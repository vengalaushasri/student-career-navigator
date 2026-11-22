import { addCareerSkill, removeCareerSkill } from "../api";
import { badgeStyle, removeButtonStyle } from "../styles";

function CareerList({
  careers,
  skills,
  onEdit,
  onDelete,
  onCareersChanged,
  onError,
}) {
  const handleAddSkill = (careerId, skillId) => {
    addCareerSkill(careerId, skillId)
      .then(() => {
        onError("");
        onCareersChanged();
      })
      .catch((err) => onError("Could not add the skill: " + err.message));
  };

  const handleRemoveSkill = (careerId, skillId) => {
    removeCareerSkill(careerId, skillId)
      .then(() => {
        onError("");
        onCareersChanged();
      })
      .catch((err) => onError("Could not remove the skill: " + err.message));
  };

  return (
    <>
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
              onClick={() => onEdit(career)}
              style={{ marginTop: "0.75rem" }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(career.id)}
              style={{ marginTop: "0.75rem", marginLeft: "0.5rem" }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </>
  );
}

export default CareerList;
