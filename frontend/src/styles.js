export const inputStyle = {
  padding: "9px 13px",
  borderRadius: "10px",
  border: "1.5px solid #e2e8f0",
  fontSize: "14px",
  marginRight: "8px",
  marginBottom: "8px",
  fontFamily: "inherit",
  backgroundColor: "#ffffff",
  color: "#0f172a",
};

export const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "5px 12px",
  borderRadius: "999px",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  fontSize: "13px",
  fontWeight: 600,
  marginRight: "6px",
  marginBottom: "6px",
};

export const matchedBadgeStyle = {
  ...badgeStyle,
  backgroundColor: "#ecfdf5",
  color: "#047857",
  border: "1px solid #a7f3d0",
};

export const missingBadgeStyle = {
  ...badgeStyle,
  backgroundColor: "#fff7ed",
  color: "#c2410c",
  border: "1px solid #fed7aa",
};

export const removeButtonStyle = {
  background: "none",
  border: "none",
  color: "#ef4444",
  fontWeight: 800,
  fontSize: "14px",
  cursor: "pointer",
  padding: "0 2px",
  lineHeight: 1,
};
