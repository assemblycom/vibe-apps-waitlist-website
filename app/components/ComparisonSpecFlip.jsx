"use client";

// Flip-card comparison. Visual chrome matches the Testimonials
// section directly below — same rounded-[20px] cards, soft
// `[#1A1A1A]/10` borders, low-contrast tinted surfaces, left-aligned
// section header. Each card's front states a way other app builders
// fall short; hover flips the card 180° to reveal how Studio
// handles it (icon shifts from neutral to mint as the answer
// appears). Mobile drops the flip and stacks front/back side by
// side for touch.
// ARCHIVED: flip-card comparison. Reverted in favor of the spec-sheet
// table (see ComparisonSpec.jsx). Kept in-tree for reference.
export function ComparisonSpecFlip({
  eyebrow,
  heading,
  headingCallout,
  subheading,
  cards = [],
}) {
  return (
    <section className="gradient-divider py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-20 max-w-2xl text-center md:mb-28">
          {eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-[#1A1A1A]/45">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className="mb-4 text-[1.75rem] font-normal leading-[1.05] tracking-[-0.025em] text-[#1A1A1A] [text-wrap:balance] md:text-[2.375rem] md:tracking-[-0.03em]">
              {heading}
              {headingCallout && (
                <>
                  {" "}
                  <span className="text-[#1A1A1A]/55">{headingCallout}</span>
                </>
              )}
            </h3>
          )}
          {subheading && (
            <p className="text-[1rem] leading-[1.6] text-[#1A1A1A]/60">
              {subheading}
            </p>
          )}
        </div>

        {/* Desktop — five cards in a row, hover to flip. */}
        <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-5">
          {cards.slice(0, 5).map((card, i) => (
            <FlipCard
              key={i}
              icon={ICONS[i]}
              front={card.front}
              back={card.back}
            />
          ))}
        </div>

        {/* Mobile — stack each pair side by side, no flip. */}
        <div className="flex flex-col gap-3 md:hidden">
          {cards.map((card, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <CardFace variant="front" icon={ICONS[i]} text={card.front} />
              <CardFace variant="back" icon={ICONS[i]} text={card.back} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ icon, front, back }) {
  return (
    <div className="group" style={{ perspective: "1200px" }}>
      <div className="relative aspect-[4/5] w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <CardFace
          variant="front"
          icon={icon}
          text={front}
          className="absolute inset-0 [backface-visibility:hidden]"
        />
        <CardFace
          variant="back"
          icon={icon}
          text={back}
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        />
      </div>
    </div>
  );
}

function CardFace({ variant, icon, text, className = "" }) {
  const isBack = variant === "back";
  return (
    <div
      className={`flex flex-col rounded-[20px] border p-5 md:p-6 ${
        isBack
          ? "border-[#1A1A1A]/15 bg-[#1A1A1A]/[0.05]"
          : "border-[#1A1A1A]/10 bg-[#1A1A1A]/[0.02]"
      } ${className}`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center ${
          isBack ? "text-[#1A1A1A]" : "text-[#1A1A1A]/55"
        }`}
      >
        {icon}
      </span>
      <p
        className={`mt-auto text-[14px] leading-[1.45] ${
          isBack ? "text-[#1A1A1A]" : "text-[#1A1A1A]/70"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

// Icons: copied from public/Icons (pen-nib, link, block-brick,
// hexagon-exclamation, lightbulb), inlined with `fill="currentColor"`
// so the same paths can render in muted on the front and full-tone
// on the back. Sizes follow each source SVG's intrinsic viewBox.
const ICONS = [
  // 1. pen-nib
  <svg
    key="pen-nib"
    width="22"
    height="22"
    viewBox="0 0 12 12"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8.63671 0.428906C9.14999 -0.084375 9.97968 -0.084375 10.493 0.428906L11.5734 1.50938C12.0867 2.02266 12.0867 2.85234 11.5734 3.36563L9.90936 5.02969L9.66561 5.27344L8.71171 8.76797C8.59921 9.18516 8.28749 9.51797 7.87968 9.66094L1.68749 11.8359C1.25389 11.9883 0.771082 11.8781 0.447644 11.5547C0.124207 11.2312 0.011707 10.7461 0.164051 10.3125L2.33905 4.12266C2.48202 3.71484 2.81483 3.40547 3.23202 3.29062L6.72655 2.33672L6.9703 2.09297L8.63436 0.428906H8.63671ZM6.95858 3.44063L3.52968 4.37578C3.47108 4.39219 3.42186 4.43672 3.40311 4.49531L1.53749 9.80156L3.8203 7.51641C3.77577 7.39453 3.74999 7.26328 3.74999 7.125C3.74999 6.50391 4.25389 6 4.87499 6C5.49608 6 5.99999 6.50391 5.99999 7.125C5.99999 7.74609 5.49608 8.25 4.87499 8.25C4.73671 8.25 4.60546 8.22422 4.48358 8.17969L2.19843 10.4648L7.50468 8.60156C7.56327 8.58047 7.6078 8.53359 7.62421 8.475L8.55936 5.04375L6.95858 3.44297V3.44063Z" />
  </svg>,
  // 2. link
  <svg
    key="link"
    width="24"
    height="22"
    viewBox="0 0 14 12"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M10.0195 2.0625C9.51797 2.0625 9.03047 2.22422 8.62969 2.51719C8.3625 2.24297 8.05781 1.99922 7.72969 1.79766C8.3625 1.24453 9.17578 0.9375 10.0195 0.9375C11.9414 0.9375 13.5 2.49609 13.5 4.41797C13.5 5.34141 13.1344 6.225 12.4805 6.87891L10.6266 8.73281C9.975 9.38438 9.08906 9.75234 8.16562 9.75234C6.24375 9.75234 4.68516 8.19375 4.68516 6.27188C4.68516 5.85234 4.76016 5.43984 4.90547 5.05547C5.01328 4.76484 5.33906 4.61719 5.62969 4.725C5.92031 4.83281 6.07031 5.15625 5.9625 5.44687C5.86406 5.70703 5.8125 5.98594 5.8125 6.27188C5.8125 7.57266 6.86719 8.62734 8.16797 8.62734C8.79141 8.62734 9.39141 8.37891 9.83203 7.93828L11.6859 6.08438C12.1266 5.63906 12.375 5.04141 12.375 4.41797C12.375 3.11719 11.3203 2.0625 10.0195 2.0625ZM5.33203 3.375C4.70859 3.375 4.10859 3.62344 3.66797 4.06406L1.81406 5.91797C1.37344 6.35859 1.125 6.95859 1.125 7.58203C1.125 8.88281 2.17969 9.9375 3.48047 9.9375C3.98203 9.9375 4.46953 9.77578 4.87031 9.48281C5.1375 9.75938 5.44219 10.0008 5.77031 10.2023C5.1375 10.7555 4.32422 11.0625 3.48047 11.0625C1.55859 11.0625 0 9.50391 0 7.58203C0 6.65859 0.365625 5.775 1.01953 5.12109L2.87344 3.26719C3.525 2.61562 4.41094 2.24766 5.33438 2.24766C7.25625 2.24766 8.81484 3.80625 8.81484 5.72812C8.81484 6.14766 8.73984 6.56016 8.59453 6.94453C8.48672 7.23516 8.16094 7.38281 7.87031 7.275C7.57969 7.16719 7.42969 6.84375 7.5375 6.55313C7.63594 6.29297 7.6875 6.01406 7.6875 5.73047C7.6875 4.42969 6.63281 3.375 5.33203 3.375Z" />
  </svg>,
  // 3. block-brick
  <svg
    key="block-brick"
    width="22"
    height="22"
    viewBox="0 0 11 12"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M3.375 1.875V3H7.125V1.875H3.375ZM2.25 3V1.875H1.5C1.29375 1.875 1.125 2.04375 1.125 2.25V3H2.25ZM1.125 4.125V5.4375H4.6875V4.125H1.125ZM1.125 7.875H2.25V6.5625H1.125V7.875ZM1.125 9V9.75C1.125 9.95625 1.29375 10.125 1.5 10.125H4.6875V9H1.125ZM3.375 7.875H7.125V6.5625H3.375V7.875ZM8.25 7.875H9.375V6.5625H8.25V7.875ZM9.375 9H5.8125V10.125H9C9.20625 10.125 9.375 9.95625 9.375 9.75V9ZM9.375 4.125H5.8125V5.4375H9.375V4.125ZM9.375 3V2.25C9.375 2.04375 9.20625 1.875 9 1.875H8.25V3H9.375ZM0 2.25C0 1.42266 0.672656 0.75 1.5 0.75H9C9.82734 0.75 10.5 1.42266 10.5 2.25V9.75C10.5 10.5773 9.82734 11.25 9 11.25H1.5C0.672656 11.25 0 10.5773 0 9.75V2.25Z" />
  </svg>,
  // 4. hexagon-exclamation
  <svg
    key="hexagon-exclamation"
    width="24"
    height="22"
    viewBox="0 0 14 12"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8.99529 0.375C9.59998 0.375 10.1601 0.698438 10.4601 1.22344L12.7148 5.16094C13.0125 5.68125 13.0125 6.31875 12.7148 6.83672L10.4601 10.7789C10.1601 11.3039 9.59998 11.6273 8.99529 11.6273H4.50466C3.89998 11.6273 3.33982 11.3039 3.03982 10.7789L0.785132 6.83906C0.487476 6.31875 0.487476 5.68125 0.785132 5.16328L3.03982 1.22578C3.33982 0.698437 3.89998 0.375 4.50466 0.375H8.99529ZM4.50466 1.5C4.3031 1.5 4.1156 1.60781 4.01716 1.78359L1.76248 5.72109C1.66404 5.89453 1.66404 6.10781 1.76248 6.27891L4.01716 10.2188C4.11794 10.3945 4.3031 10.5023 4.50466 10.5023H8.99529C9.19685 10.5023 9.38435 10.3945 9.48279 10.2188L11.7398 6.28125C11.8383 6.10781 11.8383 5.89453 11.7398 5.72344L9.48513 1.78594C9.38435 1.60781 9.19685 1.5 8.99529 1.5H4.50466ZM6.74998 9C6.55106 9 6.3603 8.92098 6.21965 8.78033C6.07899 8.63968 5.99998 8.44891 5.99998 8.25C5.99998 8.05109 6.07899 7.86032 6.21965 7.71967C6.3603 7.57902 6.55106 7.5 6.74998 7.5C6.94889 7.5 7.13965 7.57902 7.28031 7.71967C7.42096 7.86032 7.49998 8.05109 7.49998 8.25C7.49998 8.44891 7.42096 8.63968 7.28031 8.78033C7.13965 8.92098 6.94889 9 6.74998 9ZM6.74998 3C7.17654 3 7.51638 3.36328 7.48591 3.78984L7.31248 6.22734C7.29138 6.52266 7.04529 6.75 6.75232 6.75C6.45935 6.75 6.21326 6.52266 6.19216 6.22734L6.01873 3.78984C5.98357 3.36328 6.32341 3 6.74998 3Z" />
  </svg>,
  // 5. lightbulb
  <svg
    key="lightbulb"
    width="18"
    height="22"
    viewBox="0 0 9 12"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M6.94922 6.82266C7.52344 6.21563 7.875 5.4 7.875 4.5C7.875 2.63672 6.36328 1.125 4.5 1.125C2.63672 1.125 1.125 2.63672 1.125 4.5C1.125 5.4 1.47656 6.21563 2.05078 6.82266C2.55 7.34766 3.10313 8.08828 3.3 9H5.7C5.89687 8.08594 6.45 7.34766 6.94922 6.82266ZM7.76484 7.59609C7.21172 8.17969 6.75 8.89219 6.75 9.69609V10.125C6.75 11.1609 5.91094 12 4.875 12H4.125C3.08906 12 2.25 11.1609 2.25 10.125V9.69609C2.25 8.89219 1.78828 8.17969 1.23516 7.59609C0.46875 6.78984 0 5.7 0 4.5C0 2.01562 2.01562 0 4.5 0C6.98438 0 9 2.01562 9 4.5C9 5.7 8.53125 6.78984 7.76484 7.59609ZM3.375 4.3125C3.375 4.62422 3.12422 4.875 2.8125 4.875C2.50078 4.875 2.25 4.62422 2.25 4.3125C2.25 3.17344 3.17344 2.25 4.3125 2.25C4.62422 2.25 4.875 2.50078 4.875 2.8125C4.875 3.12422 4.62422 3.375 4.3125 3.375C3.79453 3.375 3.375 3.79453 3.375 4.3125Z" />
  </svg>,
];
