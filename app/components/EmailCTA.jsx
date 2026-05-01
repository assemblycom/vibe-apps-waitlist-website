"use client";

import { useState } from "react";
import { WaitlistModal } from "./WaitlistModal";
import { HOME_CONTENT } from "../content/home";

// Email-capture CTA for the hero and final-CTA sections. A unified pill
// that holds an email input on the left and a lime "Request early
// access" button on the right — single focal surface, one clear action.
//
// On submit, we open the post-submit WaitlistModal in-page instead of
// redirecting to Typeform. The email itself isn't persisted yet — the
// modal is a local-only stub that captures intent and the three
// follow-up steps (build prompt, share, survey). Wire a real persistence
// layer later.

// Very small RFC-ish check — good enough for a "did the user type an
// email shape" signal without pulling in a validator library.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailCTA() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Add your email to continue.");
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError("That doesn't look like a valid email.");
      return;
    }
    setError("");
    setModalOpen(true);
  };

  // Intercept the browser's native validation popup so we can render our
  // own dark-theme message instead of the default white tooltip.
  const onInvalid = (e) => {
    e.preventDefault();
    setError(
      email.trim()
        ? "That doesn't look like a valid email."
        : "Add your email to continue.",
    );
  };

  return (
    <>
      <div className="flex w-full max-w-md flex-col">
        <form
          onSubmit={onSubmit}
          noValidate
          className={[
            "flex w-full items-center gap-1.5 rounded-full border bg-white/[0.03] p-1.5 pl-4 backdrop-blur-sm transition-colors duration-200",
            error
              ? "border-[#E6836E]/50"
              : "border-white/10 focus-within:border-white/25",
          ].join(" ")}
        >
          <input
            // `data-waitlist-email` is the target the nav CTA scrolls to
            // and focuses. Using a data-attr instead of a global id keeps
            // the selector unambiguous even if the component is rendered
            // multiple times on the page (only the first match is used).
            data-waitlist-email
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            onInvalid={onInvalid}
            placeholder="you@firm.com"
            aria-label="Email address"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "email-cta-error" : undefined}
            className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/40 outline-none"
          />
          <button
            type="submit"
            aria-label="Get early access"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#D9ED92] p-2.5 text-[13px] font-medium text-[#101010] transition-colors duration-200 hover:bg-[#C7DA86] sm:whitespace-nowrap sm:px-4 sm:py-2"
          >
            <span className="hidden sm:inline">Get early access</span>
            <span aria-hidden="true" className="text-[14px] leading-none">→</span>
          </button>
        </form>
        {error && (
          <p
            id="email-cta-error"
            role="alert"
            className="mt-2 pl-4 text-[13px] text-[#E6836E]/90"
          >
            {error}
          </p>
        )}
      </div>
      <WaitlistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        content={HOME_CONTENT.waitlistModal}
        email={email.trim()}
      />
    </>
  );
}
