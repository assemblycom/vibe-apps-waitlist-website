"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// localStorage key for persisted follow-up progress. Bumped to v2 when
// the follow-ups changed from internal forms (build/share/survey) to
// external link-outs (survey/community), so older state doesn't restore
// completion of ids that no longer exist.
const STORAGE_KEY = "assembly-waitlist-progress-v2";

// Post-submit confirmation. Two phases:
//   1. Success flash (~1.2s): a big centered check with a soft ripple, "You're
//      signed up". Gives the email submit a moment of delight.
//   2. Main view: a compact confirmation header, a progress meter and a list
//      of follow-up rows. Each row is a one-click external link — opening
//      the link marks the row complete. The email itself auto-counts as
//      the first completed step.

// Brand check — inlined from public/Icons/checkmark.svg.
function CheckIcon({ className }) {
  return (
    <svg
      viewBox="0 0 11 10"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10.2668 0.105509C10.5199 0.285978 10.5762 0.63754 10.3957 0.890666L4.2082 9.51567C4.11211 9.64926 3.96211 9.73598 3.79805 9.7477C3.63398 9.75942 3.46992 9.70317 3.35273 9.58598L0.165234 6.39848C-0.0550781 6.17817 -0.0550781 5.82192 0.165234 5.60395C0.385547 5.38598 0.741797 5.38363 0.959766 5.60395L3.68086 8.32035L9.48164 0.234416C9.66211 -0.0187095 10.0137 -0.0749595 10.2668 0.105509Z" />
    </svg>
  );
}

function ArrowOutIcon({ className }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h7v7" />
      <path d="M13 3L6 10" />
      <path d="M11 10v3H3V5h3" />
    </svg>
  );
}

// Step row — leading status dot, title + effort/subtitle, reward chip on the
// right (or a subtle "open external link" arrow). The whole row is one click
// target: clicking fires `onAction` and the row goes to a completed state.
//
// On completion the row dims, the subtitle flips to the celebratory
// `completedLabel`, and the right-side reward chip is hidden — the prize
// is already in the subtitle ("Even earlier access unlocked").
function StepRow({ id, title, effort, reward, subtitle, done, clickable, onAction }) {
  const isClickable = !done && Boolean(onAction);

  return (
    <div
      data-step-id={id}
      className={`rounded-xl bg-white/[0.02] px-3.5 py-3.5 transition-colors ${
        isClickable ? "hover:bg-white/[0.05]" : ""
      } ${done ? "opacity-85" : ""}`}
    >
      <button
        type="button"
        onClick={() => isClickable && onAction()}
        disabled={!isClickable}
        className="flex w-full items-center justify-between gap-3 text-left disabled:cursor-default"
      >
        <div className="flex min-w-0 items-start gap-3">
          {/* Leading status dot — always rendered so every row's title
              aligns to the same column. */}
          <span
            aria-hidden="true"
            className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-[6px] transition-colors ${
              done
                ? "bg-white/90 text-[#141414]"
                : "border-[1.5px] border-white/25 bg-transparent text-transparent"
            }`}
          >
            <CheckIcon className="h-2.5 w-2.5" />
          </span>
          <div className="min-w-0">
            <div
              className={`text-[15px] font-medium tracking-[-0.01em] ${
                done ? "text-white/75" : "text-white"
              }`}
            >
              {title}
            </div>
            {done ? (
              <p className="mt-1 text-[13px] leading-[1.5] text-white/55">
                {subtitle}
              </p>
            ) : (
              effort && (
                <p className="mt-1 text-[13px] leading-[1.5] text-white/45">
                  {effort}
                </p>
              )
            )}
          </div>
        </div>
        <div className="flex flex-none items-center gap-2.5">
          {reward && !done && (
            <span className="inline-flex items-center rounded-full bg-white/[0.08] px-3 py-[5px] text-[12px] font-medium tracking-[-0.005em] text-white/85">
              {reward}
            </span>
          )}
          {clickable && !done && (
            <ArrowOutIcon className="h-3.5 w-3.5 text-white/45" />
          )}
        </div>
      </button>
    </div>
  );
}

export function WaitlistModal({ open, onClose, content, email }) {
  const [phase, setPhase] = useState("success");
  const [completed, setCompleted] = useState(() => new Set(["email"]));
  const [hydrated, setHydrated] = useState(false);
  // Returning = we found prior progress on this device. Drives a different
  // success-flash copy ("Lucky you — loading your info…") so repeat visits
  // feel recognized instead of restarting the same "You're signed up" beat.
  const [isReturning, setIsReturning] = useState(false);

  const followUpIds = content.items.map((item) => item.id);

  // Hydrate saved progress from localStorage on first mount so returning users
  // pick up where they left off.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          if (Array.isArray(saved.completed) && saved.completed.length > 0) {
            setIsReturning(true);
            const valid = saved.completed.filter((id) =>
              followUpIds.includes(id),
            );
            setCompleted(new Set(["email", ...valid]));
          }
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
    // followUpIds is derived from props — re-running on prop change is fine
    // and only filters, never widens, the restored set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist progress on any change (once hydrated).
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      const payload = {
        completed: [...completed].filter((id) => id !== "email"),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage full or blocked */
    }
  }, [hydrated, completed]);

  // On open: play the success flash once, then settle into the main view.
  useEffect(() => {
    if (!open) {
      setPhase("success");
      return;
    }
    const t = setTimeout(() => setPhase("main"), 1200);
    return () => clearTimeout(t);
  }, [open]);

  // Body scroll lock + Escape-to-close while the modal is mounted.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Portal target. Modal must escape hero ancestor transforms/opacity.
  const [portalTarget, setPortalTarget] = useState(null);
  useEffect(() => {
    if (typeof document !== "undefined") setPortalTarget(document.body);
  }, []);

  if (!open || !portalTarget) return null;

  const mark = (id) =>
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  const handleItemAction = (item) => {
    let url = item.url;
    if (item.prefillEmail && email) {
      // Typeform hidden-field convention — email is appended after the
      // URL fragment as `#email=…`.
      url = `${url}#email=${encodeURIComponent(email)}`;
    }
    if (typeof window !== "undefined" && url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    mark(item.id);
  };

  // Progress spans email + all follow-ups. Email is auto-complete.
  const perkDone = followUpIds.filter((id) => completed.has(id)).length;
  const totalSteps = 1 + followUpIds.length;
  const stepsDone = 1 + perkDone;
  const progressPct = Math.round((stepsDone / totalSteps) * 100);
  const allComplete = stepsDone === totalSteps;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-modal-heading"
      data-lenis-prevent
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
    >
      {/* Backdrop — clicking closes. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Card — a single continuous surface. */}
      <div className="relative flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#141414] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        {phase === "success" ? (
          <SuccessFlash returning={isReturning} />
        ) : (
          <div
            data-lenis-prevent
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-7 pb-7 pt-8 md:px-8 md:pb-8 md:pt-9"
          >
            {/* Confirmation — baseline "you're on the list" acknowledgement. */}
            <div className="mb-7 animate-fade-in">
              <span
                aria-hidden="true"
                className="relative mb-4 inline-flex h-7 w-7 items-center justify-center"
              >
                <span className="absolute inset-[-8px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.18),rgba(255,255,255,0)_75%)]" />
                <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-white/[0.08] text-white/75">
                  <CheckIcon className="h-3 w-3" />
                </span>
              </span>
              <h2
                id="waitlist-modal-heading"
                className="text-[1.5rem] font-normal leading-[1.1] tracking-[-0.025em] text-white [text-wrap:balance] md:text-[1.875rem] md:tracking-[-0.03em]"
              >
                {content.heading}
              </h2>
              <p className="mt-2 text-[15px] leading-[1.55] text-white/55 [text-wrap:pretty]">
                {content.subheading}
              </p>
            </div>

            {/* Progress meter. */}
            <div className="mb-5 flex items-center gap-4">
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  key={stepsDone}
                  data-pulse="true"
                  className="progress-prism-fill h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex-none text-[13px] text-white/50">
                {stepsDone} of {totalSteps} complete
              </div>
            </div>

            {/* Email-submitted (auto-complete) + follow-up rows. */}
            <div className="-mx-3.5 flex flex-col gap-1.5">
              <StepRow
                title={content.emailStep.title}
                subtitle={content.emailStep.subtitle}
                done
              />

              {content.items.map((item) => (
                <StepRow
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  subtitle={
                    completed.has(item.id) ? item.completedLabel : undefined
                  }
                  effort={item.effort}
                  reward={item.reward}
                  done={completed.has(item.id)}
                  clickable
                  onAction={() => handleItemAction(item)}
                />
              ))}
            </div>

            {/* Primary close. "Submit" finalizes; "Maybe later" defers. */}
            <div className="mt-7 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={!allComplete}
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-[#101010] transition-all duration-200 hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-white/40 disabled:hover:bg-white/[0.08] sm:w-auto sm:min-w-[180px]"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-[14px] text-white/55 transition-colors hover:text-white/90"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    portalTarget,
  );
}

// Full-card success flash shown for ~1.2s right after the modal opens.
function SuccessFlash({ returning }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-8 py-12 text-center">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-white/[0.12] animate-success-ring"
        />
        <span
          aria-hidden="true"
          className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#141414] animate-success-pop"
        >
          <CheckIcon className="h-6 w-6" />
        </span>
      </div>
      <div
        className="animate-fade-in"
        style={{
          animationDelay: "0.15s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        <h2 className="text-[1.5rem] font-normal leading-[1.1] tracking-[-0.025em] text-white [text-wrap:balance] md:text-[1.875rem] md:tracking-[-0.03em]">
          {returning ? "You're already on the list" : "You're signed up"}
        </h2>
        <p className="mt-2 text-[15px] leading-[1.55] text-white/55">
          {returning
            ? "Lucky you — loading your progress…"
            : "Locking in your spot…"}
        </p>
      </div>
    </div>
  );
}
