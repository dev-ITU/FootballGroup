import dayjs from "dayjs";
import { CalendarClock, Radio, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";

function getCountdownData(kickoffIso, t) {
  if (!kickoffIso) {
    return {
      mode: "unknown",
      label: t("countdown.details"),
    };
  }

  const kickoff = dayjs(kickoffIso);
  if (!kickoff.isValid()) {
    return {
      mode: "unknown",
      label: t("countdown.details"),
    };
  }

  const diffMinutes = kickoff.diff(dayjs(), "minute");

  if (diffMinutes <= 0) {
    return {
      mode: "live",
      label: t("countdown.started"),
    };
  }

  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  if (days > 0) {
    return {
      mode: "upcoming",
      label: `${days}${t("countdown.dayShort")} ${hours}${t("countdown.hourShort")} ${minutes}${t("countdown.minuteShort")}`,
    };
  }

  return {
    mode: "upcoming",
    label: `${hours}${t("countdown.hourShort")} ${minutes}${t("countdown.minuteShort")}`,
  };
}

export default function CountdownChip({ kickoffIso, dark = false, className }) {
  const { t } = useI18n();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const data = useMemo(() => getCountdownData(kickoffIso, t), [kickoffIso, t, tick]);

  const Icon =
    data.mode === "live"
      ? Radio
      : data.mode === "unknown"
        ? Sparkles
        : CalendarClock;

  return (
    <div
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-bold shadow-[0_10px_24px_rgba(8,31,61,.10)] backdrop-blur-md transition duration-200",
        dark && data.mode === "live" && "border-white/16 bg-white/12 text-white",
        dark && data.mode === "upcoming" && "border-white/20 bg-white text-[#0b2344]",
        dark && data.mode === "unknown" && "border-white/16 bg-white/10 text-white/88",
        !dark && data.mode === "live" && "border-[#ffd9d9] bg-[#fff2f2] text-[#b42318]",
        !dark && data.mode === "upcoming" && "border-[#d7e6f4] bg-white text-[#0b2344]",
        !dark && data.mode === "unknown" && "border-[#d7e6f4] bg-white text-[#5f7899]",
        className,
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          dark && data.mode === "live" && "text-white",
          dark && data.mode === "upcoming" && "text-[#0d4ea5]",
          dark && data.mode === "unknown" && "text-white/72",
          !dark && data.mode === "live" && "text-[#b42318]",
          !dark && data.mode === "upcoming" && "text-[#0d4ea5]",
          !dark && data.mode === "unknown" && "text-[#7b91ac]",
        )}
        strokeWidth={2}
      />

      <span>{data.label}</span>
    </div>
  );
}
