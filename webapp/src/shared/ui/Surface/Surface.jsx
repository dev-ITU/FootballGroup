import { cn } from "@/shared/lib/cn.js";

const variantMap = {
  default:
    "border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,.62),rgba(241,247,255,.38))] text-[#081f3d] shadow-[inset_0_1px_0_rgba(255,255,255,.82),0_24px_56px_rgba(8,31,61,.08)] backdrop-blur-[22px]",
  soft:
    "border border-white/46 bg-[linear-gradient(180deg,rgba(238,245,255,.56),rgba(227,237,249,.32))] text-[#081f3d] shadow-[inset_0_1px_0_rgba(255,255,255,.76),0_22px_50px_rgba(8,31,61,.07)] backdrop-blur-[20px]",
  dark:
    "border border-white/12 bg-[linear-gradient(180deg,rgba(16,62,128,.52),rgba(8,31,67,.78))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_28px_64px_rgba(7,31,67,.22)] backdrop-blur-[22px]",
  transparent:
    "border border-white/54 bg-[linear-gradient(180deg,rgba(255,255,255,.46),rgba(243,248,255,.24))] text-[#081f3d] shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_22px_52px_rgba(8,31,61,.06)] backdrop-blur-[24px]",
};

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8 md:p-10",
};

const radiusMap = {
  lg: "rounded-[24px]",
  xl: "rounded-[32px]",
  "2xl": "rounded-[40px]",
};

export default function Surface({
  as: Comp = "div",
  variant = "default",
  padding = "md",
  radius = "xl",
  className,
  children,
  ...props
}) {
  const isDark = variant === "dark";
  const isTransparent = variant === "transparent";

  return (
    <Comp
      className={cn(
        "relative isolate overflow-hidden",
        variantMap[variant],
        paddingMap[padding],
        radiusMap[radius],
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit]",
          isDark
            ? "bg-[radial-gradient(circle_at_12%_0%,rgba(126,220,255,.18),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(255,255,255,.06),transparent_24%),linear-gradient(180deg,rgba(255,255,255,.08),transparent_28%)]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(99,208,255,.16),transparent_24%),radial-gradient(circle_at_left_center,rgba(255,255,255,.40),transparent_26%),linear-gradient(180deg,rgba(255,255,255,.18),transparent_24%)]",
        )}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-x-6 top-0 h-px",
          isDark ? "bg-white/18" : "bg-white/70",
        )}
      />

      {!isDark ? (
        <div
          className={cn(
            "pointer-events-none absolute -right-16 top-0 h-28 w-40 rounded-full blur-2xl",
            isTransparent ? "bg-white/30" : "bg-white/38",
          )}
        />
      ) : null}

      {children}
    </Comp>
  );
}