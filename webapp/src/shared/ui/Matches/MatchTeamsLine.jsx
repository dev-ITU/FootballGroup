import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";
import { initialsOfTeam } from "@/shared/lib/matches.js";

function TeamNode({
  title,
  label,
  initials,
  accent = "club",
  light = false,
  align = "left",
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        align === "right" && "justify-end text-right",
      )}
    >
      {align === "right" ? (
        <>
          <div className={cn("min-w-0")}>
            <div
              className={cn(
                "truncate text-[10px] font-extrabold uppercase tracking-[0.16em]",
                light ? "text-white/42" : "text-[#87a0bc]",
              )}
            >
              {title}
            </div>

            <div
              className={cn(
                "truncate text-[15px] font-semibold leading-5",
                light ? "text-white" : "text-[#0b2344]",
              )}
            >
              {label}
            </div>
          </div>

          <span
            className={cn(
              "grid shrink-0 place-items-center rounded-full border font-extrabold",
              light
                ? "h-14 w-14 border-white/14 bg-white/10 text-white"
                : "h-14 w-14 border-[#d6e4f1] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9fc_100%)] text-[#27446a]",
              accent === "club" &&
                !light &&
                "border-sky-200 bg-[linear-gradient(180deg,#f8fdff_0%,#eaf5ff_100%)] text-[#0d4ea5]",
              "text-[15px]",
            )}
          >
            {initials}
          </span>
        </>
      ) : (
        <>
          <span
            className={cn(
              "grid shrink-0 place-items-center rounded-full border font-extrabold",
              light
                ? "h-14 w-14 border-white/14 bg-white/10 text-white"
                : "h-14 w-14 border-[#d6e4f1] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9fc_100%)] text-[#27446a]",
              accent === "club" &&
                !light &&
                "border-sky-200 bg-[linear-gradient(180deg,#f8fdff_0%,#eaf5ff_100%)] text-[#0d4ea5]",
              "text-[15px]",
            )}
          >
            {initials}
          </span>

          <div className={cn("min-w-0")}>
            <div
              className={cn(
                "truncate text-[10px] font-extrabold uppercase tracking-[0.16em]",
                light ? "text-white/42" : "text-[#87a0bc]",
              )}
            >
              {title}
            </div>

            <div
              className={cn(
                "truncate text-[15px] font-semibold leading-5",
                light ? "text-white" : "text-[#0b2344]",
              )}
            >
              {label}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function MatchTeamsLine({
  clubName,
  opponent,
  resultText,
  light = false,
  className,
}) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "grid gap-4 md:grid-cols-[minmax(0,1fr)_110px_minmax(0,1fr)] md:items-center md:gap-8",
        className,
      )}
    >
      <TeamNode
        title={t("match.team.club")}
        label={clubName}
        initials={initialsOfTeam(clubName)}
        accent="club"
        light={light}
        align="left"
      />

      <div
        className={cn(
          "mx-auto inline-flex min-h-[84px] min-w-[110px] items-center justify-center rounded-[24px] border px-5 shadow-[inset_0_1px_0_rgba(255,255,255,.8)]",
          light
            ? "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.05))] shadow-[0_14px_34px_rgba(3,16,38,.16)]"
            : "border-[#d9e8f6] bg-[linear-gradient(180deg,#f9fcff_0%,#eef6fd_100%)]",
        )}
      >
        <span
          className={cn(
            "font-[var(--font-display)] text-[clamp(1.9rem,2.8vw,2.8rem)] leading-none tracking-[-0.06em]",
            light ? "text-white" : "text-[#0b2344]",
          )}
        >
          {resultText}
        </span>
      </div>

      <TeamNode
        title={t("match.team.opponent")}
        label={opponent}
        initials={initialsOfTeam(opponent)}
        accent="opponent"
        light={light}
        align="right"
      />
    </div>
  );
}
