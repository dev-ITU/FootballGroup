import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";

const toneClassMap = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  live: "border-sky-200 bg-sky-50 text-sky-700",
  upcoming: "border-[#cfe4f7] bg-[#f3f9ff] text-[#1d5d94]",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function MatchStatusBadge({
  status,
  className,
  light = false,
}) {
  const { t } = useI18n();
  const Icon = status?.icon;

  return (
    <span
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-[12px] font-bold",
        light
          ? "border-white/14 bg-white text-[#082349]"
          : toneClassMap[status?.tone] || toneClassMap.neutral,
        className,
      )}
    >
      {Icon ? <Icon className="h-4 w-4" strokeWidth={1.9} /> : null}
      {status?.label || t("match.status.default")}
    </span>
  );
}
