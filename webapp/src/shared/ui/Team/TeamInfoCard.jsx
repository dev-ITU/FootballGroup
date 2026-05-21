import { cn } from "@/shared/lib/cn.js";

export default function TeamInfoCard({
  icon: Icon,
  label,
  value,
  hint,
  valueClassName,
}) {
  return (
    <div className="rounded-[22px] border border-[#dce8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(248,251,255,.98))] p-4 shadow-[0_14px_32px_rgba(8,31,61,.04)]">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] border border-[#e2edf8] bg-[#f6faff] text-[#0d4ea5]">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>

        <div className="min-w-0">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#7b91ac]">
            {label}
          </div>

          <div
            className={cn(
              "mt-1.5 break-words text-[17px] font-semibold leading-6 text-[#0b2344]",
              valueClassName,
            )}
          >
            {value || "—"}
          </div>

          {hint ? (
            <div className="mt-1 text-[13px] leading-5 text-[#6681a4]">
              {hint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}