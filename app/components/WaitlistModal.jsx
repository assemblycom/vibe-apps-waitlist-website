"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SITE } from "../config/site";

// localStorage key for persisted follow-up progress (completion marks +
// in-flight text inputs). Versioned so we can change shape later without
// ghost data surviving.
const STORAGE_KEY = "assembly-waitlist-progress-v1";

// Post-submit confirmation. Two phases:
//   1. Success flash (~1.2s): a big centered check with a soft ripple, "You're
//      signed up". Gives the email submit a moment of delight.
//   2. Main view: a compact confirmation header, a progress meter ("N of 4
//      complete") and three collapsed follow-up rows. Each row expands on
//      click to reveal its input UI — reads like leveling up through the
//      follow-ups.
//
// The email itself auto-counts as the first completed step. Build / share /
// survey are local-only state. Nothing persists across closes — `open` toggling
// resets everything.

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M4 8.5l2.5 2.5L12 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ className, open }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${className} transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Soft filled chip — charcoal fill, no border, medium rounding. Shared
// across follow-ups so action weight stays consistent.
function ItemAction({ onClick, disabled, type = "button", icon, children }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      {icon && (
        <span className="text-white/60" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05a4.17 4.17 0 0 1 3.75-2.07c4 0 4.75 2.63 4.75 6.05V21H18V15.3c0-1.36-.03-3.11-1.9-3.11-1.9 0-2.2 1.48-2.2 3.01V21H10V9z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

// Dark-theme custom dropdown. Native <select> can't be styled consistently —
// its popup inherits OS/browser chrome, which reads as a light-mode popover
// on top of our dark card. This replaces it with an aria-listbox: trigger
// button + absolute-positioned panel that sits inside the modal's scroll
// container so it moves with the content.
function SurveySelect({ value, placeholder, options, onChange, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-[13px] outline-none transition-colors ${
          open
            ? "border-white/20 bg-white/[0.07]"
            : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06]"
        } ${value ? "text-white" : "text-white/40"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronIcon
          className="h-3.5 w-3.5 flex-none text-white/45"
          open={open}
        />
      </button>
      {open && (
        <div
          role="listbox"
          data-lenis-prevent
          className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-[240px] overflow-y-auto overscroll-contain rounded-lg border border-white/[0.08] bg-[#1C1C1C] py-1 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] animate-fade-in"
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.06] ${
                  selected ? "text-white" : "text-white/75"
                }`}
              >
                <span>{opt}</span>
                {selected && (
                  <CheckIcon className="h-3.5 w-3.5 flex-none text-white" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Clickable step row with expand/collapse header and a content panel.
// Every row carries a leading status dot so alignment stays consistent:
// filled + check when done, empty outline while pending. Reward chip
// (right) previews the perk each step unlocks.
function StepRow({ title, subtitle, reward, done, open, onToggle, children }) {
  const headerClickable = !done && Boolean(onToggle);
  return (
    <div
      className={`rounded-xl px-3 py-3.5 transition-colors ${
        headerClickable ? "hover:bg-white/[0.03]" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => headerClickable && onToggle()}
        aria-expanded={open}
        disabled={!headerClickable}
        className="flex w-full items-start justify-between gap-3 text-left transition-opacity disabled:cursor-default disabled:opacity-100"
      >
        <div className="flex min-w-0 items-start gap-3">
          {/* Leading status dot — always rendered so every row's title
              aligns to the same column. */}
          <span
            aria-hidden="true"
            className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full transition-colors ${
              done
                ? "bg-white/85 text-[#141414]"
                : "border border-white/20 bg-transparent text-transparent"
            }`}
          >
            <CheckIcon className="h-3 w-3" />
          </span>
          <div className="min-w-0">
            <div
              className={`text-[15px] font-medium tracking-[-0.01em] ${
                done ? "text-white/75" : "text-white"
              }`}
            >
              {title}
            </div>
            <p className="mt-1 text-[13.5px] leading-[1.5] text-white/50">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex flex-none items-center gap-2">
          {reward && !done && (
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[12px] font-medium leading-none tracking-[-0.005em] text-white/70">
              {reward}
            </span>
          )}
          {!done && (
            <ChevronIcon
              className="h-4 w-4 text-white/40"
              open={open}
            />
          )}
        </div>
      </button>

      {open && !done && (
        <div className="ml-8 mt-4 animate-fade-in">{children}</div>
      )}
    </div>
  );
}

export function WaitlistModal({ open, onClose, content }) {
  const [phase, setPhase] = useState("success");
  const [completed, setCompleted] = useState(() => new Set(["email"]));
  const [openStep, setOpenStep] = useState(null);
  const [buildInput, setBuildInput] = useState("");
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [hydrated, setHydrated] = useState(false);
  // Returning = we found prior progress on this device. Drives a different
  // success-flash copy ("Lucky you — loading your info…") so repeat visits
  // feel recognized instead of restarting the same "You're signed up" beat.
  const [isReturning, setIsReturning] = useState(false);

  // Hydrate saved progress from localStorage on first mount so returning users
  // pick up where they left off. Only the first-time flash is replaced: if
  // there's already prior progress, we skip straight to the main view.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          // Any meaningful prior content = returning user.
          const hasPriorProgress =
            (Array.isArray(saved.completed) && saved.completed.length > 0) ||
            (typeof saved.buildInput === "string" &&
              saved.buildInput.trim().length > 0) ||
            (saved.surveyAnswers &&
              typeof saved.surveyAnswers === "object" &&
              Object.keys(saved.surveyAnswers).length > 0);
          if (hasPriorProgress) setIsReturning(true);

          if (Array.isArray(saved.completed)) {
            setCompleted(new Set(["email", ...saved.completed]));
          }
          if (typeof saved.buildInput === "string")
            setBuildInput(saved.buildInput);
          if (saved.surveyAnswers && typeof saved.surveyAnswers === "object") {
            setSurveyAnswers(saved.surveyAnswers);
          }
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist progress on any change (once hydrated). We keep completion marks
  // plus the input values themselves, so an in-flight build / survey answers
  // are restored too.
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      const payload = {
        completed: [...completed].filter((id) => id !== "email"),
        buildInput,
        surveyAnswers,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage full or blocked */
    }
  }, [hydrated, completed, buildInput, surveyAnswers]);

  // On open: play the success flash once, then settle into the main view.
  // On close: leave completion/input state intact so it persists across
  // reopens; only the transient ui bits (phase + openStep) reset.
  useEffect(() => {
    if (!open) {
      setPhase("success");
      setOpenStep(null);
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

  const [buildItem, shareItem, surveyItem] = content.items;

  const toggleStep = (id) => setOpenStep((cur) => (cur === id ? null : id));

  const handleBuildSubmit = (e) => {
    e.preventDefault();
    if (!buildInput.trim()) return;
    mark("build");
    setOpenStep(null);
  };

  const getShareUrl = () =>
    typeof window !== "undefined"
      ? `${window.location.origin}/`
      : `https://${SITE.domain}/`;

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    mark("share");
    setOpenStep(null);
  };

  const handleShareX = () => {
    const shareUrl = getShareUrl();
    const text = "Just joined the Assembly Studio waitlist.";
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(xUrl, "_blank", "noopener,noreferrer");
    mark("share");
    setOpenStep(null);
  };

  const surveyQuestions = surveyItem.questions ?? [];
  const allAnswered = surveyQuestions.every((q) =>
    Boolean(surveyAnswers[q.id]),
  );

  const handleSurveySubmit = (e) => {
    e.preventDefault();
    if (!allAnswered) return;
    mark("survey");
    setOpenStep(null);
  };

  // Progress spans all 4 steps — email + 3 follow-ups. Email is auto-complete
  // when the modal opens (they just submitted it), so the bar always starts
  // at 1/4 rather than 0/4. All-complete unlocks the "Submit" terminal state.
  const perkIds = ["build", "share", "survey"];
  const perkDone = perkIds.filter((id) => completed.has(id)).length;
  const totalSteps = 1 + perkIds.length; // email + follow-ups
  const stepsDone = 1 + perkDone; // email always counts
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
            {/* Confirmation — baseline "you're on the list" acknowledgement.
                Uses the site's display type scale (smaller than a page H1
                but the same leading/tracking ratios). */}
            <div className="mb-7 animate-fade-in">
              <span
                aria-hidden="true"
                className="mb-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.1] text-white/80"
              >
                <CheckIcon className="h-3.5 w-3.5" />
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

            {/* Progress meter — single bar spanning all 4 steps. Email is
                auto-complete, so it starts at 1/4. */}
            <div className="mb-5 flex items-center gap-4">
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-white/85 transition-[width] duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex-none text-[13px] text-white/50">
                {stepsDone} of {totalSteps} complete
              </div>
            </div>

            {/* Expandable step rows — email first (pre-complete), then the
                three follow-ups with reward chips. */}
            <div className="-mx-3 flex flex-col">
              {/* Email — auto-complete, no expand. */}
              <StepRow
                title={content.emailStep.title}
                subtitle={content.emailStep.subtitle}
                done
              />

              {/* What would you build? */}
              <StepRow
                title={buildItem.title}
                subtitle={
                  completed.has("build")
                    ? buildItem.completedLabel
                    : buildItem.subtitle
                }
                reward={buildItem.reward}
                done={completed.has("build")}
                open={openStep === "build"}
                onToggle={() => toggleStep("build")}
              >
                <form
                  onSubmit={handleBuildSubmit}
                  className="flex flex-col gap-2.5"
                >
                  <textarea
                    value={buildInput}
                    onChange={(e) => setBuildInput(e.target.value)}
                    rows={2}
                    placeholder={buildItem.placeholder}
                    aria-label={buildItem.title}
                    autoFocus
                    className="w-full resize-none rounded-lg bg-white/[0.04] px-3 py-2 text-[13px] leading-[1.5] text-white placeholder:text-white/30 outline-none transition-colors focus:bg-white/[0.07]"
                  />
                  <div>
                    <ItemAction
                      type="submit"
                      disabled={!buildInput.trim()}
                    >
                      {buildItem.actionLabel}
                    </ItemAction>
                  </div>
                </form>
              </StepRow>

              {/* Share */}
              <StepRow
                title={shareItem.title}
                subtitle={
                  completed.has("share")
                    ? shareItem.completedLabel
                    : shareItem.subtitle
                }
                reward={shareItem.reward}
                done={completed.has("share")}
                open={openStep === "share"}
                onToggle={() => toggleStep("share")}
              >
                <div className="flex flex-wrap gap-2">
                  <ItemAction
                    onClick={handleShareLinkedIn}
                    icon={<LinkedInIcon />}
                  >
                    {shareItem.actionLabel}
                  </ItemAction>
                  <ItemAction onClick={handleShareX} icon={<XIcon />}>
                    {shareItem.actionLabelX ?? "Share on X"}
                  </ItemAction>
                </div>
              </StepRow>

              {/* Survey */}
              <StepRow
                title={surveyItem.title}
                subtitle={
                  completed.has("survey")
                    ? surveyItem.completedLabel
                    : surveyItem.subtitle
                }
                reward={surveyItem.reward}
                done={completed.has("survey")}
                open={openStep === "survey"}
                onToggle={() => toggleStep("survey")}
              >
                <form onSubmit={handleSurveySubmit}>
                  <div className="flex flex-col gap-5">
                    {surveyQuestions.map((q) => (
                      <div key={q.id}>
                        <div className="text-[14px] font-medium tracking-[-0.005em] text-white">
                          {q.label}
                        </div>
                        {q.type === "chips" ? (
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {q.options.map((opt) => {
                              const selected = surveyAnswers[q.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() =>
                                    setSurveyAnswers((prev) => ({
                                      ...prev,
                                      [q.id]: opt,
                                    }))
                                  }
                                  className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                                    selected
                                      ? "border-white/60 bg-white/[0.1] text-white"
                                      : "border-white/15 text-white/75 hover:border-white/30 hover:text-white"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mt-2.5">
                            <SurveySelect
                              value={surveyAnswers[q.id] ?? ""}
                              placeholder={q.placeholder ?? "Select one…"}
                              options={q.options}
                              ariaLabel={q.label}
                              onChange={(v) =>
                                setSurveyAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: v,
                                }))
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={!allAnswered}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-[13px] font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {surveyItem.submitLabel ?? "Submit"}
                    </button>
                  </div>
                </form>
              </StepRow>
            </div>

            {/* Primary close — "Submit" reads as finalizing the follow-ups,
                "Maybe later" as deferring. Both simply close the modal; the
                individual steps already auto-save when completed. */}
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

// Full-card success flash shown for ~1.2s right after the modal opens. Big
// centered check with a soft expanding ring and a short line of copy. The
// copy shifts on return visits so repeat sign-ups feel recognized rather
// than restarted.
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
