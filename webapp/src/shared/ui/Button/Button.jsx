import { LoaderCircle } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/shared/lib/cn.js";

const variantClassMap = {
  primary:
    "border border-white/36 bg-[linear-gradient(180deg,rgba(75,174,255,.96),rgba(17,114,229,.92))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.26),0_14px_32px_rgba(22,120,230,.32)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_20px_40px_rgba(22,120,230,.36)] [&>svg]:!text-white [&>span]:!text-white",
  secondary:
    "border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,.76),rgba(243,248,255,.54))] text-[#12355f] shadow-[inset_0_1px_0_rgba(255,255,255,.86),0_10px_24px_rgba(8,31,61,.08)] hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(255,255,255,.82),rgba(245,249,255,.64))]",
  ghost:
    "border border-white/54 bg-white/[0.42] text-[#102544] shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_10px_24px_rgba(8,31,61,.06)] hover:-translate-y-0.5 hover:bg-white/[0.56]",
  dark:
    "border border-white/12 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_12px_28px_rgba(7,31,67,.18)] hover:-translate-y-0.5 hover:bg-white/[0.12]",
  soft:
    "border border-white/60 bg-[linear-gradient(180deg,rgba(240,248,255,.9),rgba(230,242,255,.64))] text-[#0f4c90] shadow-[inset_0_1px_0_rgba(255,255,255,.82),0_10px_24px_rgba(8,31,61,.06)] hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(244,250,255,.96),rgba(235,245,255,.72))]",
};

const sizeClassMap = {
  sm: "min-h-10 px-4 text-[13px]",
  md: "min-h-[52px] px-5 text-sm",
  lg: "min-h-14 px-6 text-base",
};

const Button = forwardRef(function Button(
  {
    as: Comp = "button",
    variant = "primary",
    size = "md",
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    loading = false,
    fullWidth = false,
    iconOnly = false,
    className,
    children,
    disabled,
    type,
    ...props
  },
  ref,
) {
  const isButton = Comp === "button";
  const hasSideIcons = Boolean(LeftIcon || RightIcon);

  return (
    <Comp
      ref={ref}
      type={isButton ? type || "button" : undefined}
      disabled={isButton ? disabled || loading : undefined}
      className={cn(
        "inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-full font-semibold backdrop-blur-[18px] transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:pointer-events-none disabled:opacity-60",
        sizeClassMap[size] || sizeClassMap.md,
        variantClassMap[variant] || variantClassMap.primary,
        fullWidth && "w-full",
        iconOnly && "aspect-square px-0",
        className,
      )}
      {...props}
    >
      {loading ? (
        <LoaderCircle
          className="relative z-[1] h-4 w-4 animate-spin"
          strokeWidth={1.9}
        />
      ) : null}

      {!loading && LeftIcon ? (
        <LeftIcon
          className="relative z-[1] h-4 w-4 shrink-0 text-current"
          strokeWidth={1.9}
        />
      ) : null}

      {(!iconOnly || !hasSideIcons) && children ? (
        <span className="relative z-[1] text-current">{children}</span>
      ) : null}

      {!loading && RightIcon ? (
        <RightIcon
          className="relative z-[1] h-4 w-4 shrink-0 text-current"
          strokeWidth={1.9}
        />
      ) : null}
    </Comp>
  );
});

export default Button;