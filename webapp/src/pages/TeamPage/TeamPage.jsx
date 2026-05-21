import usePageData from "@/features/page-data/usePageData.js";
import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";
import {
  buildVisibleGroups,
  collectAllPlayers,
  findCaptain,
  getAveragePlayerAge,
} from "@/shared/lib/teamPlayers.js";
import TeamPlayerCard from "@/shared/ui/Team/TeamPlayerCard.jsx";
import Reveal from "@/shared/ui/Reveal/Reveal.jsx";
import Surface from "@/shared/ui/Surface/Surface.jsx";
import CaptainSpotlight from "@/shared/ui/Team/CaptainSpotlight.jsx";
import GroupSectionHeader from "@/shared/ui/Team/GroupSectionHeader.jsx";
import SquadNavChip from "@/shared/ui/Team/SquadNavChip.jsx";
import TeamMetricCard from "@/shared/ui/Team/TeamMetricCard.jsx";

export default function TeamPage() {
  const { data } = usePageData();
  const { language, t } = useI18n();

  const visibleGroups = buildVisibleGroups(data, language);
  const allPlayers = collectAllPlayers(data, language);

  const captain = findCaptain(data, allPlayers, language);
  const totalPlayers = allPlayers.length;
  const averageAge = getAveragePlayerAge(allPlayers);
  const captainHref = captain ? `/team/${captain.slug}/` : "/team/";

  return (
    <>
      <Reveal y={16} duration={0.42}>
        <section className={cn("mt-3")}>
          <Surface
            padding="none"
            radius="2xl"
            className={cn(
              "overflow-hidden border-[#d9e7f4] bg-[linear-gradient(180deg,rgba(249,252,255,.96)_0%,rgba(237,245,253,.98)_100%)] shadow-[0_24px_62px_rgba(56,99,146,.12)]",
            )}
          >
            <div className={cn("relative grid xl:grid-cols-[minmax(0,1fr)_402px]")}>
              <div className={cn("relative p-6 md:p-7 xl:p-8 xl:pr-7")}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(108,197,255,.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.72),transparent_28%)]" />

                <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[140px] xl:block bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.88)_48%,rgba(213,231,247,.58)_78%,transparent)]" />
                <div className="pointer-events-none absolute right-0 top-[18%] hidden h-[260px] w-[110px] xl:block bg-[#8fdcff]/[0.14] blur-3xl" />

                <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 xl:block">
                  <div className="relative h-[210px] w-[210px] rounded-full border border-[#0d4ea5]/[0.035]" />
                  <div className="absolute left-6 top-6 h-[158px] w-[158px] rounded-full border border-[#0d4ea5]/[0.03]" />
                  <div className="absolute left-12 top-12 h-[106px] w-[106px] rounded-full border border-[#0d4ea5]/[0.025]" />
                </div>

                <div className="relative z-[1]">
                  <div className="inline-flex min-h-10 items-center rounded-full border border-white/70 bg-white/75 px-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0d4ea5] shadow-[0_10px_24px_rgba(8,31,61,.04)] backdrop-blur-md">
                    {t("team.firstTeam")}
                  </div>

                  <h1 className="mt-4 max-w-[6ch] font-[var(--font-display)] text-[clamp(2.85rem,5vw,5.05rem)] leading-[0.84] tracking-[-0.065em] text-[#0b2344]">
                    {t("team.squadTitle")}
                  </h1>

                  <p className="mt-4 max-w-[48ch] text-[15px] leading-7 text-[#5f7899]">
                    {t("team.squadDescription")}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    {visibleGroups.map((group) => (
                      <SquadNavChip
                        key={group.anchorId}
                        group={group}
                        anchorId={group.anchorId}
                      />
                    ))}
                  </div>

                  <div className="mt-7 grid gap-3 md:grid-cols-3">
                    <TeamMetricCard label={t("team.metric.players")} value={totalPlayers} />
                    <TeamMetricCard label={t("team.metric.lines")} value={visibleGroups.length} />
                    <TeamMetricCard
                      label={t("team.metric.averageAge")}
                      value={averageAge ? String(averageAge) : "—"}
                      hint={averageAge ? t("common.years") : null}
                    />
                  </div>
                </div>
              </div>

              <div className="relative border-t border-white/70 p-3 xl:border-t-0 xl:p-3.5 xl:pl-1.5">
                <div className="pointer-events-none absolute inset-y-6 left-0 hidden w-[52px] xl:block bg-[linear-gradient(90deg,rgba(255,255,255,.72),transparent)]" />
                <div className="pointer-events-none absolute left-0 top-[20%] hidden h-[220px] w-[68px] xl:block bg-[#84d2ff]/[0.16] blur-2xl" />

                <CaptainSpotlight captain={captain} href={captainHref} />
              </div>
            </div>
          </Surface>
        </section>
      </Reveal>

      {visibleGroups.map((group, index) => (
        <Reveal
          key={group.anchorId}
          y={18}
          duration={0.45}
          delay={Math.min(index * 0.04, 0.16)}
        >
          <section id={group.anchorId} className="mt-8 scroll-mt-28">
            <GroupSectionHeader group={group} />

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {group.players.map((player) => (
                <TeamPlayerCard
                  key={player.slug || player.full_name}
                  player={player}
                  to={`/team/${player.slug}/`}
                />
              ))}
            </div>
          </section>
        </Reveal>
      ))}
    </>
  );
}
