import { cn } from "@/shared/lib/cn.js";
import { formatPlayerCount, useI18n } from "@/shared/i18n/index.jsx";
import { getGroupMeta } from "@/shared/lib/teamPlayers.js";
import PositionGlyph from "@/shared/ui/Team/PositionGlyph.jsx";

export default function GroupSectionHeader({ group, className }) {
  const { language } = useI18n();
  const meta = getGroupMeta(group, language);

  return (
    <div
      className={cn(
        "mb-5 rounded-[24px] border border-[#dce8f4] bg-white/80 p-4 shadow-[0_14px_34px_rgba(8,31,61,.05)] backdrop-blur-md",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-[18px]",
            meta.iconWrapClass,
          )}
        >
          <PositionGlyph code={meta.short} className="h-5 w-5" />
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6f87a8]">
              {meta.short}
            </span>

            <span className="inline-flex min-h-7 items-center rounded-full border border-[#d9e8f6] bg-white px-2.5 text-[11px] font-semibold text-[#527197]">
              {formatPlayerCount(language, group.players.length)}
            </span>
          </div>

          <h2 className="mt-1 font-[var(--font-display)] text-[clamp(1.7rem,2.6vw,2.5rem)] leading-[0.92] tracking-[-0.045em] text-[#223a5b]">
            {group.label}
          </h2>
        </div>
      </div>

      <div className="mt-3.5 h-[3px] overflow-hidden rounded-full bg-[#dbe9f7]">
        <div
          className={cn(
            "h-full w-[180px] rounded-full bg-gradient-to-r",
            meta.lineClass,
          )}
        />
      </div>
    </div>
  );
}
