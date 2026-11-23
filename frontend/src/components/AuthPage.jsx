import React, { useState } from "react";
import { loginUser, registerUser } from "../api";

export default function AuthPage({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const authData = isRegister
        ? await registerUser({ fullName, email, password, role })
        : await loginUser({ email, password });
      onAuthSuccess(authData);
    } catch (err) {
      setError(err.message || "Authentication failed. If the cloud server just woke up, retry in 10 seconds.");
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (demoEmail, demoPass) => {
    setIsRegister(false);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
    setLoading(true);
    try {
      const authData = await loginUser({ email: demoEmail, password: demoPass });
      onAuthSuccess(authData);
    } catch (err) {
      setError(err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f4f6fb 0%, #e0e7ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#ffffff",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.12)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #275df5 0%, #4f46e5 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            CN
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
              CareerNavigator
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
              AI Career Guidance & Scholarship Portal
            </p>
          </div>
        </div>

        {/* Recruiter 1-Click Demo Strip */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "10px 12px",
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase" }}>
            Instant Recruiter Demo Access
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              type="button"
              disabled={loading}
              onClick={() => quickDemoLogin("student@demo.com", "demo123")}
              style={{
                padding: "7px 10px",
                fontSize: 12,
                fontWeight: 700,
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe",
              }}
            >
              Demo Student
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => quickDemoLogin("admin@demo.com", "admin123")}
              style={{
                padding: "7px 10px",
                fontSize: 12,
                fontWeight: 700,
                background: "#ecfdf5",
                color: "#047857",
                border: "1px solid #a7f3d0",
              }}
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#f1f5f9",
            padding: 4,
            borderRadius: 12,
            marginBottom: 18,
          }}
        >
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(""); }}
            style={{
              padding: "8px 12px",
              border: "none",
              borderRadius: 9,
              background: !isRegister ? "#ffffff" : "transparent",
              color: !isRegister ? "#275df5" : "#475569",
              fontWeight: 700,
              boxShadow: !isRegister ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(""); }}
            style={{
              padding: "8px 12px",
              border: "none",
              borderRadius: 9,
              background: isRegister ? "#ffffff" : "transparent",
              color: isRegister ? "#275df5" : "#475569",
              fontWeight: 700,
              boxShadow: isRegister ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {isRegister && (
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g., Usha Sri"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password (min 4 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          {isRegister && (
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="STUDENT">Student (Career & Scholarship Guidance)</option>
                <option value="ADMIN">Admin / Counselor (Manage Careers & Skills)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", marginTop: 4, padding: "12px 16px", fontSize: 15 }}
          >
            {loading
              ? "Connecting to server..."
              : isRegister
              ? "Register & Enter Dashboard"
              : "Sign In to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
