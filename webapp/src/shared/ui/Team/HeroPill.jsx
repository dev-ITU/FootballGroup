import { cn } from "@/shared/lib/cn.js";

export default function HeroPill({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3.5 text-[11px] font-semibold shadow-[0_10px_24px_rgba(8,31,61,.05)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </span>
  );
}