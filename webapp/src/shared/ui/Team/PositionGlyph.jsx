import { cn } from "@/shared/lib/cn.js";

export default function PositionGlyph({ code, className = "h-[18px] w-[18px]" }) {
  const baseProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    className: cn(className),
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (code === "GK") {
    return (
      <svg {...baseProps}>
        <path d="M5.5 18.5V7.25c0-.97.78-1.75 1.75-1.75h9.5c.97 0 1.75.78 1.75 1.75V18.5" />
        <path d="M8.5 18.5V9" />
        <path d="M15.5 18.5V9" />
        <path d="M8.5 9h7" />
        <circle cx="12" cy="13.25" r="2.25" />
      </svg>
    );
  }

  if (code === "DF") {
    return (
      <svg {...baseProps}>
        <path d="M12 3.5 18.5 6v5.35c0 3.95-2.45 7.2-6.5 9.15-4.05-1.95-6.5-5.2-6.5-9.15V6L12 3.5Z" />
        <path d="M12 8v8" />
        <path d="M8.9 12h6.2" />
      </svg>
    );
  }

  if (code === "MF") {
    return (
      <svg {...baseProps}>
        <circle cx="12" cy="12" r="2.75" />
        <path d="M12 4.5v2.5" />
        <path d="M12 17v2.5" />
        <path d="M4.5 12H7" />
        <path d="M17 12h2.5" />
        <path d="m6.8 6.8 1.8 1.8" />
        <path d="m15.4 15.4 1.8 1.8" />
        <path d="m17.2 6.8-1.8 1.8" />
        <path d="m8.6 15.4-1.8 1.8" />
      </svg>
    );
  }

  return (
    <svg {...baseProps}>
      <circle cx="12" cy="12" r="7.25" />
      <circle cx="12" cy="12" r="2.75" />
      <path d="M12 4.75v2" />
      <path d="M19.25 12h-2" />
      <path d="M12 19.25v-2" />
      <path d="M4.75 12h2" />
    </svg>
  );
}