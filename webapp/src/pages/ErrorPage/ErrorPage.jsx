import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  SearchX,
  ServerCrash,
  ShieldAlert,
  WifiOff,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useI18n } from "@/shared/i18n/index.jsx";
import Button from "@/shared/ui/Button/Button.jsx";

function resolveErrorConfig(type, state, t) {
  const rawDetail = String(
    state?.detail || state?.message || state?.error || ""
  ).trim();

  const rawText = rawDetail.toLowerCase();

  const inferredType =
    type !== "generic"
      ? type
      : rawText.includes("failed to fetch") ||
        rawText.includes("networkerror") ||
        rawText.includes("load failed") ||
        rawText.includes("network request failed")
      ? "network"
      : rawText.includes("403") || rawText.includes("forbidden")
      ? "forbidden"
      : rawText.includes("404") || rawText.includes("not found")
      ? "not-found"
      : rawText.includes("500") || rawText.includes("internal server error")
      ? "server"
      : "generic";

  const configs = {
    "not-found": {
      kind: "not-found",
      icon: SearchX,
      iconWrapClass: "bg-slate-100 text-slate-700",
      badge: t("error.notFound.badge"),
      title: t("error.notFound.title"),
      message: t("error.notFound.message"),
      hint: t("error.notFound.hint"),
    },
    network: {
      kind: "network",
      icon: WifiOff,
      iconWrapClass: "bg-sky-100 text-sky-700",
      badge: t("error.network.badge"),
      title: t("error.network.title"),
      message: t("error.network.message"),
      hint: t("error.network.hint"),
    },
    forbidden: {
      kind: "forbidden",
      icon: ShieldAlert,
      iconWrapClass: "bg-amber-100 text-amber-700",
      badge: t("error.forbidden.badge"),
      title: t("error.forbidden.title"),
      message: t("error.forbidden.message"),
      hint: t("error.forbidden.hint"),
    },
    server: {
      kind: "server",
      icon: ServerCrash,
      iconWrapClass: "bg-rose-100 text-rose-700",
      badge: t("error.server.badge"),
      title: t("error.server.title"),
      message: t("error.server.message"),
      hint: t("error.server.hint"),
    },
    generic: {
      kind: "generic",
      icon: AlertTriangle,
      iconWrapClass: "bg-slate-100 text-slate-700",
      badge: t("error.generic.badge"),
      title: t("error.generic.title"),
      message: t("error.generic.message"),
      hint: t("error.generic.hint"),
    },
  };

  const config = configs[inferredType];

  return {
    ...config,
    title: state?.title || config.title,
    message: state?.userMessage || config.message,
    detail: rawDetail,
  };
}

export default function ErrorPage({ type = "generic" }) {
  const { t } = useI18n();
  const location = useLocation();
  const state = location.state || {};
  const error = resolveErrorConfig(type, state, t);
  const Icon = error.icon;

  useEffect(() => {
    document.title = error.title;
    console.groupCollapsed(
      `[ErrorPage] ${error.kind} • ${location.pathname || "/"}`
    );
    console.error("Path:", location.pathname || "/");
    console.error("Type prop:", type);
    console.error("Location state:", state);
    console.error("Resolved error:", error);
    console.groupEnd();
  }, [error, location.pathname, state, type]);

  return (
    <section className="flex min-h-[78vh] items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-[760px] rounded-[36px] border border-[#dbe5f0] bg-white px-6 py-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:px-8 sm:py-8">
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] ${error.iconWrapClass}`}
          >
            <Icon className="h-7 w-7" strokeWidth={1.9} />
          </div>

          <span className="inline-flex min-h-9 items-center rounded-full border border-[#d9e3ee] bg-[#f8fafc] px-4 text-[12px] font-semibold tracking-[0.08em] text-slate-500">
            {error.badge}
          </span>
        </div>

        <h1 className="mt-8 max-w-[12ch] text-[46px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#0b132b] sm:text-[58px]">
          {error.title}
        </h1>

        <p className="mt-5 max-w-[620px] text-[18px] leading-9 text-slate-600">
          {error.message}
        </p>

        <div className="mt-7 rounded-[22px] bg-[#f5f8fb] px-5 py-4 text-[15px] leading-7 text-slate-600">
          {error.hint}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/" variant="primary" leftIcon={Home}>
            {t("common.toHome")}
          </Button>

          <Button
            variant="secondary"
            leftIcon={RefreshCw}
            onClick={() => window.location.reload()}
          >
            {t("common.reloadPage")}
          </Button>

          <Button
            variant="ghost"
            leftIcon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            {t("common.back")}
          </Button>
        </div>
      </div>
    </section>
  );
}
