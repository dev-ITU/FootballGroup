import { useEffect, useState } from "react";
import {
  CalendarDays,
  Flag,
  MapPin,
  Shield,
  UserRound,
  Weight,
} from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

import usePageData from "@/features/page-data/usePageData.js";
import { cn } from "@/shared/lib/cn.js";
import { formatHeightValue, formatWeightValue, useI18n } from "@/shared/i18n/index.jsx";
import {
  buildPlayerBiography,
  buildPlayerTraits,
  buildRelatedPlayers,
  collectAllPlayers,
  getPlayerHeroStats,
  getPlayerTone,
  resolvePositionPlural,
} from "@/shared/lib/teamPlayers.js";
import TeamPlayerCard from "@/shared/ui/Team/TeamPlayerCard.jsx";
import Reveal from "@/shared/ui/Reveal/Reveal.jsx";
import Surface from "@/shared/ui/Surface/Surface.jsx";
import HeroPill from "@/shared/ui/Team/HeroPill.jsx";
import PlayerPoster from "@/shared/ui/Team/PlayerPoster.jsx";
import PlayerTraitCard from "@/shared/ui/Team/PlayerTraitCard.jsx";
import TeamInfoCard from "@/shared/ui/Team/TeamInfoCard.jsx";
import TeamMetricCard from "@/shared/ui/Team/TeamMetricCard.jsx";

export default function PlayerPage() {
  const { playerSlug } = useParams();
  const { data } = usePageData();
  const { language, t } = useI18n();
  const [photoBroken, setPhotoBroken] = useState(false);

  const allPlayers = collectAllPlayers(data, language);

  const player = allPlayers.find(
    (item) => String(item.slug || item.id) === String(playerSlug),
  );

  useEffect(() => {
    setPhotoBroken(false);
  }, [player?.photo_url]);

  if (!player) {
    return (
      <Navigate
        to="/error/"
        replace
        state={{ type: "not-found", title: t("team.playerNotFound") }}
      />
    );
  }

  const tone = getPlayerTone(player);
  const heroStats = getPlayerHeroStats(player, language);
  const traits = buildPlayerTraits(player, language);
  const biography = buildPlayerBiography(player, language);
  const relatedPlayers = buildRelatedPlayers(allPlayers, player, 3);

  return (
    <>
      <Reveal y={16} duration={0.42}>
        <section className="mt-3">
          <Surface
            padding="none"
            radius="2xl"
            className={cn(
              "overflow-hidden border-[#dce8f4] shadow-[0_24px_62px_rgba(56,99,146,.12)]",
              tone.heroBg,
            )}
          >
            <div className="relative px-4 py-4 md:px-6 md:py-5 xl:px-8 xl:py-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(108,197,255,.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,.76),transparent_30%)]" />

              <div className="relative z-[1] text-center">
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <HeroPill className={tone.chipClass}>
                    {player.position_label}
                  </HeroPill>

                  {player.captain ? (
                    <HeroPill className={tone.strongChipClass}>{t("team.captain")}</HeroPill>
                  ) : null}
                </div>

                <h1 className="mx-auto mt-4 max-w-[9ch] font-[var(--font-display)] text-[clamp(2.35rem,4.4vw,4.2rem)] leading-[0.84] tracking-[-0.07em] text-[#0b2344]">
                  {player.full_name}
                </h1>

                <p className="mx-auto mt-3 max-w-[40ch] text-[14px] leading-6 text-[#5f7899]">
                  {player.place_of_birth
                    ? t("player.heroSubtitle.withBirthPlace", {
                        place: player.place_of_birth,
                      })
                    : t("team.firstTeamPlayerLong")}
                </p>

                <div className="mx-auto mt-5 max-w-[360px] sm:max-w-[390px]">
                  <PlayerPoster
                    player={player}
                    variant="hero"
                    tone={tone}
                    photoBroken={photoBroken}
                    onPhotoError={() => setPhotoBroken(true)}
                  />
                </div>

                <div className="mx-auto mt-6 grid max-w-[900px] gap-3 md:grid-cols-3">
                  {heroStats.map((item) => (
                    <TeamMetricCard
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      lineClassName={tone.line}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Surface>
        </section>
      </Reveal>

      <Reveal y={18} duration={0.45}>
        <section className="mt-8">
          <div className="grid gap-6">
            <Surface
              padding="lg"
              radius="xl"
              className="border-[#dce8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(247,251,255,.98))] shadow-[0_16px_36px_rgba(8,31,61,.05)]"
            >
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0d4ea5]">
                  {t("team.profileEyebrow")}
                </div>
                <h2 className="mt-2 font-[var(--font-display)] text-[clamp(2rem,3vw,2.85rem)] leading-[0.92] tracking-[-0.045em] text-[#0b2344]">
                  {t("team.profileTitle")}
                </h2>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <TeamInfoCard
                  icon={CalendarDays}
                  label={t("common.birthDate")}
                  value={player.birth_date_label}
                  hint={player.age ? `${player.age} ${t("common.years")}` : null}
                />

                <TeamInfoCard
                  icon={MapPin}
                  label={t("common.birthPlace")}
                  value={player.place_of_birth || t("common.na")}
                />

                <TeamInfoCard
                  icon={Flag}
                  label={t("common.citizenship")}
                  value={player.citizenship || t("common.na")}
                  valueClassName="text-[15px] leading-5"
                />

                <TeamInfoCard
                  icon={UserRound}
                  label={t("common.previousClub")}
                  value={player.previous_club || t("common.na")}
                />

                <TeamInfoCard
                  icon={Shield}
                  label={t("common.position")}
                  value={player.position_label}
                />

                <TeamInfoCard
                  icon={Weight}
                  label={t("common.measurements")}
                  value={
                    [
                      player.height_cm
                        ? formatHeightValue(language, player.height_cm)
                        : null,
                      player.weight_kg
                        ? formatWeightValue(language, player.weight_kg)
                        : null,
                    ].filter(Boolean).join(" · ") || t("common.na")
                  }
                />
              </div>
            </Surface>

            <Surface
              padding="lg"
              radius="xl"
              className="border-[#dce8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(248,251,255,.98))] shadow-[0_16px_36px_rgba(8,31,61,.05)]"
            >
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0d4ea5]">
                  {t("team.traitsEyebrow")}
                </div>
                <h2 className="mt-2 font-[var(--font-display)] text-[clamp(1.8rem,2.6vw,2.5rem)] leading-[0.92] tracking-[-0.045em] text-[#0b2344]">
                  {t("team.traitsTitle")}
                </h2>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {traits.map((trait) => (
                  <PlayerTraitCard
                    key={trait.label}
                    label={trait.label}
                    value={trait.value}
                    toneLine={tone.line}
                  />
                ))}
              </div>
            </Surface>

            <Surface
              padding="lg"
              radius="xl"
              className="border-[#dce8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(247,251,255,.98))] shadow-[0_16px_36px_rgba(8,31,61,.05)]"
            >
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0d4ea5]">
                  {t("team.biographyEyebrow")}
                </div>
                <h2 className="mt-2 font-[var(--font-display)] text-[clamp(1.8rem,2.6vw,2.5rem)] leading-[0.92] tracking-[-0.045em] text-[#0b2344]">
                  {t("team.biographyTitle")}
                </h2>
              </div>

              <div className="mt-5 grid gap-4">
                {biography.map((paragraph, index) => (
                  <div
                    key={index}
                    className="rounded-[22px] border border-[#dce8f4] bg-[#f8fbff] p-5"
                  >
                    <p className="text-[15px] leading-8 text-[#5f7899]">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </section>
      </Reveal>

      {relatedPlayers.length ? (
        <Reveal y={18} duration={0.45}>
          <section className="mt-8">
            <div className="mb-5 rounded-[24px] border border-[#dce8f4] bg-white/82 p-4 shadow-[0_14px_34px_rgba(8,31,61,.05)] backdrop-blur-md">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0d4ea5]">
                  {t("team.sameLineEyebrow")}
                </div>
                <h2 className="mt-2 font-[var(--font-display)] text-[clamp(1.8rem,2.6vw,2.5rem)] leading-[0.92] tracking-[-0.045em] text-[#223a5b]">
                  {t("team.morePosition", {
                    position: resolvePositionPlural(player.position, language).toLowerCase(),
                  })}
                </h2>
              </div>

              <div className="mt-3.5 h-[3px] overflow-hidden rounded-full bg-[#dbe9f7]">
                <div
                  className={cn(
                    "h-full w-[180px] rounded-full bg-gradient-to-r",
                    tone.line,
                  )}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {relatedPlayers.map((item) => (
                <TeamPlayerCard
                  key={item.slug || item.full_name}
                  player={item}
                  to={`/team/${item.slug}/`}
                />
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}
    </>
  );
}
