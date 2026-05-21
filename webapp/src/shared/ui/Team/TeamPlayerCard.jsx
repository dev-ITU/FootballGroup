import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/shared/lib/cn.js";
import { formatHeightValue, formatWeightValue, useI18n } from "@/shared/i18n/index.jsx";
import { normalizeTeamPlayer } from "@/shared/lib/teamPlayers.js";
import Surface from "@/shared/ui/Surface/Surface.jsx";
import PlayerPoster from "@/shared/ui/Team/PlayerPoster.jsx";

function MetaLine(player, t, language) {
  const parts = [
    player.citizenship || null,
    player.height_cm ? formatHeightValue(language, player.height_cm) : null,
    player.weight_kg ? formatWeightValue(language, player.weight_kg) : null,
  ].filter(Boolean);

  return parts.join(" · ") || t("team.firstTeamPlayer");
}

function InfoCell({ label, value }) {
  return (
    <div className="rounded-[16px] border border-[#edf4fb] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f9fe_100%)] px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.12em] text-[#7a91ae]">
        {label}
      </div>

      <div className="mt-1 truncate font-semibold text-[#0b2344]">
        {value}
      </div>
    </div>
  );
}

export default function TeamPlayerCard({ player, to, className }) {
  const { language, t } = useI18n();
  const safePlayer = normalizeTeamPlayer(player, language);

  if (!safePlayer) return null;

  const Comp = to ? Link : "article";
  const compProps = to
    ? {
        to,
        state: {
          playerPreview: {
            full_name: safePlayer.full_name,
            number: safePlayer.number,
            position_label: safePlayer.position_label,
            photo_url: safePlayer.photo_url,
            initials: safePlayer.initials,
            citizenship: safePlayer.citizenship,
          },
        },
      }
    : {};

  return (
    <Comp {...compProps} className={cn("group block h-full")}>
      <Surface
        padding="none"
        radius="xl"
        className={cn(
          "h-full border-[#dce8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(248,251,255,.98))] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(8,31,61,.10)]",
          className,
        )}
      >
        <div className="p-3.5">
          <PlayerPoster
            player={safePlayer}
            variant="card"
            showCaptain
          />

          <div className="px-1 pb-1 pt-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-[var(--font-display)] text-[clamp(1.7rem,2.1vw,2.2rem)] leading-[0.94] tracking-[-0.045em] text-[#0b2344]">
                  {safePlayer.full_name}
                </h3>

                <p className="mt-2.5 text-[13px] leading-6 text-[#5f7899]">
                  {MetaLine(safePlayer, t, language)}
                </p>
              </div>

              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dbe8f7] bg-white text-[#0d4ea5] shadow-[0_8px_22px_rgba(8,31,61,.05)] transition duration-300 group-hover:border-[#bfd9fb] group-hover:bg-[#f4f9ff]">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <InfoCell label={t("common.matches")} value={safePlayer.matches_for_club} />
              <InfoCell label={t("common.minutes")} value={safePlayer.minutes_for_club} />
              <InfoCell label={t("common.birthDate")} value={safePlayer.birth_date_label} />
              <InfoCell label={t("common.club")} value={safePlayer.previous_club} />
            </div>
          </div>
        </div>
      </Surface>
    </Comp>
  );
}
