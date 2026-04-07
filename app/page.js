"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { WaitlistForm } from "./components/WaitlistForm";

const VALUE_PROPS = [
  {
    label: "AI-Generated Apps",
    heading: "Describe it. It builds.",
    description:
      "Tell Assembly what you need in plain English. It generates a custom app with real data models, workflows, and UI — not a template.",
  },
  {
    label: "Built-in Platform",
    heading: "CRM, portal, payments.",
    description:
      "Every app you generate runs on Assembly's platform — your client data, project tracking, invoices, and portal are already connected.",
  },
  {
    label: "Client Portal",
    heading: "Ship to your clients.",
    description:
      "Generated apps go live in your branded client portal instantly. Clients see their data, upload files, approve work — no extra setup.",
  },
];

export default function Home() {
  const valueRef = useRef(null);
  const valueInView = useInView(valueRef, { once: true, margin: "-60px" });

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          padding: "1.25rem 1.5rem",
          maxWidth: "80rem",
          margin: "0 auto",
        }}
      >
        <a
          href="https://assembly.com"
          target="_blank"
          rel="noopener"
          style={{ display: "inline-block", transition: "opacity 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <img
            src="/logos/watermark.svg"
            alt="Assembly"
            style={{ height: "22px", width: "auto", filter: "invert(1)" }}
          />
        </a>
      </header>

      {/* Hero + Form */}
      <section
        className="waitlist-hero"
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "6rem 1.5rem 5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="mono"
            style={{
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 16,
              display: "block",
            }}
          >
            Early Access
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 20,
            }}
          >
            Describe the app.
            <br />
            It already knows
            <br />
            your clients.
          </h1>
          <p
            style={{
              fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
              color: "var(--color-text-secondary)",
              maxWidth: 440,
              lineHeight: 1.6,
            }}
          >
            Assembly Vibe Apps generates custom tools from a single prompt — with
            your CRM, projects, payments, and client portal built in. Join the
            waitlist for early access.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <WaitlistForm />
        </motion.div>
      </section>

      {/* Value Props */}
      <section
        ref={valueRef}
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "4rem 1.5rem 6rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="waitlist-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
          }}
        >
          {VALUE_PROPS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={valueInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              style={{
                padding: "1.75rem",
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: "0.7rem",
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  display: "block",
                }}
              >
                {item.label}
              </span>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.heading}
              </h3>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.55,
                }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          textAlign: "center",
        }}
      >
        <p
          className="mono"
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
          }}
        >
          &copy; {new Date().getFullYear()} Assembly Industries, Inc.
        </p>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .waitlist-hero {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
            text-align: center;
          }
          .waitlist-hero p {
            margin-left: auto;
            margin-right: auto;
          }
          .waitlist-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
