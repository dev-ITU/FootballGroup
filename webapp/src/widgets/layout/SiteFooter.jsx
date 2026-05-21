import {
  ArrowUpRight,
  Building2,
  Mail,
  MapPin,
  Phone,
  Ticket,
  ShoppingBag,
  Newspaper,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";
import GazpromMark from "@/shared/ui/BrandMark/GazpromMark.jsx";

const labelClass = cn(
  "mb-3 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45",
);

const cardLinkClass = cn(
  "group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.035] px-3.5 py-3 text-white/78 transition-all duration-300 hover:-translate-y-[2px] hover:border-sky-400/30 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.09),rgba(76,184,255,0.12))] hover:text-white hover:shadow-[0_16px_34px_rgba(30,107,187,0.18)]",
);

const simpleLinkClass = cn(
  "group inline-flex items-center gap-3 text-white/72 transition-all duration-300 hover:text-white",
);

const arenaMapUrl =
  "https://yandex.ru/maps/org/gazprom_arena/131568837112/?ll=30.234741%2C59.967635&z=15";

function TelegramIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(className)}
      fill="none"
    >
      <path
        d="M21.5 4.6 18.4 19c-.23 1.02-.84 1.28-1.7.8l-4.7-3.47-2.27 2.2c-.25.25-.46.46-.95.46l.34-4.83 8.8-7.95c.38-.34-.08-.53-.6-.18L6.36 13.03 1.74 11.6c-1-.32-1.02-1 .22-1.48L20 3.15c.84-.31 1.57.18 1.3 1.45Z"
        fill="currentColor"
      />
    </svg>
  );
}

function VkIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(className)}
      fill="none"
    >
      <path
        d="M4.8 7.5c.14 6.73 3.51 10.78 9.42 10.78h.35v-3.86c2.17.21 3.8 1.79 4.46 3.86H22c-.84-3.03-3.05-4.7-4.43-5.34 1.38-.8 3.3-2.75 3.76-5.44h-2.7c-.6 2.18-2.36 4.13-4.06 4.32V7.5h-2.7v7.58c-1.72-.43-3.9-2.53-4-7.58H4.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InfoLink({ href, icon: Icon, children }) {
  return (
    <a href={href} className={cn(cardLinkClass)}>
      <span
        className={cn(
          "absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(105,208,255,0.14),transparent_48%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-sky-300 transition-all duration-300 group-hover:scale-105 group-hover:border-sky-300/30 group-hover:bg-sky-400/10 group-hover:text-sky-200",
        )}
      >
        <Icon className={cn("h-[18px] w-[18px]")} strokeWidth={1.9} />
      </span>
      <span className={cn("relative min-w-0 flex-1 truncate")}>{children}</span>
      <ArrowUpRight
        className={cn(
          "relative h-4 w-4 shrink-0 translate-y-[1px] opacity-55 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100",
        )}
      />
    </a>
  );
}

function SocialLink({ href, icon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(cardLinkClass)}
    >
      <span
        className={cn(
          "absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(128,218,255,0.09),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-sky-300 transition-all duration-300 group-hover:scale-105 group-hover:border-sky-300/30 group-hover:bg-sky-400/10 group-hover:text-white",
        )}
      >
        {icon}
      </span>
      <span className={cn("relative flex-1 font-medium")}>{children}</span>
      <ArrowUpRight
        className={cn(
          "relative h-4 w-4 shrink-0 opacity-55 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100",
        )}
      />
    </a>
  );
}

function FooterNavLink({ to, href, icon: Icon, children, external = false }) {
  const content = (
    <>
      <span
        className={cn(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.05] text-sky-300 transition-all duration-300 group-hover:border-sky-300/25 group-hover:bg-sky-400/10 group-hover:text-white",
        )}
      >
        <Icon className={cn("h-[17px] w-[17px]")} strokeWidth={1.9} />
      </span>
      <span className={cn("flex-1")}>{children}</span>
      <ArrowUpRight
        className={cn(
          "h-4 w-4 shrink-0 opacity-45 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100",
        )}
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(simpleLinkClass)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={cn(simpleLinkClass)}>
      {content}
    </Link>
  );
}

export default function SiteFooter({ club }) {
  const { t } = useI18n();

  return (
    <footer
      className={cn(
        "relative z-[1] mx-auto mb-9 w-[calc(100vw-48px)] max-w-[1360px] overflow-hidden rounded-[40px] border border-white/8 bg-[linear-gradient(180deg,rgba(7,31,67,.985),rgba(10,47,99,.965))] px-6 py-7 text-white shadow-[0_30px_80px_rgba(8,31,61,0.18)] max-[980px]:w-[calc(100vw-24px)] md:px-[34px] md:py-[34px] max-[720px]:rounded-[26px]",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(84,192,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(91,167,255,0.16),transparent_22%)]",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-40 -right-20 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(99,208,255,0.16),transparent_70%)]",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -left-24 top-1/2 h-[240px] w-[240px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.10),transparent_70%)]",
        )}
      />

      <div
        className={cn(
          "relative z-[1] grid items-start gap-8 xl:grid-cols-[1.2fr_0.92fr_1fr]",
        )}
      >
        <div>
          <div
            className={cn(
              "mb-5 inline-flex rounded-[26px] border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur-sm",
            )}
          >
            <GazpromMark className={cn("w-44 text-white")} />
          </div>

          <p
            className={cn(
              "mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/56",
            )}
          >
            {t("brand.company")}
          </p>

          <h2
            className={cn(
              "mb-4 font-[var(--font-display)] text-[32px] leading-none max-[720px]:text-[26px]",
            )}
          >
            {club.name}
          </h2>

          <p
            className={cn("max-w-[36rem] text-[15px] leading-7 text-white/72")}
          >
            {club.mission}
          </p>
        </div>

        <div className={cn("flex flex-col gap-3")}>
          <span className={cn(labelClass)}>{t("footer.arena")}</span>
          <a
            href={arenaMapUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "group block rounded-[24px] border border-white/8 bg-white/[0.04] p-3 transition-all duration-300 hover:border-sky-400/20 hover:bg-white/[0.055]",
            )}
          >
            <div className={cn("flex flex-col gap-3")}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.06] text-sky-300 transition-all duration-300 group-hover:border-sky-300/25 group-hover:bg-sky-400/10",
                  )}
                >
                  <Building2 className={cn("h-[18px] w-[18px]")} strokeWidth={1.9} />
                </span>

                <div className={cn("min-w-0")}>
                  <div
                    className={cn(
                      "text-[12px] font-semibold uppercase tracking-[0.12em] text-white/42",
                    )}
                  >
                    {t("common.stadium")}
                  </div>
                  <div className={cn("truncate text-[17px] font-semibold text-white")}>
                    {club.stadium}
                  </div>
                </div>

                <ArrowUpRight
                  className={cn(
                    "ml-auto h-4 w-4 shrink-0 text-white/45 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white",
                  )}
                />
              </div>

              <div
                className={cn(
                  "flex items-start gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.06] text-sky-300 transition-all duration-300 group-hover:border-sky-300/25 group-hover:bg-sky-400/10",
                  )}
                >
                  <MapPin className={cn("h-[18px] w-[18px]")} strokeWidth={1.9} />
                </span>

                <div className={cn("min-w-0")}>
                  <div
                    className={cn(
                      "text-[12px] font-semibold uppercase tracking-[0.12em] text-white/42",
                    )}
                  >
                    {t("footer.location")}
                  </div>
                  <div className={cn("text-[16px] font-medium text-white/86")}>
                    {club.city}
                  </div>
                  {club.address ? (
                    <div
                      className={cn("mt-1 text-[14px] leading-6 text-white/60")}
                    >
                      {club.address}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </a>
        </div>

        <div className={cn("flex flex-col gap-3")}>
          <span className={cn(labelClass)}>{t("footer.communications")}</span>

          {club.email ? (
            <InfoLink href={`mailto:${club.email}`} icon={Mail}>
              {club.email}
            </InfoLink>
          ) : null}

          {club.phone ? (
            <InfoLink href={`tel:${club.phone}`} icon={Phone}>
              {club.phone}
            </InfoLink>
          ) : null}

          <div className={cn("mt-1 grid gap-3 sm:grid-cols-2 xl:grid-cols-1")}>
            {club.links.telegram_url ? (
              <SocialLink
                href={club.links.telegram_url}
                icon={<TelegramIcon className="h-[18px] w-[18px]" />}
              >
                Telegram
              </SocialLink>
            ) : null}

            {club.links.vk_url ? (
              <SocialLink
                href={club.links.vk_url}
                icon={<VkIcon className="h-[18px] w-[18px]" />}
              >
                VK
              </SocialLink>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative z-[1] mt-8 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]",
        )}
      />

      <div
        className={cn(
          "relative z-[1] mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/46",
        )}
      >
        <span>
          © {new Date().getFullYear()} {club.name}
        </span>
      </div>
    </footer>
  );
}
