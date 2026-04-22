"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TYPEFORM_URL, SITE } from "../config/site";

// Post-submit confirmation. Reads as an editorial panel, not a checklist:
// a lightweight "You're on the list" confirmation at the top, then three
// optional follow-up actions (describe what you'd build, share, survey)
// flowing as plain rows on a single continuous surface.
//
// The email submit itself is implied by opening the modal — it isn't
// rendered as an item. The follow-ups are local-only stubs: the textarea
// is held in state, share opens LinkedIn's sharer, survey opens
// TYPEFORM_URL. Nothing is persisted.

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

function ArrowUpRightIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export function WaitlistModal({ open, onClose, content }) {
  const [completed, setCompleted] = useState(() => new Set());
  const [buildInput, setBuildInput] = useState("");

  // Reset completion state whenever the modal closes so a fresh re-open
  // starts clean.
  useEffect(() => {
    if (!open) {
      setCompleted(new Set());
      setBuildInput("");
    }
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

  const handleBuildSubmit = (e) => {
    e.preventDefault();
    if (!buildInput.trim()) return;
    mark("build");
  };

  // Either share destination counts as "shared" — keeps the follow-up
  // loose, since the user only needs to pick one network.
  const getShareUrl = () =>
    typeof window !== "undefined"
      ? `${window.location.origin}/`
      : `https://${SITE.domain}/`;

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    mark("share");
  };

  const handleShareX = () => {
    const shareUrl = getShareUrl();
    const text = "Just joined the Assembly Studio waitlist.";
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(xUrl, "_blank", "noopener,noreferrer");
    mark("share");
  };

  const handleSurvey = () => {
    window.open(TYPEFORM_URL, "_blank", "noopener,noreferrer");
    mark("survey");
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-modal-heading"
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
    >
      {/* Backdrop — clicking closes. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Card — a single continuous surface. */}
      <div className="relative flex max-h-[92vh] w-full max-w-[460px] flex-col overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#141414] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        <div className="overflow-y-auto px-7 pb-7 pt-8 md:px-8 md:pb-8 md:pt-9">
          {/* Confirmation header — small check glyph, title, supporting
              line. Reads as "done" rather than "step 1 of 4". */}
          <div className="mb-8">
            <span
              aria-hidden="true"
              className="mb-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-white/75"
            >
              <CheckIcon className="h-3.5 w-3.5" />
            </span>
            <h2
              id="waitlist-modal-heading"
              className="text-[1.25rem] font-normal leading-[1.2] tracking-[-0.02em] text-white md:text-[1.5rem] md:tracking-[-0.025em]"
            >
              {content.heading}
            </h2>
            <p className="mt-1.5 text-[13px] leading-[1.55] text-white/55 [text-wrap:pretty]">
              {content.subheading}
            </p>
          </div>

          {/* Optional follow-ups — plain rows, no status markers, no
              badges, no container fills. Spacing carries the rhythm. */}
          <div className="flex flex-col divide-y divide-white/[0.05]">
            {/* What would you build? */}
            <div className="py-5 first:pt-0">
              <div className="text-[14px] font-semibold text-white">
                {buildItem.title}
              </div>
              <p className="mt-0.5 text-[13px] text-white/55">
                {buildItem.subtitle}
              </p>
              <form
                onSubmit={handleBuildSubmit}
                className="mt-3 flex flex-col gap-2.5"
              >
                <textarea
                  value={buildInput}
                  onChange={(e) => setBuildInput(e.target.value)}
                  rows={2}
                  placeholder={buildItem.placeholder}
                  aria-label={buildItem.title}
                  disabled={completed.has("build")}
                  className="w-full resize-none rounded-lg bg-white/[0.04] px-3 py-2 text-[13px] leading-[1.5] text-white placeholder:text-white/30 outline-none transition-colors focus:bg-white/[0.07] disabled:opacity-60"
                />
                {/* Save only surfaces once there's something to save (or
                    after submit, to show the "Saved" acknowledgement).
                    Keeps the resting state quieter. */}
                {(buildInput.trim() || completed.has("build")) && (
                  <div>
                    <ItemAction
                      type="submit"
                      disabled={completed.has("build")}
                    >
                      {completed.has("build")
                        ? buildItem.completedLabel
                        : buildItem.actionLabel}
                    </ItemAction>
                  </div>
                )}
              </form>
            </div>

            {/* Share */}
            <div className="py-5">
              <div className="text-[14px] font-semibold text-white">
                {shareItem.title}
              </div>
              <p className="mt-0.5 text-[13px] text-white/55">
                {shareItem.subtitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ItemAction
                  onClick={handleShareLinkedIn}
                  disabled={completed.has("share")}
                  icon={<LinkedInIcon />}
                >
                  {completed.has("share")
                    ? shareItem.completedLabel
                    : shareItem.actionLabel}
                </ItemAction>
                <ItemAction
                  onClick={handleShareX}
                  disabled={completed.has("share")}
                  icon={<XIcon />}
                >
                  {shareItem.actionLabelX ?? "Share on X"}
                </ItemAction>
              </div>
            </div>

            {/* Survey */}
            <div className="py-5 last:pb-0">
              <div className="text-[14px] font-semibold text-white">
                {surveyItem.title}
              </div>
              <p className="mt-0.5 text-[13px] text-white/55">
                {surveyItem.subtitle}
              </p>
              <div className="mt-3">
                <ItemAction
                  onClick={handleSurvey}
                  disabled={completed.has("survey")}
                  icon={<ArrowUpRightIcon />}
                >
                  {completed.has("survey")
                    ? surveyItem.completedLabel
                    : surveyItem.actionLabel}
                </ItemAction>
              </div>
            </div>
          </div>

          {/* Dismiss */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-[13px] text-white/55 transition-colors hover:text-white/90"
            >
              {content.dismissLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalTarget,
  );
}
