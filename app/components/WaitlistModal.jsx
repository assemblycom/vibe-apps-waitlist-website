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
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: "url(/Icons/arrow-up-right-from-square.svg)",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: "url(/Icons/arrow-up-right-from-square.svg)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
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
      className={`rounded-xl bg-white/[0.04] px-3.5 py-3 transition-colors ${
        isClickable ? "hover:bg-white/[0.07]" : ""
      } ${done ? "opacity-70" : ""}`}
    >
      <button
        type="button"
        onClick={() => isClickable && onAction()}
        disabled={!isClickable}
        className="flex w-full items-center justify-between gap-3 text-left disabled:cursor-default"
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Leading status dot — always rendered so every row's title
              aligns to the same column. */}
          <span
            aria-hidden="true"
            className={`inline-flex h-5 w-5 flex-none items-center justify-center rounded-[6px] bg-white/[0.10] transition-colors ${
              done ? "text-white/90" : "text-transparent"
            }`}
          >
            <CheckIcon className="h-2.5 w-2.5" />
          </span>
          <div className="min-w-0">
            <div
              className={`text-[14px] font-medium tracking-[-0.01em] ${
                done ? "text-white/60" : "text-white"
              }`}
            >
              {title}
            </div>
            {done ? (
              <p className="mt-0.5 text-[12px] leading-[1.4] text-white/40">
                {subtitle}
              </p>
            ) : (
              effort && (
                <p className="mt-0.5 text-[12px] leading-[1.4] text-white/40">
                  {effort}
                </p>
              )
            )}
          </div>
        </div>
        {reward && !done && (
          <span
            className={`hidden flex-none items-center rounded-full bg-white/[0.10] px-2.5 py-[4px] text-[11px] font-medium tracking-[-0.005em] text-white/75 transition-colors sm:inline-flex [@media(pointer:coarse)]:hidden ${
              clickable ? "group-hover:bg-white/[0.14]" : ""
            }`}
          >
            {reward}
            {clickable && (
              <ArrowOutIcon className="ml-1.5 h-3 w-3 text-white/60" />
            )}
          </span>
        )}
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
  // On Submit (phase becomes "submitted"): hold the final flash briefly
  // then close so the user gets a beat of confirmation rather than the
  // modal vanishing the instant they click.
  useEffect(() => {
    if (!open) {
      setPhase("success");
      return;
    }
    if (phase === "success") {
      const t = setTimeout(() => setPhase("main"), 1500);
      return () => clearTimeout(t);
    }
    if (phase === "submitted") {
      const t = setTimeout(() => onClose(), 1500);
      return () => clearTimeout(t);
    }
  }, [open, phase, onClose]);

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
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 [@media(pointer:coarse)]:items-end [@media(pointer:coarse)]:px-0 [@media(pointer:coarse)]:py-0"
    >
      {/* Backdrop — clicking closes. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Card — a single continuous surface. */}
      <div className="relative flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#141414] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] [@media(pointer:coarse)]:max-h-[92vh] [@media(pointer:coarse)]:max-w-none [@media(pointer:coarse)]:rounded-b-none [@media(pointer:coarse)]:border-x-0 [@media(pointer:coarse)]:border-b-0 [@media(pointer:coarse)]:pb-[max(env(safe-area-inset-bottom),0.5rem)] [@media(pointer:coarse)]:shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.7)]">
        {phase === "success" ? (
          <SuccessFlash
            heading={
              isReturning
                ? "You're already on the list"
                : "You're signed up"
            }
            subheading={
              isReturning
                ? "Lucky you — loading your progress…"
                : "Locking in your spot…"
            }
          />
        ) : phase === "submitted" ? (
          <SuccessFlash
            heading={content.submittedFlash.heading}
            subheading={content.submittedFlash.subheading}
          />
        ) : (
          <div
            data-lenis-prevent
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-7 pb-7 pt-8 md:px-8 md:pb-8 md:pt-9"
          >
            {/* Confirmation — baseline "you're on the list" acknowledgement. */}
            <div className="mb-7 animate-fade-in">
              <span
                aria-hidden="true"
                className="relative mb-4 inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-white/[0.08]"
              >
                <span
                  className="inline-block h-4 w-4 bg-white"
                  style={{
                    WebkitMaskImage: "url(/logos/favicon.svg)",
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskImage: "url(/logos/favicon.svg)",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
              </span>
              <h2
                id="waitlist-modal-heading"
                className="text-[1.25rem] font-normal leading-[1.15] tracking-[-0.02em] text-white [text-wrap:balance] md:text-[1.5rem] md:tracking-[-0.025em]"
              >
                {content.heading}
              </h2>
              <p className="mt-2 text-[15px] leading-[1.55] text-white/55 [text-wrap:pretty]">
                {content.subheading}
              </p>
            </div>

            {/* Progress meter. */}
            <div className="mb-5">
              <div className="mb-2 text-[12px] text-white/45">
                {stepsDone} of {totalSteps} complete
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  key={stepsDone}
                  data-pulse="true"
                  className="progress-prism-fill h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Email-submitted (auto-complete) + follow-up rows. */}
            <div className="flex flex-col gap-1.5">
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
                onClick={() => setPhase("submitted")}
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

// Full-card flash. Used for the open beat ("You're signed up"), the
// returning-user beat ("You're already on the list"), and the final
// post-Submit beat ("You're all set"). Caller controls the copy so
// the same logo build + fade-in animation carries all three states.
function SuccessFlash({ heading, subheading }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-8 py-12 text-center">
      <div
        aria-hidden="true"
        className="logo-build relative mb-5 h-14 w-14"
      >
        <span className="logo-piece logo-piece-1 absolute right-0 top-0 h-[24px] w-[24px] rounded-full bg-white" />
        <span className="logo-piece logo-piece-2 absolute left-0 top-0 h-[24px] w-[24px] rounded-full bg-white" />
        <span className="logo-piece logo-piece-3 absolute bottom-0 left-0 h-[24px] w-[24px] rounded-full bg-white" />
        <span className="logo-piece logo-piece-4 absolute bottom-0 right-0 h-[24px] w-[24px] rounded-[6px] bg-white" />
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
          {heading}
        </h2>
        <p className="mt-2 text-[15px] leading-[1.55] text-white/55">
          {subheading}
        </p>
      </div>
    </div>
  );
}
