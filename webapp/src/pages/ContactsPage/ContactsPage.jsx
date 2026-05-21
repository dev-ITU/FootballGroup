import {
  ArrowUpRight,
  Building2,
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Send,
} from "lucide-react";

import usePageData from "@/features/page-data/usePageData.js";
import { cn } from "@/shared/lib/cn.js";
import { translateChannelLabel, useI18n } from "@/shared/i18n/index.jsx";
import Reveal from "@/shared/ui/Reveal/Reveal.jsx";
import Chip from "@/shared/ui/Chip/Chip.jsx";
import SectionHeading from "@/shared/ui/Section/SectionHeading.jsx";
import Surface from "@/shared/ui/Surface/Surface.jsx";

function resolveMapUrl(club) {
  const query = [club?.address, club?.stadium, club?.city]
    .filter(Boolean)
    .join(", ");

  if (!query) return "";

  return `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;
}

function uniqueChannels(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = String(item?.url || "").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resolveChannelMeta(label) {
  const raw = String(label || "").toLowerCase();

  if (raw.includes("telegram") || raw.includes("tg")) {
    return {
      icon: Send,
      iconClassName: "text-sky-300",
      glowClassName:
        "bg-[radial-gradient(circle_at_left,rgba(71,184,255,0.18),transparent_62%)]",
    };
  }

  if (raw.includes("vk") || raw.includes("вк") || raw.includes("вконтакте")) {
    return {
      icon: MessageCircle,
      iconClassName: "text-blue-300",
      glowClassName:
        "bg-[radial-gradient(circle_at_left,rgba(108,148,255,0.18),transparent_62%)]",
    };
  }

  if (raw.includes("youtube") || raw.includes("ютуб")) {
    return {
      icon: Play,
      iconClassName: "text-rose-300",
      glowClassName:
        "bg-[radial-gradient(circle_at_left,rgba(255,108,128,0.16),transparent_62%)]",
    };
  }

  if (raw.includes("instagram") || raw.includes("inst")) {
    return {
      icon: Camera,
      iconClassName: "text-fuchsia-300",
      glowClassName:
        "bg-[radial-gradient(circle_at_left,rgba(232,121,249,0.18),transparent_62%)]",
    };
  }

  return {
    icon: Globe2,
    iconClassName: "text-cyan-300",
    glowClassName:
      "bg-[radial-gradient(circle_at_left,rgba(110,231,255,0.16),transparent_62%)]",
  };
}

function InfoRow({ icon: Icon, label, value, href }) {
  const { t } = useI18n();
  const isExternal =
    typeof href === "string" &&
    (href.startsWith("http://") || href.startsWith("https://"));

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[20px] border border-[#dbe8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(247,251,255,.98))] px-3.5 py-3.5",
      )}
    >
      <span
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#e1edf8] bg-[#f5faff] text-[#0d4ea5]",
        )}
      >
        <Icon className={cn("h-[17px] w-[17px]")} strokeWidth={1.9} />
      </span>

      <div className={cn("min-w-0 flex-1")}>
        <div
          className={cn(
            "text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7b91ac]",
          )}
        >
          {label}
        </div>

        <div className={cn("mt-1 text-[15px] leading-6 text-[#0b2344]")}>
          {href ? (
            <a
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              className={cn(
                "group inline-flex max-w-full items-center gap-2 break-all font-semibold text-[#0b2344] transition-colors duration-300 hover:text-[#0d4ea5]",
              )}
            >
              <span>{value || t("common.na")}</span>
              <ArrowUpRight
                className={cn(
                  "h-4 w-4 shrink-0 opacity-55 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100",
                )}
              />
            </a>
          ) : (
            <span className={cn("font-semibold")}>{value || t("common.na")}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactAction({ href, icon: Icon, title, value, external = false }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "group relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.05] px-3.5 py-3.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/25 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(70,182,255,0.12))]",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(109,207,255,0.14),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        )}
      />

      <div className={cn("relative z-[1] flex items-center gap-3")}>
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.07] text-sky-300 transition-all duration-300 group-hover:border-sky-300/30 group-hover:bg-sky-400/10 group-hover:text-white",
          )}
        >
          <Icon className={cn("h-[17px] w-[17px]")} strokeWidth={1.9} />
        </span>

        <div className={cn("min-w-0 flex-1")}>
          <div
            className={cn(
              "text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/45",
            )}
          >
            {title}
          </div>

          <div className={cn("mt-1 text-[15px] font-semibold text-white/82")}>
            {value}
          </div>
        </div>

        <ArrowUpRight
          className={cn(
            "h-4 w-4 shrink-0 text-white/45 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white",
          )}
        />
      </div>
    </a>
  );
}

function ChannelCard({ channel }) {
  const { language } = useI18n();
  const meta = resolveChannelMeta(channel?.label);
  const Icon = meta.icon;
  const label = translateChannelLabel(language, channel?.label);

  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group relative overflow-hidden rounded-[20px] border border-[#dbe8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(247,251,255,.98))] px-4 py-3.5 shadow-[0_12px_28px_rgba(8,31,61,.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/40",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          meta.glowClassName,
        )}
      />

      <div className={cn("relative z-[1] flex items-center gap-3")}>
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#e2edf8] bg-[#f6fbff]",
            meta.iconClassName,
          )}
        >
          <Icon className={cn("h-[17px] w-[17px]")} strokeWidth={1.9} />
        </span>

        <div className={cn("min-w-0 flex-1")}>
          <div className={cn("text-[15px] font-semibold text-[#0b2344]")}>
            {label}
          </div>
        </div>

        <ArrowUpRight
          className={cn(
            "h-4 w-4 shrink-0 text-[#7c93af] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0d4ea5]",
          )}
        />
      </div>
    </a>
  );
}

export default function ContactsPage() {
  const { data } = usePageData();
  const { t } = useI18n();

  const club = data?.club || {};
  const clubLinks = club?.links || {};
  const mapUrl = resolveMapUrl(club);

  const channels = uniqueChannels(
    Array.isArray(data?.channels) ? data.channels.filter((item) => item?.url) : [],
  );

  return (
    <>
      <Reveal y={14} duration={0.4}>
        <section className={cn("mt-3")}>
          <div className={cn("grid gap-4 xl:grid-cols-[1.02fr_.98fr]")}>
            <Surface
              variant="dark"
              padding="md"
              radius="2xl"
              className={cn(
                "overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(7,31,67,.985),rgba(10,47,99,.965))] shadow-[0_28px_72px_rgba(8,31,61,.16)]",
              )}
            >
              <div className={cn("relative z-[1]")}>
                <Chip
                  variant="bright"
                  className={cn(
                    "border border-white/10 bg-white/[0.08] px-4 text-white",
                  )}
                >
                  {t("contacts.heroBadge")}
                </Chip>

                <h1
                  className={cn(
                    "mt-4 max-w-[8.5ch] font-[var(--font-display)] text-[clamp(2.15rem,4.2vw,3.95rem)] leading-[0.9] tracking-[-0.065em] text-white",
                  )}
                >
                  {t("contacts.heroTitle")}
                </h1>

                <div className={cn("mt-6 grid gap-3 sm:grid-cols-2")}>
                  {club.email ? (
                    <ContactAction
                      href={`mailto:${club.email}`}
                      icon={Mail}
                      title={t("common.email")}
                      value={club.email}
                    />
                  ) : null}

                  {club.phone ? (
                    <ContactAction
                      href={`tel:${club.phone}`}
                      icon={Phone}
                      title={t("common.phone")}
                      value={club.phone}
                    />
                  ) : null}
                </div>

                <div className={cn("mt-5 flex flex-wrap gap-3")}>
                  {mapUrl ? (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "group inline-flex items-center gap-2 text-[14px] font-semibold text-white/76 transition-colors duration-300 hover:text-white",
                      )}
                    >
                      <MapPin className={cn("h-4 w-4")} strokeWidth={1.9} />
                      <span>{t("common.openOnMap")}</span>
                      <ArrowUpRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                        )}
                      />
                    </a>
                  ) : null}
                </div>
              </div>
            </Surface>

            <Surface
              padding="md"
              radius="2xl"
              className={cn(
                "overflow-hidden border-[#dce8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(245,250,255,.98))] shadow-[0_20px_48px_rgba(8,31,61,.07)]",
              )}
            >
              <div className={cn("relative z-[1]")}>
                <div
                  className={cn(
                    "text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0d4ea5]",
                  )}
                >
                  {t("contacts.hqEyebrow")}
                </div>

                <h2
                  className={cn(
                    "mt-3 font-[var(--font-display)] text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[0.94] tracking-[-0.045em] text-[#0b2344]",
                  )}
                >
                  {club.name || t("contacts.defaultClubName")}
                </h2>

                <div className={cn("mt-5 grid gap-3")}>
                  <InfoRow
                    icon={Building2}
                    label={t("common.arena")}
                    value={club.stadium || t("common.na")}
                  />

                  <InfoRow
                    icon={MapPin}
                    label={t("common.address")}
                    value={club.address || club.city || t("common.na")}
                    href={mapUrl || undefined}
                  />

                  <InfoRow
                    icon={Mail}
                    label={t("common.email")}
                    value={club.email || t("common.na")}
                    href={club.email ? `mailto:${club.email}` : undefined}
                  />

                  <InfoRow
                    icon={Phone}
                    label={t("common.phone")}
                    value={club.phone || t("common.na")}
                    href={club.phone ? `tel:${club.phone}` : undefined}
                  />
                </div>
              </div>
            </Surface>
          </div>
        </section>
      </Reveal>

      <Reveal y={16} duration={0.44}>
        <section className={cn("mt-6")}>
          <Surface
            variant="transparent"
            padding="md"
            radius="xl"
            className={cn(
              "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(180deg,rgba(255,255,255,.22),transparent_28%)]",
            )}
          >
            <SectionHeading
              eyebrow={t("contacts.channelsEyebrow")}
              title={t("contacts.channelsTitle")}
              className={cn("mb-5")}
              titleClassName={cn("max-w-[13ch] text-[clamp(1.55rem,2.2vw,2.2rem)]")}
            />

            {channels.length ? (
              <div className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-3")}>
                {channels.map((channel) => (
                  <ChannelCard
                    key={`${channel.label}-${channel.url}`}
                    channel={channel}
                  />
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  "rounded-[22px] border border-dashed border-[#d8e5f2] bg-[#f8fbff] px-4 py-5 text-[14px] leading-6 text-[#6983a5]",
                )}
              >
                {t("contacts.channelsEmpty")}
              </div>
            )}
          </Surface>
        </section>
      </Reveal>
    </>
  );
}
