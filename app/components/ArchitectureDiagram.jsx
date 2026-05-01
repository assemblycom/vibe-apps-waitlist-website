export function ArchitectureDiagram() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Studio layer (top) */}
      <div className="relative z-10 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-5 shadow-[0_0_40px_rgba(255,255,255,0.04)]">
        <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.08em] text-white/40">
          Layer 02 — AI
        </div>
        <div className="text-sm font-semibold text-white">
          Studio — AI-generated client apps
        </div>
        <div className="mt-1 text-[13px] text-white/55">
          Describe → generate → ship
        </div>
      </div>

      {/* Connector */}
      <div className="mx-auto h-6 w-px bg-gradient-to-b from-white/20 to-white/5" />

      {/* Assembly layer (base) */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5">
        <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.08em] text-white/40">
          Layer 01 — Platform
        </div>
        <div className="text-sm font-semibold text-white">
          Assembly — the operating system
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] text-white/50">
          <span>Auth</span>
          <span>CRM</span>
          <span>Billing</span>
          <span>Messaging</span>
          <span>Permissions</span>
          <span>Client portal</span>
        </div>
      </div>
    </div>
  );
}
