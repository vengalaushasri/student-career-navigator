import { useState } from "react";
import { createCareer, updateCareer } from "../api";
import { inputStyle } from "../styles";

// The parent gives this component a "key", so it starts fresh
// (with the right initial values) whenever a different career is edited.
function CareerForm({ editingCareer, onSaved, onCancel, onError }) {
  const [title, setTitle] = useState(editingCareer?.title ?? "");
  const [description, setDescription] = useState(
    editingCareer?.description ?? ""
  );
  const [category, setCategory] = useState(editingCareer?.category ?? "");

  const isEditing = editingCareer !== null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const career = { title, description, category };

    const request = isEditing
      ? updateCareer(editingCareer.id, career)
      : createCareer(career);

    request
      .then(() => {
        setTitle("");
        setDescription("");
        setCategory("");
        onError("");
        onSaved();
      })
      .catch((err) => onError("Could not save the career: " + err.message));
  };

  return (
    <>
      <h2>{isEditing ? "Edit career" : "Add a career"}</h2>
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
        <button type="submit">{isEditing ? "Save changes" : "Add career"}</button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            style={{ marginLeft: "0.5rem" }}
          >
            Cancel
          </button>
        )}
      </form>
    </>
  );
}

export default CareerForm;
