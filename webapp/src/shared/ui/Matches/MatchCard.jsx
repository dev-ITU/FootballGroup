import { CalendarDays, MapPin } from "lucide-react";

import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";
import Chip from "@/shared/ui/Chip/Chip.jsx";
import MatchStatusBadge from "@/shared/ui/Matches/MatchStatusBadge.jsx";
import MatchTeamsLine from "@/shared/ui/Matches/MatchTeamsLine.jsx";

function InfoBox({ icon: Icon, label, primary, secondary, light = false }) {
  return (
    <div
      className={cn(
        "rounded-[24px] border px-4 py-4",
        light
          ? "border-white/10 bg-white/[0.06] backdrop-blur-md"
          : "border-[#dbe8f4] bg-[linear-gradient(180deg,rgba(248,252,255,.98),rgba(239,247,253,.98))]",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]",
          light ? "text-white/42" : "text-[#7a93af]",
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.9} />
        {label}
      </div>

      <div
        className={cn(
          "mt-2 text-[15px] font-semibold leading-6",
          light ? "text-white" : "text-[#0b2344]",
        )}
      >
        {primary}
      </div>

      {secondary ? (
        <div
          className={cn(
            "mt-2 text-[14px] leading-6",
            light ? "text-white/68" : "text-[#5d789b]",
          )}
        >
          {secondary}
        </div>
      ) : null}
    </div>
  );
}

export default function MatchCard({
  match,
  clubName,
  variant = "default",
  topRight,
  className,
}) {
  const { t } = useI18n();
  const isFeatured = variant === "featured";

  if (isFeatured) {
    return (
      <article
        className={cn(
          "relative overflow-hidden rounded-[34px] border border-white/12 bg-[linear-gradient(180deg,#0a3b7b_0%,#082c5d_48%,#071f43_100%)] p-6 shadow-[0_28px_72px_rgba(8,31,61,.18)] md:p-7",
          className,
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,208,255,.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,.06),transparent_22%)]",
          )}
        />

        <div className={cn("relative z-[1] flex h-full flex-col")}>
          <div className={cn("flex flex-wrap items-center justify-between gap-3")}>
            <Chip
              variant="bright"
              className={cn("border border-white/10 bg-white/10 px-4 text-white")}
            >
              {t("match.featured")}
            </Chip>

            {topRight || <MatchStatusBadge status={match.statusMeta} light />}
          </div>

          <MatchTeamsLine
            clubName={clubName}
            opponent={match.opponent}
            resultText={match.resultText}
            light
            className={cn("mt-7")}
          />

          <div className={cn("mt-6 grid gap-3 md:grid-cols-2")}>
            <InfoBox
              icon={CalendarDays}
              label={t("common.calendar")}
              primary={match.fullDateLabel}
              secondary={match.timeLabel}
              light
            />
            <InfoBox
              icon={MapPin}
              label={t("common.arena")}
              primary={match.venueLabel}
              secondary={match.cityLabel}
              light
            />
          </div>

          <div className={cn("mt-3 flex flex-wrap items-start justify-between gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4 backdrop-blur-md")}>
            <div>
              <div className={cn("text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/42")}>
                {t("common.tournament")}
              </div>
              <div className={cn("mt-2 text-[15px] font-semibold leading-6 text-white")}>
                {match.competition}
              </div>
            </div>

            <MatchStatusBadge status={match.statusMeta} light />
          </div>

          {match.summaryText ? (
            <p className={cn("mt-4 max-w-[60ch] text-[14px] leading-7 text-white/72")}>
              {match.summaryText}
            </p>
          ) : null}

        </div>
      </article>
    );
  }

return (
  <article
    className={cn(
      "rounded-[30px] border border-[#dde9f5] bg-white/90 p-4 shadow-[0_14px_34px_rgba(8,31,61,.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(8,31,61,.08)] md:p-5",
      className,
    )}
  >
    <div
      className={cn(
        "grid gap-3 xl:grid-cols-[minmax(0,1.22fr)_200px_200px_148px] xl:items-center",
      )}
    >
      <div className={cn("flex flex-col gap-3")}>
        <MatchTeamsLine
          clubName={clubName}
          opponent={match.opponent}
          resultText={match.resultText}
        />

        <div className={cn("flex flex-wrap items-center gap-2")}>
          <Chip
            variant="lightSoft"
            className={cn("min-h-8 px-3 text-[12px] font-semibold")}
          >
            {match.competition}
          </Chip>

          {match.summaryText ? (
            <span className={cn("text-[13px] leading-6 text-[#6b83a3]")}>
              {match.summaryText}
            </span>
          ) : null}
        </div>
      </div>

      <InfoBox
        icon={CalendarDays}
        label={t("common.calendar")}
        primary={match.fullDateLabel}
        secondary={match.timeLabel}
      />

      <InfoBox
        icon={MapPin}
        label={t("common.arena")}
        primary={match.venueLabel}
        secondary={match.cityLabel}
      />

      <div className={cn("flex flex-col items-stretch gap-2 self-center xl:self-center")}>
        <MatchStatusBadge
          status={match.statusMeta}
          className={cn("w-full justify-center")}
        />
      </div>
    </div>
  </article>
);
}
