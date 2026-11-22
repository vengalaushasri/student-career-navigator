import { useState } from "react";
import { createSkill } from "../api";
import { inputStyle, badgeStyle } from "../styles";

function SkillManager({ skills, onSkillsChanged, onError }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    createSkill({ name: name.trim(), category })
      .then(() => {
        setName("");
        setCategory("");
        onError("");
        onSkillsChanged();
      })
      .catch((err) =>
        onError(
          "Could not create the skill: the name may already exist (" +
            err.message +
            ")"
        )
      );
  };

  return (
    <>
      <h2>Skills</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          style={inputStyle}
          placeholder="Skill name (e.g. Python)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          placeholder="Skill category (e.g. Programming)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
    </>
  );
}

export default SkillManager;
