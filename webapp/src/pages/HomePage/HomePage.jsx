import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Images,
  Newspaper,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

import CountdownChip from "@/features/countdown/CountdownChip.jsx";
import usePageData from "@/features/page-data/usePageData.js";
import { cn } from "@/shared/lib/cn.js";
import { translateGalleryCategory, useI18n } from "@/shared/i18n/index.jsx";
import {
  localizeGalleryItem,
  localizeStory,
  localizeTrophy,
} from "@/shared/lib/contentLocalization.js";
import { normalizeMatch } from "@/shared/lib/matches.js";
import { normalizeTeamPlayer } from "@/shared/lib/teamPlayers.js";
import Button from "@/shared/ui/Button/Button.jsx";
import Reveal from "@/shared/ui/Reveal/Reveal.jsx";
import Section from "@/shared/ui/Section/Section.jsx";
import SectionHeading from "@/shared/ui/Section/SectionHeading.jsx";
import StatCard from "@/shared/ui/StatCard/StatCard.jsx";
import Surface from "@/shared/ui/Surface/Surface.jsx";
import TeamPlayerCard from "@/shared/ui/Team/TeamPlayerCard.jsx";
import StadiumScene from "@/widgets/stadium/StadiumScene.jsx";

const statKeys = ["wins", "goals", "clean_sheets"];

function truncateText(value, maxLength = 140) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

const lightCard =
  "border border-[#dce8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.97),rgba(245,249,255,.93))] shadow-[0_14px_34px_rgba(8,31,61,.05)]";

const softCard =
  "border border-[#dce8f4] bg-[linear-gradient(180deg,rgba(248,251,255,.98),rgba(239,246,255,.96))] shadow-[0_14px_34px_rgba(8,31,61,.05)]";

const darkCard =
  "border border-white/10 bg-[radial-gradient(circle_at_100%_100%,rgba(60,145,255,.16),transparent_30%),linear-gradient(180deg,#15386f_0%,#102f61_52%,#0c2650_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_20px_44px_rgba(4,18,44,.24)]";

const darkSoftCard =
  "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03))] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_16px_34px_rgba(4,18,44,.18)]";

function HeroMiniMatchCard({ match, tone = "light" }) {
  const { language } = useI18n();
  const normalizedMatch = normalizeMatch(match, -1, language);

  if (!match) return null;

  const isDark = tone === "dark";

  return (
    <article
      className={cn(
        "group rounded-[22px] p-4 transition duration-300 hover:-translate-y-0.5",
        isDark
          ? "relative overflow-hidden border border-white/10 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]"
          : `relative overflow-hidden ${lightCard}`,
      )}
    >
      <div
        className={cn(
          "text-[10px] font-extrabold uppercase tracking-[0.16em]",
          isDark ? "text-white/44" : "text-[#7b91ac]",
        )}
      >
        {normalizedMatch.competition}
      </div>

      <div
        className={cn(
          "mt-2 font-[var(--font-display)] text-[1.02rem] leading-[0.96] tracking-[-0.04em]",
          isDark ? "text-white" : "text-[#0b2344]",
        )}
      >
        {normalizedMatch.opponent}
      </div>

      <div
        className={cn(
          "mt-2 flex items-center gap-2 text-[12px] leading-5",
          isDark ? "text-white/72" : "text-[#5f7899]",
        )}
      >
        <CalendarDays
          className={cn(
            "h-4 w-4 shrink-0",
            isDark ? "text-white/88" : "text-[#0d4ea5]",
          )}
          strokeWidth={1.9}
        />
        <span>{normalizedMatch.fullDateLabel}</span>
      </div>

      <div
        className={cn(
          "mt-1 flex items-center gap-2 text-[12px] leading-5",
          isDark ? "text-white/72" : "text-[#5f7899]",
        )}
      >
        <Clock3
          className={cn(
            "h-4 w-4 shrink-0",
            isDark ? "text-white/88" : "text-[#0d4ea5]",
          )}
          strokeWidth={1.9}
        />
        <span>{normalizedMatch.timeLabel}</span>
      </div>
    </article>
  );
}

function EditorialStoryCard({
  story,
  fallbackImage,
  fallbackText,
  fallbackTitle,
  featured = false,
}) {
  const { t } = useI18n();
  const image = story?.cover_url || fallbackImage;
  const excerpt = truncateText(
    story?.excerpt || fallbackText,
    featured ? 50 : 34,
  );

  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-[30px] border border-white/50 bg-[#dfe8f3] shadow-[0_20px_46px_rgba(8,31,61,.10)]",
        featured
          ? "min-h-[300px] sm:min-h-[340px] lg:min-h-[380px]"
          : "min-h-[220px] sm:min-h-[195px]",
      )}
    >
      {image ? (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#d8e4f2_0%,#cfdeef_100%)]">
          <img
            src={image}
            alt={story?.title || fallbackTitle}
            className={cn(
              "absolute inset-0 h-full w-full transition duration-700 group-hover:scale-[1.03]",
              featured
                ? [
                    "object-contain object-center",
                    "sm:object-cover sm:object-[center_top]",
                    "lg:object-[center_18%]",
                    "xl:object-[center_14%]",
                  ]
                : [
                    "object-contain object-center",
                    "sm:object-cover sm:object-[center_top]",
                  ],
            )}
          />
        </div>
      ) : null}

      <div
        className={cn(
          "absolute inset-0",
          featured
            ? "bg-[linear-gradient(180deg,rgba(7,31,67,.04)_0%,rgba(7,31,67,.10)_30%,rgba(7,31,67,.78)_100%)]"
            : "bg-[linear-gradient(180deg,rgba(7,31,67,.04)_0%,rgba(7,31,67,.12)_40%,rgba(7,31,67,.78)_100%)]",
        )}
      />

      <div
        className={cn(
          "absolute z-[2] rounded-[22px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.05))] backdrop-blur-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_18px_40px_rgba(7,31,67,.18)]",
          featured
            ? "bottom-4 left-4 w-[calc(100%-32px)] max-w-[360px] p-3.5 md:p-4"
            : "bottom-3 left-3 w-[calc(100%-24px)] max-w-[250px] p-3",
        )}
      >
        <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/72">
          {story?.published_label || t("home.newsDefault")}
        </div>

        <h3
          className={cn(
            "mt-2 font-[var(--font-display)] tracking-[-0.04em] text-white",
            featured
              ? "max-w-[11ch] text-[clamp(.96rem,1.25vw,1.26rem)] leading-[0.98]"
              : "max-w-[12ch] text-[clamp(.86rem,.98vw,1rem)] leading-[1.02]",
          )}
        >
          {story?.title || fallbackTitle}
        </h3>

        {excerpt ? (
          <p
            className={cn(
              "mt-2 text-white/78",
              featured
                ? "max-w-[28ch] text-[9px] leading-[1.32] md:text-[10px]"
                : "max-w-[22ch] text-[8.5px] leading-[1.26]",
            )}
          >
            {excerpt}
          </p>
        ) : null}

      </div>
    </article>
  );
}

function ResultCard({ result, dark = false }) {
  const { language, t } = useI18n();
  const normalizedResult = normalizeMatch(result, -2, language);

  if (!result) return null;

  return (
    <article
      className={cn(
        "relative h-full min-h-[196px] overflow-hidden rounded-[24px] p-5 transition duration-300 hover:-translate-y-0.5",
        dark ? `text-white ${darkCard}` : `${lightCard} text-[#0b2344]`,
      )}
    >
      <div
        className={cn(
          "text-[10px] font-extrabold uppercase tracking-[0.16em]",
          dark ? "text-white/42" : "text-[#7b91ac]",
        )}
      >
        {t("common.latestResult")}
      </div>

      <div
        className={cn(
          "mt-3 font-[var(--font-display)] text-[clamp(1.9rem,3vw,2.55rem)] leading-[0.9] tracking-[-0.06em]",
          dark ? "text-white" : "text-[#0b2344]",
        )}
      >
        {normalizedResult.score_for ?? "–"}:{normalizedResult.score_against ?? "–"}
      </div>

      <div
        className={cn(
          "mt-1.5 text-[0.92rem] font-semibold",
          dark ? "text-white" : "text-[#17375f]",
        )}
      >
        {normalizedResult.opponent}
      </div>

      <p
        className={cn(
          "mt-2 text-[12px] leading-6",
          dark ? "text-white/72" : "text-[#5f7899]",
        )}
      >
        {truncateText(normalizedResult.summaryText || normalizedResult.competition, 56)}
      </p>

    </article>
  );
}

function PlayerWeekCard({ player }) {
  const { language, t } = useI18n();
  const safePlayer = normalizeTeamPlayer(player, language);

  if (!player) return null;

  return (
    <Link to="/team/" className="group block h-full">
      <article
        className={cn(
          "h-full min-h-[196px] rounded-[24px] p-5 transition duration-300 hover:-translate-y-0.5",
          lightCard,
        )}
      >
        <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7b91ac]">
          {t("common.playerOfWeek")}
        </div>

        <div className="mt-3 font-[var(--font-display)] text-[clamp(1.05rem,1.15vw,1.24rem)] leading-[0.95] tracking-[-0.04em] text-[#0b2344]">
          {safePlayer.full_name}
        </div>

        <div className="mt-2 text-[13px] font-semibold text-[#17375f]">
          {safePlayer.position_label} · #{safePlayer.number}
        </div>

        <p className="mt-2.5 text-[12px] leading-6 text-[#5f7899]">
          {truncateText(
            safePlayer.compact_profile ||
              safePlayer.bio ||
              t("home.playerOfWeekFallback"),
            44,
          )}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-[#0d4ea5]">
          <span>{t("common.openSection")}</span>
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </div>
      </article>
    </Link>
  );
}

function OfferCard({ href, icon: Icon, eyebrow, title, text }) {
  const { t } = useI18n();

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group rounded-[24px] p-5 transition duration-300 hover:-translate-y-0.5",
        darkSoftCard,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] border border-white/14 bg-white/10 text-white">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>

        <div className="min-w-0">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/46">
            {eyebrow}
          </div>
          <div className="mt-1 text-[1.02rem] font-[var(--font-display)] leading-[0.98] tracking-[-0.03em] text-white">
            {title}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[14px] leading-7 text-white/74">
        {truncateText(text, 92)}
      </p>

      <div className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-white">
        <span>{t("common.goTo")}</span>
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
      </div>
    </a>
  );
}

function ArenaMetaCard({ eyebrow, title, text, dark = false, icon: Icon }) {
  return (
    <article
      className={cn(
        "rounded-[24px] p-5",
        dark ? `text-white ${darkCard}` : `${softCard} text-[#0b2344]`,
      )}
    >
      <div className="flex items-start gap-3">
        {Icon ? (
          <span
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-[15px]",
              dark
                ? "border border-white/14 bg-white/10 text-white"
                : "border border-[#dce8f4] bg-white text-[#0d4ea5]",
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.9} />
          </span>
        ) : null}

        <div>
          <div
            className={cn(
              "text-[10px] font-extrabold uppercase tracking-[0.16em]",
              dark ? "text-white/46" : "text-[#7b91ac]",
            )}
          >
            {eyebrow}
          </div>
          <div
            className={cn(
              "mt-1 font-[var(--font-display)] text-[1.32rem] leading-[0.94] tracking-[-0.04em]",
              dark ? "text-white" : "text-[#0b2344]",
            )}
          >
            {title}
          </div>
        </div>
      </div>

      <p
        className={cn(
          "mt-4 text-[14px] leading-7",
          dark ? "text-white/72" : "text-[#5f7899]",
        )}
      >
        {text}
      </p>
    </article>
  );
}

function TrophyCard({ trophies }) {
  const { t } = useI18n();

  if (!trophies?.length) return null;

  return (
    <article className={cn("rounded-[24px] p-5", softCard)}>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-[15px] border border-[#dce8f4] bg-white text-[#0d4ea5]">
          <Trophy className="h-5 w-5" strokeWidth={1.9} />
        </span>

        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7b91ac]">
            {t("home.trophiesEyebrow")}
          </div>
          <div className="mt-1 font-semibold text-[#0b2344]">
            {t("home.trophiesTitle")}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {trophies.slice(0, 4).map((trophy) => (
          <div
            key={`${trophy.title}-${trophy.season}`}
            className="rounded-[18px] border border-[#e1edf8] bg-white/86 px-4 py-3"
          >
            <div className="font-semibold text-[#0b2344]">{trophy.title}</div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6f87a8]">
              {trophy.season}
            </div>
            {trophy.description ? (
              <div className="mt-2 text-[13px] leading-6 text-[#5f7899]">
                {truncateText(trophy.description, 88)}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </article>
  );
}

function GalleryShotCard({ item }) {
  const { language, t } = useI18n();

  return (
    <article
      className={cn(
        "group relative min-h-[180px] overflow-hidden rounded-[22px] border border-white/46 bg-[#dfe8f3] shadow-[0_14px_32px_rgba(8,31,61,.08)] sm:min-h-[156px]",
      )}
    >
      {item?.image_url ? (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#d8e4f2_0%,#cfdeef_100%)]">
          <img
            src={item.image_url}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-contain object-center transition duration-700 group-hover:scale-[1.03] sm:object-cover sm:object-[center_top]"
          />
        </div>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,31,67,.04)_0%,rgba(7,31,67,.10)_44%,rgba(7,31,67,.70)_100%)]" />

      <div className="absolute inset-x-3 bottom-3 z-[2] rounded-[16px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.05))] p-2.5 backdrop-blur-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,.16)]">
        <div className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-white/68">
          {item?.accent || translateGalleryCategory(language, item?.category, item?.category_label) || t("common.gallery")}
        </div>
        <div className="mt-1 text-[10px] font-semibold leading-4 text-white">
          {truncateText(item?.title, 28)}
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { data } = usePageData();
  const { language, t } = useI18n();

  const club = data?.club || {};
  const hero = data?.hero || {};
  const featuredStories = (hero?.featured_news || []).map((story) =>
    localizeStory(story, language),
  );
  const galleryItems = (hero?.gallery_items || []).map((item) =>
    localizeGalleryItem(item, language),
  );
  const localizedTrophies = (hero?.trophies || []).map((item) =>
    localizeTrophy(item, language),
  );
  const versusLabel = t("common.versus");

  const featuredMatch = hero?.featured_match || null;
  const leadStory = featuredStories[0] || null;
  const secondStory = featuredStories[1] || null;
  const latestResult = hero?.latest_result || null;
  const playerFocus = hero?.featured_players?.[0] || null;
  const scheduleRail = (hero?.next_matches || []).slice(0, 3);
  const galleryRail = galleryItems.slice(0, 4);
  const trophies = localizedTrophies.slice(0, 4);
  const normalizedFeaturedMatch = featuredMatch
    ? normalizeMatch(featuredMatch, -10, language)
    : null;
  const normalizedLatestResult = latestResult
    ? normalizeMatch(latestResult, -11, language)
    : null;
  const normalizedPlayerFocus = playerFocus
    ? normalizeTeamPlayer(playerFocus, language)
    : null;
  const normalizedScheduleRail = scheduleRail.map((match, index) =>
    normalizeMatch(match, index, language),
  );
  const normalizedLineupPlayers = (hero?.lineup_players || []).map((player) =>
    normalizeTeamPlayer(player, language),
  );

  const hasMatchdayAside = Boolean(
    (normalizedFeaturedMatch && normalizedLatestResult) || normalizedScheduleRail.length,
  );

  const visualImage =
    leadStory?.cover_url ||
    galleryItems[0]?.image_url ||
    hero?.featured_players?.[0]?.photo_url;

  return (
    <>
      <Reveal y={22} duration={0.5}>
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
          <Surface
            variant="default"
            padding="lg"
            radius="2xl"
            className="bg-[radial-gradient(circle_at_88%_12%,rgba(99,208,255,.18),transparent_22%),linear-gradient(180deg,rgba(255,255,255,.70),rgba(242,248,255,.46))]"
          >
            <div className="flex flex-wrap items-center gap-3">
              {club?.hero_badge ? (
                <div className="inline-flex min-h-9 items-center rounded-full border border-white/70 bg-white/60 px-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0d4ea5]">
                  {club.hero_badge}
                </div>
              ) : null}

              <div className="inline-flex min-h-9 items-center rounded-full border border-white/70 bg-white/60 px-3 text-[12px] font-semibold text-[#6480a4]">
                {t("brand.company")}
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="font-[var(--font-display)] text-[clamp(2.8rem,6vw,4.9rem)] leading-[0.84] tracking-[-0.07em] text-[#0d4ea5]/10">
                2026
              </div>

              <h1 className="m-0 max-w-[9.4ch] font-[var(--font-display)] text-[clamp(2.05rem,4vw,4.15rem)] leading-[0.88] tracking-[-0.055em] text-[#081f3d]">
                {club?.tagline}
              </h1>

              <p className="m-0 max-w-[54ch] text-[15px] leading-7 text-[#5c7599]">
                {club?.mission}
              </p>
            </div>

            {featuredMatch ? (
              <div className="mt-6">
                <Surface
                  variant="dark"
                  padding="md"
                  radius="xl"
                  className="max-w-[720px] bg-[radial-gradient(circle_at_top_left,rgba(99,208,255,.18),transparent_28%),linear-gradient(180deg,rgba(9,59,123,.78),rgba(8,44,93,.82),rgba(7,31,67,.84))]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/10 px-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
                      {t("home.nextMatch")}
                    </div>

                    <CountdownChip kickoffIso={normalizedFeaturedMatch.kickoff_iso} />
                  </div>

                  <div className="mt-4 font-[var(--font-display)] text-[clamp(1.45rem,2.2vw,2rem)] leading-[0.92] tracking-[-0.045em] text-white">
                    {club?.short_name} {versusLabel} {normalizedFeaturedMatch.opponent}
                  </div>

                  <p className="mt-2 text-[14px] leading-6 text-white/72">
                    {normalizedFeaturedMatch.competition} · {normalizedFeaturedMatch.fullDateLabel} ·{" "}
                    {normalizedFeaturedMatch.timeLabel}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      as={Link}
                      to="/matches/"
                      variant="primary"
                      size="sm"
                      rightIcon={ArrowUpRight}
                    >
                      {t("common.matchCenter")}
                    </Button>
                  </div>
                </Surface>
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {statKeys.map((key, index) => (
                <StatCard
                  key={key}
                  label={t(
                    key === "wins"
                      ? "home.stats.wins"
                      : key === "goals"
                        ? "home.stats.goals"
                        : "home.stats.cleanSheets",
                  )}
                  value={club?.stats?.[key] ?? "—"}
                  hint={
                    index === 0
                      ? t("home.stats.winsHint")
                      : index === 1
                        ? t("home.stats.goalsHint")
                        : t("home.stats.cleanSheetsHint")
                  }
                  variant={index === 0 ? "accent" : "default"}
                  className="shadow-[0_12px_24px_rgba(8,31,61,.04)]"
                />
              ))}
            </div>

            {normalizedScheduleRail.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {normalizedScheduleRail.map((match) => (
                  <HeroMiniMatchCard
                    key={`${match.opponent}-${match.kickoff_iso}`}
                    match={match}
                  />
                ))}
              </div>
            ) : null}
          </Surface>

          <div className="grid gap-5">
            <EditorialStoryCard
              story={leadStory}
              fallbackImage={visualImage}
              fallbackTitle={t("home.leadStoryFallback")}
              fallbackText={club?.mission}
              featured
            />

            <div className="grid items-stretch gap-4 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              {normalizedLatestResult ? <ResultCard result={normalizedLatestResult} /> : null}
              {normalizedPlayerFocus ? <PlayerWeekCard player={normalizedPlayerFocus} /> : null}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal y={24} duration={0.55}>
        <Section
          variant="dark"
          className="overflow-hidden !p-5 md:!p-6"
        >
          <SectionHeading
            light
            eyebrow={t("home.matchdayEyebrow")}
            title={t("home.matchdayTitle")}
            description={t("home.matchdayDescription")}
            titleClassName="max-w-[16ch]"
            className="!mb-4 md:!mb-5"
          />

          <div
            className={cn(
              "grid gap-4",
              hasMatchdayAside && "xl:grid-cols-[minmax(0,1fr)_300px]",
            )}
          >
            <div className="grid gap-4">
              {featuredMatch ? (
                <Surface
                  variant="dark"
                  padding="md"
                  radius="xl"
                  className="bg-[radial-gradient(circle_at_100%_100%,rgba(63,146,255,.14),transparent_28%),linear-gradient(180deg,#174075_0%,#123465_52%,#0d2954_100%)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/10 px-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
                      {t("home.nextMatch")}
                    </div>

                    <CountdownChip kickoffIso={normalizedFeaturedMatch.kickoff_iso} />
                  </div>

                  <h3 className="mt-4 font-[var(--font-display)] text-[clamp(1.7rem,2.2vw,2.2rem)] leading-[0.93] tracking-[-0.045em] text-white">
                    {club?.short_name} {versusLabel} {normalizedFeaturedMatch.opponent}
                  </h3>

                  <p className="mt-3 text-[15px] leading-7 text-white/72">
                    {normalizedFeaturedMatch.competition}
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <Surface
                      variant="dark"
                      padding="sm"
                      radius="lg"
                      className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.04))]"
                    >
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/42">
                        {t("common.date")}
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-6 text-white">
                        {normalizedFeaturedMatch.fullDateLabel}
                      </div>
                    </Surface>

                    <Surface
                      variant="dark"
                      padding="sm"
                      radius="lg"
                      className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.04))]"
                    >
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/42">
                        {t("common.time")}
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-6 text-white">
                        {normalizedFeaturedMatch.timeLabel}
                      </div>
                    </Surface>

                    <Surface
                      variant="dark"
                      padding="sm"
                      radius="lg"
                      className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.04))]"
                    >
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/42">
                        {t("common.arena")}
                      </div>
                      <div className="mt-2 text-[15px] font-semibold leading-6 text-white">
                        {normalizedFeaturedMatch.venueLabel || club?.stadium}
                      </div>
                    </Surface>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button as={Link} to="/matches/" variant="primary" size="sm">
                      {t("common.calendar")}
                    </Button>
                  </div>
                </Surface>
              ) : normalizedLatestResult ? (
                <ResultCard result={normalizedLatestResult} dark />
              ) : null}
            </div>

            {hasMatchdayAside ? (
              <div className="grid gap-4">
                {normalizedFeaturedMatch && normalizedLatestResult ? (
                  <ResultCard result={normalizedLatestResult} dark />
                ) : null}

                {normalizedScheduleRail.length ? (
                  <Surface
                    variant="dark"
                    padding="sm"
                    radius="xl"
                    className="bg-[linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.025))]"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/44">
                      {t("home.upcomingMatches")}
                    </div>

                    <div className="mt-3 grid gap-3">
                      {normalizedScheduleRail.map((match) => (
                        <HeroMiniMatchCard
                          key={`matchday-${match.opponent}-${match.kickoff_iso}`}
                          match={match}
                          tone="dark"
                        />
                      ))}
                    </div>
                  </Surface>
                ) : null}
              </div>
            ) : null}
          </div>
        </Section>
      </Reveal>

      <Reveal y={24} duration={0.55}>
        <Section>
          <SectionHeading
            eyebrow={t("home.arenaEyebrow")}
            title={t("home.arenaTitle")}
            description={t("home.arenaDescription")}
            titleClassName="max-w-[14ch]"
          />

          <Surface
            padding="none"
            radius="2xl"
            className="overflow-hidden border border-white/60 bg-[radial-gradient(circle_at_14%_10%,rgba(99,208,255,.20),transparent_26%),linear-gradient(180deg,rgba(255,255,255,.66),rgba(232,242,250,.44))]"
          >
            <div className="relative min-h-[360px] md:min-h-[470px] xl:min-h-[540px]">
              <StadiumScene
                clubName={club?.short_name}
                stadiumName={club?.stadium}
                featuredMatch={normalizedFeaturedMatch}
              />

              {!!normalizedLineupPlayers.length && (
                <div className="pointer-events-none absolute bottom-4 right-4 z-[5] grid w-[min(280px,calc(100%-32px))] gap-2 max-[720px]:static max-[720px]:w-auto max-[720px]:p-4">
                  {normalizedLineupPlayers.slice(0, 3).map((player) => (
                    <div
                      key={player.id}
                      className="pointer-events-auto rounded-[18px] border border-white/18 bg-[linear-gradient(180deg,rgba(7,31,67,.74),rgba(7,31,67,.58))] px-4 py-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_16px_34px_rgba(7,31,67,.16)]"
                    >
                      <div className="font-semibold">{player.full_name}</div>
                      <div className="mt-1 text-[12px] uppercase tracking-[0.12em] text-white/58">
                        #{player.number} · {player.position_label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Surface>

          <div className="mt-4 grid gap-4 xl:grid-cols-[300px_280px_minmax(0,1fr)]">
            <ArenaMetaCard
              dark
              eyebrow={t("home.homeArenaEyebrow")}
              title={club?.stadium || t("brand.defaultStadium")}
              text={t("home.homeArenaFallbackText", {
                city: club?.city || t("brand.defaultCity"),
              })}
            />

            <ArenaMetaCard
              eyebrow={t("home.nextSlotEyebrow")}
              title={
                normalizedFeaturedMatch
                  ? `${normalizedFeaturedMatch.fullDateLabel} · ${normalizedFeaturedMatch.timeLabel}`
                  : t("home.nextSlotFallbackTitle")
              }
              text={
                normalizedFeaturedMatch
                  ? `${club?.short_name} ${versusLabel} ${normalizedFeaturedMatch.opponent}`
                  : t("home.nextSlotFallbackText")
              }
            />

            <TrophyCard trophies={trophies} />
          </div>
        </Section>
      </Reveal>

      <Reveal y={24} duration={0.55}>
        <Section>
          <SectionHeading
            eyebrow={t("home.squadEyebrow")}
            title={t("home.squadTitle")}
            description={t("home.squadDescription")}
            titleClassName="max-w-[15ch]"
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {(hero?.featured_players || []).map((player) => (
              <TeamPlayerCard key={player.id} player={player} to="/team/" />
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal y={24} duration={0.55}>
        <Section className="overflow-hidden">
          <SectionHeading
            eyebrow={t("home.mediaEyebrow")}
            title={t("home.mediaTitle")}
            description={t("home.mediaDescription")}
            titleClassName="max-w-[17ch]"
          />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <EditorialStoryCard
                story={leadStory}
                fallbackImage={visualImage}
                fallbackTitle={t("home.leadStoryFallback")}
                fallbackText={club?.mission}
                featured
              />
            </div>

            <div className="grid gap-4">
              {secondStory ? (
                <EditorialStoryCard
                  story={secondStory}
                  fallbackImage={visualImage}
                  fallbackTitle={t("home.secondStoryFallback")}
                  fallbackText=""
                />
              ) : (
                <article className={cn("rounded-[24px] p-5", softCard)}>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7b91ac]">
                    {t("home.mediaFocusEyebrow")}
                  </div>
                  <div className="mt-3 font-[var(--font-display)] text-[1.45rem] leading-[0.94] tracking-[-0.04em] text-[#0b2344]">
                    {t("home.mediaFocusTitle")}
                  </div>
                  <p className="mt-3 text-[14px] leading-7 text-[#5f7899]">
                    {t("home.mediaFocusDescription")}
                  </p>
                </article>
              )}

              <article className={cn("rounded-[24px] p-5", softCard)}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7b91ac]">
                      {t("home.mediaSectionEyebrow")}
                    </div>
                    <div className="mt-1 font-semibold text-[#0b2344]">
                      {t("home.mediaSectionTitle")}
                    </div>
                  </div>

                  <Button
                    as={Link}
                    to="/media/"
                    variant="secondary"
                    size="sm"
                    leftIcon={Newspaper}
                  >
                    {t("common.allMaterials")}
                  </Button>
                </div>
              </article>
            </div>
          </div>

          {galleryRail.length ? (
            <>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-[16px] border border-[#dce8f4] bg-white text-[#0d4ea5] shadow-[0_8px_18px_rgba(8,31,61,.05)]">
                  <Images className="h-5 w-5" strokeWidth={1.9} />
                </span>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7b91ac]">
                    {t("home.galleryEyebrow")}
                  </div>
                  <div className="mt-1 font-semibold text-[#0b2344]">
                    {t("home.galleryTitle")}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {galleryRail.map((item) => (
                  <GalleryShotCard key={item.id} item={item} />
                ))}
              </div>
            </>
          ) : null}
        </Section>
      </Reveal>

      <Reveal y={24} duration={0.55}>
        <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
          <Surface
            variant="soft"
            padding="lg"
            radius="2xl"
            className={cn(softCard)}
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-[56ch]">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7b91ac]">
                  {t("home.ecosystemEyebrow")}
                </div>

                <h2 className="mt-3 font-[var(--font-display)] text-[clamp(1.9rem,3vw,2.7rem)] leading-[0.93] tracking-[-0.045em] text-[#081f3d]">
                  {t("home.ecosystemTitle")}
                </h2>

                <p className="mt-4 text-[15px] leading-8 text-[#5c7599]">
                  {t("home.ecosystemDescription")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  as={Link}
                  to="/matches/"
                  variant="primary"
                  leftIcon={CalendarDays}
                >
                  {t("home.matchesButton")}
                </Button>

                <Button
                  as={Link}
                  to="/team/"
                  variant="secondary"
                  leftIcon={Newspaper}
                >
                  {t("home.teamButton")}
                </Button>
              </div>
            </div>
          </Surface>

          <Surface
            variant="default"
            padding="md"
            radius="2xl"
            className={cn(lightCard)}
          >
            <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7b91ac]">
              {t("common.quickStatus")}
            </div>

            <div className="mt-4 grid gap-3">
              <StatCard
                label={t("common.homeArena")}
                value={club?.stadium || "—"}
                hint={club?.city || t("common.clubLocation")}
                className="shadow-[0_12px_26px_rgba(8,31,61,.05)]"
                valueClassName="text-[1.35rem] leading-[1.08]"
              />

              <StatCard
                label={t("common.playerOfWeek")}
                value={normalizedPlayerFocus?.full_name || "—"}
                hint={
                  normalizedPlayerFocus
                    ? `${normalizedPlayerFocus.position_label} · #${normalizedPlayerFocus.number}`
                    : t("common.noActiveSelection")
                }
                className="shadow-[0_12px_26px_rgba(8,31,61,.05)]"
                valueClassName="text-[1.35rem] leading-[1.08]"
              />
            </div>
          </Surface>
        </section>
      </Reveal>
    </>
  );
}
