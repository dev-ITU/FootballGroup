import { cn } from "@/shared/lib/cn.js";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  align = "left",
  light = false,
}) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 md:mb-6",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "m-0 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em]",
            light ? "text-white/70" : "text-[#0d4ea5]",
          )}
        >
          <span
            className={cn(
              "inline-block h-[1px] w-6",
              light ? "bg-white/30" : "bg-[#0d4ea5]/40",
            )}
          />
          {eyebrow}
        </p>
      ) : null}

      {title ? (
        <h2
          className={cn(
            "m-0 max-w-[16ch] font-[var(--font-display)] text-[clamp(1.9rem,3vw,3.15rem)] leading-[0.94] tracking-[-0.05em]",
            light ? "text-white" : "text-[#06182f]",
            titleClassName,
          )}
        >
          {title}
        </h2>
      ) : null}

      {description ? (
        <p
          className={cn(
            "m-0 max-w-[62ch] text-[15px] leading-7",
            light ? "text-white/72" : "text-[#617b9b]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}