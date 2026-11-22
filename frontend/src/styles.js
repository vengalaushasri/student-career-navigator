export const inputStyle = {
  display: "block",
  width: "100%",
  padding: "0.5rem",
  marginBottom: "0.75rem",
  boxSizing: "border-box",
};

export const badgeStyle = {
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

export const matchedBadgeStyle = {
  ...badgeStyle,
  background: "#e3f6e8",
  color: "#14622b",
};

export const missingBadgeStyle = {
  ...badgeStyle,
  background: "#f1f1f1",
  color: "#555",
};

export const removeButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#1a3c8f",
  padding: 0,
};
