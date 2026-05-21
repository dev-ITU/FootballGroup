import { LoaderCircle } from "lucide-react";
import { matchPath, useLocation } from "react-router-dom";

import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";

function prettifySlug(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function RouteLoadingState({ route }) {
  const { t } = useI18n();
  const location = useLocation();

  const matchedPlayerRoute =
    matchPath("/team/:playerSlug", location.pathname) ||
    matchPath("/team/:playerSlug/", location.pathname);

  const isPlayerRoute = Boolean(matchedPlayerRoute);

  const previewName =
    location.state?.playerPreview?.full_name ||
    prettifySlug(matchedPlayerRoute?.params?.playerSlug);

  const title = isPlayerRoute
    ? t("loading.openPlayer", {
        name: previewName || t("loading.playerFallback"),
      })
    : route?.page
      ? t("loading.openSection", {
          label: t(`nav.${route.page}`),
        })
      : t("loading.openPage");

  return (
    <section className={cn("mx-auto w-full max-w-[1360px] px-4 py-6")}>
      <div className={cn("space-y-6")}>
        <div
          className={cn(
            "overflow-hidden rounded-[36px] border border-white/80 bg-white/82 p-8 shadow-[0_30px_80px_rgba(8,31,61,0.10)] backdrop-blur",
          )}
        >
          <div className={cn("flex flex-wrap items-center gap-4")}>
            <div
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700",
              )}
            >
              <LoaderCircle
                className={cn("h-6 w-6 animate-spin")}
                strokeWidth={1.8}
              />
            </div>

            <div className={cn("min-w-0")}>
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.2em] text-sky-700",
                )}
              >
                {t("loading.title")}
              </p>

              <h2 className={cn("text-2xl font-semibold text-slate-950")}>
                {title}
              </h2>
            </div>
          </div>

          <div
            className={cn("mt-8 overflow-hidden rounded-full bg-slate-100")}
          >
            <div
              className={cn(
                "h-2 w-1/3 animate-pulse rounded-full bg-[linear-gradient(90deg,rgba(15,117,219,0.20),rgba(15,117,219,0.95),rgba(99,208,255,0.20))]",
              )}
            />
          </div>
        </div>

        <div className={cn("grid gap-6 lg:grid-cols-[1.12fr_0.88fr]")}>
          <div
            className={cn(
              "space-y-4 rounded-[36px] border border-white/80 bg-white/72 p-6 shadow-[0_24px_64px_rgba(8,31,61,0.08)] backdrop-blur",
            )}
          >
            <div className={cn("h-4 w-28 animate-pulse rounded-full bg-slate-200")} />
            <div className={cn("h-12 w-[72%] animate-pulse rounded-[18px] bg-slate-200")} />
            <div className={cn("h-5 w-full animate-pulse rounded-full bg-slate-200")} />
            <div className={cn("h-5 w-[92%] animate-pulse rounded-full bg-slate-200")} />
            <div className={cn("h-5 w-[84%] animate-pulse rounded-full bg-slate-200")} />

            <div className={cn("grid gap-3 pt-3 md:grid-cols-3")}>
              <div className={cn("h-28 animate-pulse rounded-[24px] bg-slate-200")} />
              <div className={cn("h-28 animate-pulse rounded-[24px] bg-slate-200")} />
              <div className={cn("h-28 animate-pulse rounded-[24px] bg-slate-200")} />
            </div>
          </div>

          <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-1")}>
            <div
              className={cn(
                "h-52 animate-pulse rounded-[32px] border border-white/80 bg-white/72 shadow-[0_24px_64px_rgba(8,31,61,0.08)] backdrop-blur",
              )}
            />
            <div
              className={cn(
                "h-52 animate-pulse rounded-[32px] border border-white/80 bg-white/72 shadow-[0_24px_64px_rgba(8,31,61,0.08)] backdrop-blur",
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
