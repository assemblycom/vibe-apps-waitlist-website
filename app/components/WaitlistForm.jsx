"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { validateWaitlistForm } from "@/app/lib/validation";

const INPUT_STYLE = {
  width: "100%",
  padding: "0.85rem 1rem",
  fontSize: "0.95rem",
  fontFamily: "'PP Mori', var(--font-sans)",
  color: "rgba(255,255,255,0.85)",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const INPUT_FOCUS_BORDER = "rgba(255,255,255,0.2)";

export function WaitlistForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState("");

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError("");
  }

  function handleBlur(field) {
    const result = validateWaitlistForm(form);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { valid, errors: fieldErrors } = validateWaitlistForm(form);
    if (!valid) {
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");
    setServerError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          setStatus("idle");
        } else {
          setServerError(data.error || "Something went wrong.");
          setStatus("error");
        }
        return;
      }

      setStatus("success");
    } catch {
      setServerError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "20px",
        padding: "2.5rem 2rem",
      }}
    >
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center", padding: "2rem 0" }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "rgba(214, 249, 144, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(214, 249, 144, 0.8)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "1.35rem",
                fontWeight: 600,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              You're on the list
            </h3>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)" }}>
              We'll reach out when early access opens.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                onFocus={(e) => {
                  e.target.style.borderColor = INPUT_FOCUS_BORDER;
                }}
                onBlurCapture={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                }}
                style={INPUT_STYLE}
              />
              {errors.name && (
                <p style={{ fontSize: "0.8rem", color: "#f87171", marginTop: 6, paddingLeft: 4 }}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Work email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                onFocus={(e) => {
                  e.target.style.borderColor = INPUT_FOCUS_BORDER;
                }}
                onBlurCapture={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                }}
                style={INPUT_STYLE}
              />
              {errors.email && (
                <p style={{ fontSize: "0.8rem", color: "#f87171", marginTop: 6, paddingLeft: 4 }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Company"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                onBlur={() => handleBlur("company")}
                onFocus={(e) => {
                  e.target.style.borderColor = INPUT_FOCUS_BORDER;
                }}
                onBlurCapture={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                }}
                style={INPUT_STYLE}
              />
              {errors.company && (
                <p style={{ fontSize: "0.8rem", color: "#f87171", marginTop: 6, paddingLeft: 4 }}>
                  {errors.company}
                </p>
              )}
            </div>

            {serverError && (
              <p style={{ fontSize: "0.85rem", color: "#f87171", textAlign: "center" }}>
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                fontFamily: "'PP Mori', var(--font-sans)",
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "#101010",
                backgroundColor:
                  status === "submitting"
                    ? "rgba(255, 255, 255, 0.6)"
                    : "rgba(255, 255, 255, 0.9)",
                padding: "0.85rem 2rem",
                borderRadius: "9999px",
                border: "none",
                cursor: status === "submitting" ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                marginTop: 4,
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (status !== "submitting") {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.boxShadow =
                    "0 0 24px rgba(214, 249, 144, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  status === "submitting"
                    ? "rgba(255, 255, 255, 0.6)"
                    : "rgba(255, 255, 255, 0.9)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {status === "submitting" ? "Joining..." : "Join the waitlist"}
            </button>

            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              No spam. We'll only email you about early access.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
