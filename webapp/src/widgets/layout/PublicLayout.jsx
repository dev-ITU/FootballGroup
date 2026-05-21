import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
  getRouteByPage,
  getRouteByPathname,
  normalizePathname,
  PAGE_ROUTES,
} from "@/app/router/pageRoutes.js";
import { prefetchPagePayload } from "@/features/page-data/payloadCache.js";
import { getPageTitle, useI18n } from "@/shared/i18n/index.jsx";
import { localizeClubProfile } from "@/shared/lib/contentLocalization.js";
import usePagePayload from "@/features/page-data/usePagePayload.js";
import SiteFooter from "@/widgets/layout/SiteFooter.jsx";
import SiteHeader from "@/widgets/layout/SiteHeader.jsx";
import RouteLoadingState from "@/widgets/states/RouteLoadingState.jsx";

export default function PublicLayout({
  initialPage,
  initialPathname,
  initialPayload,
}) {
  const { language, t } = useI18n();
  const location = useLocation();
  const currentPathname = normalizePathname(location.pathname);

  const currentRoute = getRouteByPathname(currentPathname);
  const initialRoute =
    getRouteByPage(initialPage) ||
    getRouteByPathname(initialPathname) ||
    PAGE_ROUTES[0];

  const isContentRoute = Boolean(currentRoute);

  const pageState = usePagePayload({
    route: currentRoute,
    enabled: isContentRoute,
    currentPathname,
    initialPage,
    initialPathname,
    initialPayload,
  });

  const isResolvedForCurrentPath =
    isContentRoute && pageState.pathname === currentPathname;

  const activePayload =
    isResolvedForCurrentPath && pageState.status === "ready"
      ? pageState.payload
      : null;

  const FALLBACK_CLUB = {
    name: t("brand.defaultClubName"),
    short_name: t("brand.defaultShortName"),
    hero_badge: t("brand.defaultBadge"),
    stadium: t("brand.defaultStadium"),
    city: t("brand.defaultCity"),
    mission: t("brand.defaultMission"),
    address: "",
    email: "",
    phone: "",
    links: {},
  };

  const chromeClub = activePayload?.club || initialPayload?.club || FALLBACK_CLUB;

  const club = localizeClubProfile({
    ...FALLBACK_CLUB,
    ...(chromeClub || {}),
    links: {
      ...FALLBACK_CLUB.links,
      ...(chromeClub?.links || {}),
    },
  }, language);

  const resolvedPage = currentRoute?.page || initialRoute?.page || initialPage || "home";

  useEffect(() => {
    if (!isContentRoute) {
      return;
    }

    document.title = getPageTitle(language, resolvedPage, club.short_name || club.name);
  }, [club.name, club.short_name, isContentRoute, language, resolvedPage]);

  useEffect(() => {
    if (!isContentRoute || typeof window === "undefined") {
      return;
    }

    const routesToPrefetch = PAGE_ROUTES.filter((item) => item.page !== resolvedPage);
    const scheduleIdle =
      window.requestIdleCallback ||
      ((callback) => window.setTimeout(callback, 180));
    const cancelIdle =
      window.cancelIdleCallback ||
      ((id) => window.clearTimeout(id));

    const idleId = scheduleIdle(() => {
      routesToPrefetch.forEach((item) => {
        prefetchPagePayload(item);
      });
    });

    return () => cancelIdle(idleId);
  }, [isContentRoute, resolvedPage]);

  if (
    isContentRoute &&
    isResolvedForCurrentPath &&
    pageState.status === "error"
  ) {
    return (
      <Navigate
        to="/error/"
        replace
        state={{
          type: "runtime",
          title: t("layout.routeErrorTitle", {
            label: t(`nav.${currentRoute.page}`),
          }),
          userMessage:
            pageState.error?.message ||
            t("layout.routeErrorMessage"),
        }}
      />
    );
  }

  const shouldShowLoading =
    isContentRoute &&
    (!isResolvedForCurrentPath ||
      pageState.status === "loading" ||
      !activePayload);
  const localizedPayload = activePayload
    ? {
        ...activePayload,
        club,
      }
    : null;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_0%_0%,rgba(117,210,255,0.36),transparent_30%),radial-gradient(circle_at_100%_12%,rgba(13,78,165,0.18),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef4fa_52%,#edf3f9_100%)]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.24] [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.8),transparent_78%)]" />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.16] [background-image:radial-gradient(rgba(12,110,217,0.06)_0.6px,transparent_0.6px)] [background-size:18px_18px]" />

      <div className="pointer-events-none fixed -left-[140px] top-[-180px] z-0 h-[640px] w-[640px] rounded-full bg-[rgba(98,193,255,0.34)] opacity-[0.48] blur-[92px] animate-[drift_16s_ease-in-out_infinite]" />

      <div
        className="pointer-events-none fixed -right-[180px] top-[200px] z-0 h-[640px] w-[640px] rounded-full bg-[rgba(15,117,219,0.22)] opacity-[0.48] blur-[92px] animate-[drift_16s_ease-in-out_infinite]"
        style={{ animationDelay: "-8s" }}
      />

      <SiteHeader club={club} />

      <main className="relative z-[1] mx-auto w-[calc(100vw-48px)] max-w-[1360px] pb-[92px] pt-[30px] max-[980px]:w-[calc(100vw-24px)] max-[980px]:pt-[18px]">
        {isContentRoute ? (
          shouldShowLoading ? (
            <RouteLoadingState route={currentRoute || initialRoute} />
          ) : (
            <Outlet
              context={{
                data: localizedPayload,
                club,
                route: currentRoute,
              }}
            />
          )
        ) : (
          <Outlet
            context={{
              data: null,
              club,
              route: null,
            }}
          />
        )}
      </main>

      <SiteFooter club={club} />
    </div>
  );
}
