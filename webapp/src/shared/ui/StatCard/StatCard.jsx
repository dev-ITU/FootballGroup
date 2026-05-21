import { cn } from "@/shared/lib/cn.js";
import Surface from "@/shared/ui/Surface/Surface.jsx";

const variantMap = {
  default: "bg-white/84 border-[rgba(10,44,94,.08)]",
  soft: "bg-[#f8fbff] border-[#e3edf8]",
  accent:
    "bg-[linear-gradient(180deg,rgba(15,117,219,.10),rgba(15,117,219,.04))] border-[rgba(15,117,219,.16)]",
  dark:
    "border-white/10 bg-white/[0.06] text-white",
};

export default function StatCard({
  label,
  value,
  hint,
  className,
  valueClassName,
  labelClassName,
  variant = "default",
}) {
  return (
    <Surface
      padding="sm"
      radius="lg"
      className={cn(
        "h-full border shadow-none backdrop-blur-0",
        variantMap[variant],
        className,
      )}
    >
      {label ? (
        <span
          className={cn(
            "mb-2 block text-[12px] font-bold uppercase tracking-[0.12em]",
            variant === "dark" ? "text-white/60" : "text-[#6b83a3]",
            labelClassName,
          )}
        >
          {label}
        </span>
      ) : null}

      <strong
        className={cn(
          "block font-[var(--font-display)] text-[clamp(1.7rem,2.4vw,2.35rem)] leading-none",
          variant === "dark" ? "text-white" : "text-[#081f3d]",
          valueClassName,
        )}
      >
        {value}
      </strong>

      {hint ? (
        <p
          className={cn(
            "mt-2 text-sm leading-6",
            variant === "dark" ? "text-white/68" : "text-[#5c7599]",
          )}
        >
          {hint}
        </p>
      ) : null}
    </Surface>
  );
}