import { CalendarPlus } from "lucide-react";
import { useMemo, useState } from "react";

import CountdownChip from "@/features/countdown/CountdownChip.jsx";
import usePageData from "@/features/page-data/usePageData.js";
import { cn } from "@/shared/lib/cn.js";
import { formatMatchCount, useI18n } from "@/shared/i18n/index.jsx";
import {
  buildMonthOptions,
  buildTournamentOptions,
  filterMatches,
  groupMatchesByMonth,
  normalizeMatch,
} from "@/shared/lib/matches.js";
import Chip from "@/shared/ui/Chip/Chip.jsx";
import Reveal from "@/shared/ui/Reveal/Reveal.jsx";
import SectionHeading from "@/shared/ui/Section/SectionHeading.jsx";
import Select from "@/shared/ui/Select/Select.jsx";
import Surface from "@/shared/ui/Surface/Surface.jsx";
import MatchCard from "@/shared/ui/Matches/MatchCard.jsx";
import StatCard from "@/shared/ui/StatCard/StatCard.jsx";

export default function MatchesPage() {
  const { data } = usePageData();
  const { language, t } = useI18n();

  const feedOptions = [
    { value: "all", label: t("matches.feed.all") },
    { value: "upcoming", label: t("matches.feed.upcoming") },
    { value: "finished", label: t("matches.feed.finished") },
    { value: "live", label: t("matches.feed.live") },
  ];

  const clubName =
    data?.club?.name ||
    data?.club_profile?.name ||
    data?.team_name ||
    t("matches.defaultClubName");

  const rawMatches = Array.isArray(data?.matches) ? data.matches : [];
  const matchHub = data?.match_hub ?? {};

  const normalizedMatches = useMemo(() => {
    return rawMatches
      .map((match, index) => normalizeMatch(match, index, language))
      .sort((a, b) => {
        const left = a.date?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const right = b.date?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return left - right;
      });
  }, [language, rawMatches]);

  const featuredMatch = useMemo(() => {
    if (data?.featured_match) {
      return normalizeMatch(data.featured_match, -1, language);
    }

    return (
      normalizedMatches.find((item) => item.state === "upcoming") ||
      normalizedMatches[0] ||
      null
    );
  }, [data?.featured_match, language, normalizedMatches]);

  const tournamentOptions = useMemo(
    () => buildTournamentOptions(normalizedMatches, language),
    [language, normalizedMatches],
  );

  const monthOptions = useMemo(
    () => buildMonthOptions(normalizedMatches, language),
    [language, normalizedMatches],
  );

  const [feedMode, setFeedMode] = useState("all");
  const [tournamentFilter, setTournamentFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  const filteredMatches = useMemo(() => {
    return filterMatches(normalizedMatches, {
      feedMode,
      tournamentFilter,
      monthFilter,
    });
  }, [normalizedMatches, feedMode, tournamentFilter, monthFilter]);

  const groupedMatches = useMemo(
    () => groupMatchesByMonth(filteredMatches),
    [filteredMatches],
  );

  const subscribeCalendarUrl =
    data?.calendar_subscribe_url ||
    matchHub?.calendar_subscribe_url ||
    data?.calendar_url ||
    "";

  const totalMatches = normalizedMatches.length;
  const upcomingCount = normalizedMatches.filter((item) => item.state === "upcoming").length;
  const finishedCount = normalizedMatches.filter((item) => item.state === "finished").length;

  return (
    <>
      <Reveal y={16} duration={0.42}>
        <section className={cn("mt-3")}>
          <div className={cn("grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,.92fr)]")}>
            <Surface
              padding="none"
              radius="2xl"
              className={cn(
                "overflow-hidden border-[#d9e7f4] bg-[linear-gradient(180deg,rgba(249,252,255,.97)_0%,rgba(237,245,253,.99)_100%)] shadow-[0_24px_62px_rgba(56,99,146,.12)]",
              )}
            >
              <div className={cn("relative p-6 md:p-7 xl:p-8")}>
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(108,197,255,.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.72),transparent_28%)]",
                  )}
                />
                <div
                  className={cn(
                    "pointer-events-none absolute right-[10%] top-[10%] hidden h-[210px] w-[210px] rounded-full border border-[#0d4ea5]/[0.035] xl:block",
                  )}
                />
                <div
                  className={cn(
                    "pointer-events-none absolute right-[14%] top-[16%] hidden h-[148px] w-[148px] rounded-full border border-[#0d4ea5]/[0.028] xl:block",
                  )}
                />

                <div className={cn("relative z-[1]")}>
                  <Chip
                    variant="badge"
                    className={cn("px-4 text-[12px] font-extrabold")}
                  >
                    {t("matches.heroBadge")}
                  </Chip>

                  <h1
                    className={cn(
                      "mt-4 max-w-[7ch] font-[var(--font-display)] text-[clamp(2.8rem,5vw,5.05rem)] leading-[0.86] tracking-[-0.065em] text-[#0b2344]",
                    )}
                  >
                    {t("matches.heroTitle")}
                  </h1>

                  <p
                    className={cn(
                      "mt-4 max-w-[52ch] text-[15px] leading-7 text-[#5f7899]",
                    )}
                  >
                    {t("matches.heroDescription")}
                  </p>

                  <div className={cn("mt-7 grid gap-3 md:grid-cols-3")}>
                    <StatCard label={t("matches.stat.total")} value={totalMatches} />
                    <StatCard label={t("matches.stat.upcoming")} value={upcomingCount} />
                    <StatCard label={t("matches.stat.finished")} value={finishedCount} />
                  </div>

                  <div className={cn("mt-7 flex flex-wrap items-center gap-3")}>
                    {subscribeCalendarUrl ? (
                      <a
                        href={subscribeCalendarUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          "group inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d7e6f4] bg-white px-4 text-[13px] font-bold text-[#0d4ea5] shadow-[0_10px_22px_rgba(8,31,61,.04)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f8fbff]",
                        )}
                      >
                        <CalendarPlus className={cn("h-4 w-4")} strokeWidth={1.9} />
                        {t("matches.subscribeCalendar")}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </Surface>

            <MatchCard
              match={featuredMatch}
              clubName={clubName}
              variant="featured"
              topRight={
                featuredMatch?.kickoff_iso ? (
                  <CountdownChip kickoffIso={featuredMatch.kickoff_iso} dark />
                ) : null
              }
            />
          </div>
        </section>
      </Reveal>

      <Reveal y={12} blur={3} duration={0.4} amount={0.01}>
        <section className={cn("mt-8")}>
          <Surface
            variant="transparent"
            padding="lg"
            radius="xl"
            className={cn(
              "isolate overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(180deg,rgba(255,255,255,.22),transparent_28%)]",
            )}
          >
            <SectionHeading
              eyebrow={t("matches.sectionEyebrow")}
              title={t("matches.sectionTitle")}
              className={cn("mb-6")}
              titleClassName={cn("max-w-[14ch]")}
            />

            <div className={cn("relative z-[2] grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_260px_170px] xl:items-end")}>
              <div>
                <div className={cn("mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5e7697]")}>
                  {t("matches.filter.type")}
                </div>
                <Select
                  options={feedOptions}
                  value={feedMode}
                  onChange={setFeedMode}
                  placeholder={t("matches.filter.placeholderType")}
                  triggerClassName={cn("min-h-[54px] rounded-[20px]")}
                />
              </div>

              <div>
                <div className={cn("mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5e7697]")}>
                  {t("matches.filter.tournament")}
                </div>
                <Select
                  options={tournamentOptions}
                  value={tournamentFilter}
                  onChange={setTournamentFilter}
                  placeholder={t("matches.filter.placeholderTournament")}
                  triggerClassName={cn("min-h-[54px] rounded-[20px]")}
                />
              </div>

              <div>
                <div className={cn("mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5e7697]")}>
                  {t("matches.filter.month")}
                </div>
                <Select
                  options={monthOptions}
                  value={monthFilter}
                  onChange={setMonthFilter}
                  placeholder={t("matches.filter.placeholderMonth")}
                  triggerClassName={cn("min-h-[54px] rounded-[20px]")}
                />
              </div>

              <div
                className={cn(
                  "inline-flex min-h-[54px] items-center justify-center rounded-full border border-[#d9e7f4] bg-white/90 px-4 text-[13px] font-semibold text-[#4f6b8d] shadow-[0_10px_22px_rgba(8,31,61,.04)]",
                )}
              >
                {t("matches.filter.inFeed", { count: filteredMatches.length })}
              </div>
            </div>

            <div className={cn("relative z-[1] mt-8 flex flex-col gap-6")}>
              {groupedMatches.length ? (
                groupedMatches.map((group) => (
                  <div key={group.monthKey}>
                    <div className={cn("mb-4 flex items-center gap-3")}>
                      <h3
                        className={cn(
                          "font-[var(--font-display)] text-[clamp(1.65rem,2.4vw,2.5rem)] leading-[0.94] tracking-[-0.045em] text-[#0b2344]",
                        )}
                      >
                        {group.monthLabel}
                      </h3>

                      <span
                        className={cn(
                          "inline-flex min-h-8 items-center rounded-full border border-[#d9e7f4] bg-white/90 px-3 text-[12px] font-semibold text-[#456487]",
                        )}
                      >
                        {formatMatchCount(language, group.items.length)}
                      </span>
                    </div>

                    <div className={cn("flex flex-col gap-4")}>
                      {group.items.map((match) => (
                        <MatchCard
                          key={`${match.opponent}-${match.kickoff_iso || match.index}-${match.status || match.state}`}
                          match={match}
                          clubName={clubName}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={cn(
                    "rounded-[28px] border border-dashed border-[#d8e5f2] bg-[#f8fbff] px-5 py-6 text-[15px] leading-7 text-[#567291]",
                  )}
                >
                  {t("matches.empty")}
                </div>
              )}
            </div>
          </Surface>
        </section>
      </Reveal>
    </>
  );
}
