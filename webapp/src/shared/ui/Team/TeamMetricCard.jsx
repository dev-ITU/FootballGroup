import { cn } from "@/shared/lib/cn.js";

export default function TeamMetricCard({
  label,
  value,
  hint,
  lineClassName,
  className,
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-[#d7e6f4] bg-white/92 px-4 py-4 shadow-[0_12px_26px_rgba(8,31,61,.05)]",
        className,
      )}
    >
      <div className={cn("text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7b91ac]")}>
        {label}
      </div>

      <div
        className={cn(
          "mt-2 font-[var(--font-display)] text-[clamp(1.7rem,2.4vw,2.35rem)] leading-none tracking-[-0.045em] text-[#0b2344]",
        )}
      >
        {value}
      </div>

      {hint ? (
        <div className={cn("mt-1.5 text-[12px] leading-5 text-[#6982a3]")}>
          {hint}
        </div>
      ) : null}

      {lineClassName ? (
        <div className={cn("mt-3 h-[3px] overflow-hidden rounded-full bg-[#e5eef8]")}>
          <div
            className={cn(
              "h-full w-[96px] rounded-full bg-gradient-to-r",
              lineClassName,
            )}
          />
        </div>
      ) : null}
    </div>
  );
}