import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";
import { getPlayerTone } from "@/shared/lib/teamPlayers.js";
import PosterRings from "@/shared/ui/Team/PosterRings.jsx";

export default function PlayerPoster({
  player,
  variant = "card",
  tone,
  photoBroken = false,
  onPhotoError,
  showCaptain = false,
  className,
}) {
  const { t } = useI18n();
  const resolvedTone = tone || getPlayerTone(player);
  const photo = player?.photo_url || "";
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,.55)]",
        isHero
          ? "h-[286px] sm:h-[320px] md:h-[340px]"
          : "h-[clamp(18rem,34vw,21rem)]",
        resolvedTone.poster,
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.72),transparent_44%)]" />

      <div
        className={cn(
          "absolute right-4 top-0 z-[5] font-[var(--font-display)] leading-none tracking-[-0.08em]",
          isHero ? "text-[92px] sm:text-[104px]" : "text-[92px]",
          resolvedTone.numberClass,
        )}
      >
        {player?.number || ""}
      </div>

      <PosterRings
        size="sm"
        ringClass={resolvedTone.ringClass}
        glowClass={resolvedTone.glowClass}
      />

      {showCaptain && player?.captain ? (
        <span
          className={cn(
            "absolute left-3 top-3 z-[6] inline-flex min-h-8 items-center rounded-full border px-2.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-[0_10px_24px_rgba(8,31,61,.06)] backdrop-blur-md",
            resolvedTone.captainChip,
          )}
        >
          {t("team.captain")}
        </span>
      ) : null}

      <div className="absolute inset-x-3 bottom-0 z-[3] h-1.5 overflow-hidden rounded-full">
        <div className={cn("h-full w-full bg-gradient-to-r", resolvedTone.line)} />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[1] h-20 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.14))]" />

      {!photoBroken && photo ? (
        isHero ? (
          <div className="absolute inset-x-0 bottom-0 top-0 z-[2] flex items-end justify-center px-4 pt-4">
            <img
              src={photo}
              alt={player?.full_name}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={onPhotoError}
              className="max-h-[99%] w-auto max-w-[92%] object-contain object-bottom drop-shadow-[0_18px_30px_rgba(3,16,38,.16)]"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-[2] overflow-hidden">
            <div className="absolute inset-x-0 top-1 bottom-0 flex items-start justify-center px-3 sm:px-4">
              <img
                src={photo}
                alt={player?.full_name}
                loading="lazy"
                decoding="async"
                onError={onPhotoError}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="pointer-events-none block h-[114%] w-auto max-w-none select-none drop-shadow-[0_16px_28px_rgba(8,31,61,.14)] transition duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        )
      ) : (
        <span className="grid h-full place-items-center font-[var(--font-display)] text-5xl text-[#0d4ea5]">
          {player?.initials}
        </span>
      )}
    </div>
  );
}
