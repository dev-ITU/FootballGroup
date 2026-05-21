import { cn } from "@/shared/lib/cn.js";

export default function PlayerTraitCard({ label, value, toneLine }) {
  return (
    <div className="rounded-[22px] border border-[#dce8f4] bg-white/90 p-4 shadow-[0_12px_28px_rgba(8,31,61,.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[13px] font-semibold text-[#17375f]">{label}</div>
        <div className="font-[var(--font-display)] text-[1.6rem] leading-none tracking-[-0.04em] text-[#0b2344]">
          {value}
        </div>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#e8f0f8]">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", toneLine)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}