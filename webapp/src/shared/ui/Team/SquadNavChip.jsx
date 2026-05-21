import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";
import { getGroupMeta, scrollToAnchor } from "@/shared/lib/teamPlayers.js";
import PositionGlyph from "@/shared/ui/Team/PositionGlyph.jsx";

export default function SquadNavChip({ group, anchorId }) {
  const { language } = useI18n();
  const meta = getGroupMeta(group, language);

  return (
    <button
      type="button"
      onClick={() => scrollToAnchor(anchorId)}
      className={cn(
        "group inline-flex min-h-[74px] cursor-pointer items-center gap-3 rounded-[22px] border px-4 py-3 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(8,31,61,.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d4ea5]/20 md:min-h-[78px] md:px-5",
        meta.chipClass,
      )}
    >
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-[16px] transition-transform duration-300 group-hover:scale-[1.05]",
          meta.iconWrapClass,
        )}
      >
        <PositionGlyph code={meta.short} className="h-5 w-5" />
      </span>

      <span className={cn("flex min-w-0 flex-col")}>
        <span className={cn("text-[10px] font-extrabold uppercase tracking-[0.18em] opacity-60")}>
          {meta.short}
        </span>

        <span className={cn("mt-1 text-[15px] font-semibold leading-none md:text-[16px]")}>
          {group.label}
        </span>
      </span>

      <span
        className={cn(
          "ml-1 inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-[13px] font-bold shadow-[0_6px_14px_rgba(8,31,61,.10)]",
          meta.countClass,
        )}
      >
        {group.players.length}
      </span>
    </button>
  );
}
