import { cn } from "@/shared/lib/cn.js";
import Surface from "@/shared/ui/Surface/Surface.jsx";

export default function Section({
  className,
  children,
  variant = "default",
  padded = true,
}) {
  const padding = padded ? "md" : "none";

  if (variant === "dark") {
    return (
      <Surface
        variant="dark"
        padding={padding}
        radius="2xl"
        className={cn(
          "relative mt-6 border border-white/10 bg-[radial-gradient(circle_at_100%_100%,rgba(63,146,255,.18),transparent_26%),radial-gradient(circle_at_0%_0%,rgba(255,255,255,.03),transparent_20%),linear-gradient(180deg,#0c2d61_0%,#0a2958_48%,#08244e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_28px_72px_rgba(5,18,44,.24)] md:mt-8",
          className,
        )}
      >
        <div className="relative z-[1]">{children}</div>
      </Surface>
    );
  }

  return (
    <Surface
      variant="transparent"
      padding={padding}
      radius="2xl"
      className={cn(
        "relative mt-6 border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,.58),rgba(242,248,255,.34))] backdrop-blur-[26px] shadow-[inset_0_1px_0_rgba(255,255,255,.84),0_26px_70px_rgba(8,31,61,.08)] md:mt-8",
        className,
      )}
    >
      <div className="relative z-[1]">{children}</div>
    </Surface>
  );
}