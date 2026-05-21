import { cn } from "@/shared/lib/cn.js";

const sizeMap = {
  sm: {
    wrap: "inset-x-0 top-[16px] bottom-[46px]",
    box: "h-[154px] w-[154px]",
    second: "inset-[18px]",
    third: "inset-[40px]",
    glow: "inset-[28px]",
  },
  lg: {
    wrap: "inset-x-0 top-[18px] bottom-[18px]",
    box: "h-[208px] w-[208px]",
    second: "inset-[24px]",
    third: "inset-[50px]",
    glow: "inset-[36px]",
  },
};

export default function PosterRings({
  ringClass,
  glowClass,
  size = "sm",
  className,
}) {
  const preset = sizeMap[size] || sizeMap.sm;

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[1] flex items-center justify-center",
        preset.wrap,
        className,
      )}
    >
      <div className={cn("relative", preset.box)}>
        <div className={cn("absolute inset-0 rounded-full border", ringClass)} />
        <div
          className={cn("absolute rounded-full border", preset.second, ringClass)}
        />
        <div
          className={cn("absolute rounded-full border", preset.third, ringClass)}
        />
        <div
          className={cn(
            "absolute rounded-full blur-2xl",
            preset.glow,
            glowClass,
          )}
        />
      </div>
    </div>
  );
}