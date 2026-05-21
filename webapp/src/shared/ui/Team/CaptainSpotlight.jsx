import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";
import { normalizeTeamPlayer } from "@/shared/lib/teamPlayers.js";
import PosterRings from "@/shared/ui/Team/PosterRings.jsx";

function CaptainMetric({ label, value }) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,.15),rgba(255,255,255,.06))] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] backdrop-blur-md",
      )}
    >
      <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/46">
        {label}
      </div>

      <div className="mt-2 font-[var(--font-display)] text-[2rem] leading-none tracking-[-0.055em] text-white">
        {value}
      </div>
    </div>
  );
}

export default function CaptainSpotlight({ captain, href }) {
  const { language, t } = useI18n();
  const safeCaptain = normalizeTeamPlayer(captain, language);

  if (!safeCaptain) {
    return (
      <div className="flex h-full min-h-[430px] items-center justify-center rounded-[32px] bg-[linear-gradient(180deg,#1557ad_0%,#0d3f80_34%,#0a2f63_68%,#082349_100%)] p-8 text-center text-white/72">
        {t("team.captainUnset")}
      </div>
    );
  }

  const photo = safeCaptain.photo_url || "";
  const positionLabel = safeCaptain.position_label || t("positions.default");
  const metaLine = [positionLabel, safeCaptain.citizenship]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link to={href} className="group block h-full">
      <div className="relative h-full min-h-[460px] overflow-hidden rounded-[32px] border border-[#0d4ea5]/15 bg-[linear-gradient(180deg,#1557ad_0%,#0d3f80_34%,#0a2f63_68%,#082349_100%)] shadow-[0_24px_60px_rgba(8,31,61,.18)] xl:min-h-[430px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(137,219,255,.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.08),transparent_26%)]" />

        <div className="pointer-events-none absolute left-0 top-[18%] h-[240px] w-[120px] bg-[#8fdcff]/[0.12] blur-3xl" />

        <div className="relative h-[clamp(18.5rem,36vw,25rem)] overflow-hidden min-[571px]:max-xl:h-[26.25rem] xl:h-[clamp(18.5rem,36vw,25rem)]">
          <span className="absolute left-4 top-4 z-[6] inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/12 px-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            {t("team.captain")}
          </span>

          <div className="absolute right-4 top-0 z-[5] font-[var(--font-display)] text-[94px] leading-none tracking-[-0.08em] text-white/10">
            {safeCaptain.number ? String(safeCaptain.number) : ""}
          </div>

          <PosterRings
            size="lg"
            ringClass="border-white/10"
            glowClass="bg-cyan-200/12"
          />

          <div className="absolute inset-x-0 bottom-0 z-[2] h-28 bg-[linear-gradient(180deg,transparent,rgba(7,24,50,.28)_48%,rgba(7,24,50,.56)_100%)]" />

          {photo ? (
            <div className="absolute inset-0 z-[3] overflow-hidden">
              <div className="absolute inset-x-0 top-1 bottom-0 flex items-start justify-center px-4 md:px-5 min-[571px]:max-xl:top-5">
                <img
                  src={photo}
                  alt={safeCaptain.full_name}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="pointer-events-none block h-[118%] w-auto max-w-none select-none drop-shadow-[0_18px_30px_rgba(3,16,38,.22)] transition duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.015] min-[571px]:max-xl:h-[108%] min-[571px]:max-xl:group-hover:-translate-y-0.5"
                />
              </div>
            </div>
          ) : (
            <span className="grid h-full place-items-center font-[var(--font-display)] text-6xl text-white/72">
              {safeCaptain.initials}
            </span>
          )}
        </div>

        <div className="relative z-[4] -mt-6 px-4 md:px-5">
          <div className="grid grid-cols-3 gap-2.5">
            <CaptainMetric label={t("common.matches")} value={safeCaptain.matches_for_club} />
            <CaptainMetric label={t("common.minutes")} value={safeCaptain.minutes_for_club} />
            <CaptainMetric label={t("common.goals")} value={safeCaptain.goals_for_club} />
          </div>
        </div>

        <div className="relative z-[3] px-4 pb-4 pt-3 md:px-5 md:pb-5">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.05))] p-5 shadow-[0_18px_44px_rgba(3,16,38,.22)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <h2 className="max-w-[8ch] font-[var(--font-display)] text-[clamp(2rem,3vw,3.15rem)] leading-[0.9] tracking-[-0.055em] text-white">
                {safeCaptain.full_name}
              </h2>

              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/14 bg-white/[0.08] text-white/88 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/[0.14]">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
              </span>
            </div>

            <p className="mt-2.5 text-[14px] font-medium leading-6 text-white/72">
              {metaLine || t("team.firstTeamPlayer")}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
