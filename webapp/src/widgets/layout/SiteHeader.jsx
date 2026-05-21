import {
  CalendarDays,
  ChevronRight,
  House,
  Menu,
  Newspaper,
  Phone,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { PAGE_ROUTES } from "@/app/router/pageRoutes.js";
import { prefetchPagePayload } from "@/features/page-data/payloadCache.js";
import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";
import GazpromMark from "@/shared/ui/BrandMark/GazpromMark.jsx";
import FlagEnIcon from "@/shared/ui/FlagEnIcon/FlagEnIcon.jsx";
import FlagRuIcon from "@/shared/ui/FlagRuIcon/FlagRuIcon.jsx";

const NAV_ICONS = {
  home: House,
  team: Users,
  matches: CalendarDays,
  media: Newspaper,
  contacts: Phone,
};

const DESKTOP_HEADER_FROM = 1360;
const INLINE_LANGUAGE_FROM = 860;

function DesktopNavItem({ item }) {
  const Icon = NAV_ICONS[item.page];
  const { t } = useI18n();
  const handleIntent = () => {
    prefetchPagePayload(item);
  };

  return (
    <NavLink
      to={item.path}
      onMouseEnter={handleIntent}
      onFocus={handleIntent}
      className={({ isActive }) =>
        cn(
          "group inline-flex h-10 items-center gap-2 rounded-[15px] px-3 text-[13px] font-semibold transition-all duration-200 min-[1480px]:px-4 min-[1480px]:text-[14px]",
          isActive
            ? "bg-white text-[#0f4ea8] shadow-[0_7px_18px_rgba(18,76,154,.08)] ring-1 ring-[#dbe8f7]"
            : "text-[#203555] hover:bg-white/85 hover:text-[#102544]",
        )
      }
    >
      {({ isActive }) => (
        <>
          {Icon ? (
            <Icon
              className={cn(
                "h-[15px] w-[15px] shrink-0 transition duration-200 min-[1480px]:h-4 min-[1480px]:w-4",
                isActive ? "text-[#0f4ea8]" : "text-[#6a7d98]",
              )}
              strokeWidth={1.9}
            />
          ) : null}
          <span className="whitespace-nowrap">{t(`nav.${item.page}`)}</span>
        </>
      )}
    </NavLink>
  );
}

function MobileNavItem({ item, onClick }) {
  const Icon = NAV_ICONS[item.page];
  const { t } = useI18n();
  const handleIntent = () => {
    prefetchPagePayload(item);
  };

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      onMouseEnter={handleIntent}
      onFocus={handleIntent}
      onTouchStart={handleIntent}
      className={({ isActive }) =>
        cn(
          "group flex items-center justify-between rounded-[18px] border px-4 py-3 transition-all duration-200",
          isActive
            ? "border-[#b9d7fb] bg-[#eef6ff] text-[#0f4ea8]"
            : "border-[#d9e5f2] bg-white/90 text-[#1b3152] hover:border-[#c7d9ef] hover:bg-white",
        )
      }
    >
      <span className="flex items-center gap-3">
        {Icon ? <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} /> : null}
        <span className="text-[15px] font-semibold">{t(`nav.${item.page}`)}</span>
      </span>

      <ChevronRight className="h-4 w-4 shrink-0 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5" />
    </NavLink>
  );
}

function BrandBlock({ club, compact = false }) {
  const { t } = useI18n();
  const brandTitle = club?.short_name || club?.name || t("brand.defaultClubName");

  const brandLine = [
    club?.hero_badge || club?.tagline || t("brand.defaultBadge"),
    club?.stadium,
    club?.city,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <Link
      to="/"
      aria-label={t("common.toHome")}
      className={cn(
        "group flex min-w-0 items-center text-left",
        compact ? "gap-2 sm:gap-3" : "gap-3",
      )}
    >
      <span className="relative flex shrink-0 items-center justify-center">
        <span
          className={cn(
            "absolute rounded-full bg-[radial-gradient(circle,rgba(73,153,255,.10)_0%,rgba(73,153,255,0)_72%)] blur-2xl",
            compact ? "h-10 w-10 sm:h-11 sm:w-11" : "h-12 w-12",
          )}
        />
        <GazpromMark
          className={cn(
            "relative w-auto text-[#0f5ec6] transition-transform duration-300 group-hover:scale-[1.02]",
            compact ? "h-7 sm:h-8" : "h-8 min-[1480px]:h-9",
          )}
        />
      </span>

      <span className="min-w-0 flex-1 overflow-hidden">
        <span
          className={cn(
            "block truncate font-bold leading-tight text-[#102544]",
            compact
              ? "text-[15px] sm:text-[16px]"
              : "text-[17px] min-[1480px]:text-[18px]",
          )}
        >
          {brandTitle}
        </span>

        <span
          className={cn(
            "font-medium text-[#6d7f99]",
            compact
              ? "mt-0.5 hidden truncate text-[11px] min-[860px]:block"
              : "mt-0.5 block truncate text-[11px] min-[1480px]:text-[12px]",
          )}
        >
          {brandLine}
        </span>
      </span>
    </Link>
  );
}

function LanguageToggle({ className }) {
  const { language, setLanguage, t } = useI18n();
  const isEnglish = language === "en";

  const options = [
    {
      key: "ru",
      label: t("language.ruShort"),
      ariaLabel: t("language.toggleToRu"),
      Icon: FlagRuIcon,
      active: !isEnglish,
    },
    {
      key: "en",
      label: t("language.enShort"),
      ariaLabel: t("language.toggleToEn"),
      Icon: FlagEnIcon,
      active: isEnglish,
    },
  ];

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center rounded-[16px] border border-[#d8e4f1] bg-white/92 p-1 shadow-[0_8px_20px_rgba(18,76,154,.06)] backdrop-blur-md max-[980px]:rounded-[14px] max-[980px]:p-[3px]",
        className,
      )}
      role="group"
      aria-label="Language switcher"
    >
      {options.map(({ key, label, ariaLabel, Icon, active }) => (
        <button
          key={key}
          type="button"
          onClick={() => setLanguage(key)}
          aria-label={ariaLabel}
          aria-pressed={active}
          className={cn(
            "group inline-flex cursor-pointer items-center gap-2 rounded-[12px] px-3 py-2 text-[13px] font-semibold leading-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fc4ff] max-[980px]:gap-1.5 max-[980px]:px-2.5 max-[980px]:py-1.5 max-[980px]:text-[12px]",
            active
              ? "bg-[#eef5ff] text-[#0f4ea8] shadow-[0_4px_10px_rgba(15,78,168,.10)]"
              : "text-[#71839a] hover:bg-[#f7fbff] hover:text-[#17375f]",
          )}
        >
          <span className="flex h-[14px] w-[20px] shrink-0 overflow-hidden rounded-[4px] ring-1 ring-black/5 max-[980px]:h-[13px] max-[980px]:w-[18px]">
            <Icon className="block h-full w-full" />
          </span>

          <span className="min-w-[22px] max-[980px]:min-w-[20px]">{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function SiteHeader({ club }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_HEADER_FROM) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-0 pt-0">
      <div className="w-full">
        <div className="w-full overflow-hidden border-b border-white/70 bg-[linear-gradient(180deg,rgba(241,247,253,.96)_0%,rgba(231,240,248,.96)_100%)] shadow-[0_12px_30px_rgba(8,37,78,.08)] backdrop-blur-xl">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[-34px] top-[-34px] h-24 w-24 rounded-full bg-sky-300/16 blur-3xl" />
              <div className="absolute right-[-16px] top-0 h-20 w-20 rounded-full bg-blue-300/10 blur-3xl" />
            </div>

            <div className="relative">
              <div className="mx-auto w-full max-w-[1480px] px-4 py-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                <div className="hidden min-[1360px]:block">
                  <div className="flex items-center justify-between gap-5 min-[1480px]:gap-6">
                    <div className="min-w-0 shrink-0">
                      <BrandBlock club={club} />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                      <nav className="min-w-0 flex-1 overflow-hidden">
                        <div className="inline-flex max-w-full items-center gap-1 rounded-[20px] bg-white/42 p-1.5 ring-1 ring-white/70">
                          {PAGE_ROUTES.map((item) => (
                            <DesktopNavItem key={item.page} item={item} />
                          ))}
                        </div>
                      </nav>

                      <LanguageToggle />
                    </div>
                  </div>
                </div>

                <div className="min-[1360px]:hidden">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <BrandBlock club={club} compact />
                    </div>

                    <LanguageToggle className="hidden min-[860px]:inline-flex" />

                    <button
                      type="button"
                      aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
                      aria-expanded={menuOpen}
                      onClick={() => setMenuOpen((prev) => !prev)}
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-200",
                        menuOpen
                          ? "border-[#b9d7fb] bg-[#eaf4ff] text-[#0f4ea8] shadow-[0_8px_16px_rgba(14,76,164,.08)]"
                          : "border-[#d9e5f2] bg-white/90 text-[#1a3152] hover:bg-white",
                      )}
                    >
                      {menuOpen ? (
                        <X className="h-4.5 w-4.5" strokeWidth={2} />
                      ) : (
                        <Menu className="h-4.5 w-4.5" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-out min-[1360px]:hidden",
            menuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="border-b border-white/70 bg-[linear-gradient(180deg,rgba(242,247,253,.98)_0%,rgba(233,241,249,.98)_100%)]">
            <div className="mx-auto w-full max-w-[1480px] px-3 pb-3 pt-1 sm:px-5 sm:pb-4 md:px-6">
              <div className="mb-2 block min-[860px]:hidden">
                <LanguageToggle className="w-full justify-center" />
              </div>

              <div className="space-y-2.5">
                {PAGE_ROUTES.map((item) => (
                  <MobileNavItem
                    key={item.page}
                    item={item}
                    onClick={() => setMenuOpen(false)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
