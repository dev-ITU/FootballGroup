import { cn } from "@/shared/lib/cn.js";

const variants = {
  badge: "bg-[#0f75db]/10 text-[#0d4ea5]",
  bright: "bg-white/14 text-white",
  pill: "bg-[#0f75db]/8 text-[#5c7599]",
  darkSoft: "bg-white/14 text-white",
  lightSoft: "bg-[#f3f8fd] text-[#17406f] border border-[#dbe8f7]",
};

export default function Chip({
  children,
  variant = "badge",
  className,
  as: Comp = "span",
}) {
  return (
    <Comp
      className={cn(
        "inline-flex min-h-[38px] items-center justify-center rounded-full px-3.5 text-sm font-bold",
        variants[variant],
        className,
      )}
    >
      {children}
    </Comp>
  );
}