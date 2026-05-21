import {
  formatDateValue,
  formatHeightValue,
  formatWeightValue,
  translate,
} from "@/shared/i18n/index.jsx";
import {
  localizeCountry,
  localizePlace,
  localizePlayerName,
  localizePreviousClub,
  resolveLocalizedField,
} from "@/shared/lib/contentLocalization.js";

const POSITION_ORDER = {
  GK: 1,
  DF: 2,
  MF: 3,
  FW: 4,
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export { POSITION_ORDER };

export function resolvePositionLabel(position, language = "ru") {
  const raw = String(position || "").toUpperCase();

  if (raw === "GK") return translate(language, "positions.GK");
  if (raw === "DF") return translate(language, "positions.DF");
  if (raw === "MF") return translate(language, "positions.MF");
  if (raw === "FW") return translate(language, "positions.FW");

  return position || translate(language, "positions.default");
}

export function resolvePositionPlural(position, language = "ru") {
  const raw = String(position || "").toUpperCase();

  if (raw === "GK") return translate(language, "positions.GK.plural");
  if (raw === "DF") return translate(language, "positions.DF.plural");
  if (raw === "MF") return translate(language, "positions.MF.plural");
  if (raw === "FW") return translate(language, "positions.FW.plural");

  return translate(language, "positions.defaultPlural");
}

export function resolvePositionKey(value) {
  const raw = String(value || "").toUpperCase();

  if (raw.includes("GK") || raw.includes("ВРАТ") || raw.includes("GOAL")) return "GK";
  if (raw.includes("DF") || raw.includes("ЗАЩ") || raw.includes("DEF")) return "DF";
  if (raw.includes("MF") || raw.includes("ПОЛУ") || raw.includes("MID")) return "MF";
  if (raw.includes("FW") || raw.includes("НАП") || raw.includes("FORW")) return "FW";

  return raw || "FW";
}

export function initialsOf(name) {
  return (
    String(name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

export function resolvePlayerSlug(player) {
  if (player?.slug) return player.slug;
  if (player?.id) return String(player.id);
  if (player?.number) return `player-${player.number}`;

  return `player-${String(player?.full_name || "unknown")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
}

export function formatBirthDate(value, language = "ru") {
  if (!value) return translate(language, "common.na");

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return translate(language, "common.na");

  return formatDateValue(language, date, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function normalizeTeamPlayer(player, language = "ru") {
  if (!player) return null;

  const position = resolvePositionKey(player.position || player.position_label);
  const localizedFullName =
    localizePlayerName(resolveLocalizedField(player, "full_name", language), language) || translate(language, "positions.default");
  const localizedCitizenship = localizeCountry(resolveLocalizedField(player, "citizenship", language), language);
  const localizedPreviousClub = localizePreviousClub(resolveLocalizedField(player, "previous_club", language), language);
  const localizedPlaceOfBirth = localizePlace(
    resolveLocalizedField(player, "place_of_birth", language) || resolveLocalizedField(player, "hometown", language),
    language,
  );
  const localizedAchievements = resolveLocalizedField(player, "achievements", language);
  const localizedBio = resolveLocalizedField(player, "bio", language);
  const compactProfile = [
    localizedCitizenship || null,
    player.height_cm ? formatHeightValue(language, player.height_cm) : null,
    player.weight_kg ? formatWeightValue(language, player.weight_kg) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    ...player,
    full_name: localizedFullName,
    slug: player.slug || resolvePlayerSlug(player),
    photo_url: player.photo_url || player.remote_photo_url || "",
    number: player.number ?? "",
    position,
    position_label: resolvePositionLabel(position, language),
    matches_for_club: player.matches_for_club ?? 0,
    minutes_for_club: player.minutes_for_club ?? 0,
    goals_for_club: player.goals_for_club ?? 0,
    yellow_cards: player.yellow_cards ?? 0,
    red_cards: player.red_cards ?? 0,
    citizenship: localizedCitizenship || "",
    previous_club: localizedPreviousClub || translate(language, "common.na"),
    birth_date_label: formatBirthDate(player.birth_date, language),
    height_cm: player.height_cm ?? null,
    weight_kg: player.weight_kg ?? null,
    age: player.age ?? null,
    place_of_birth: localizedPlaceOfBirth || "",
    initials: player.initials || initialsOf(localizedFullName),
    captain: Boolean(player.captain),
    featured: Boolean(player.featured),
    achievements: localizedAchievements || "",
    compact_profile: compactProfile || resolvePositionLabel(position, language),
    bio: localizedBio || compactProfile || resolvePositionLabel(position, language),
    sort_order: player.sort_order ?? 999,
  };
}

export function collectAllPlayers(data, language = "ru") {
  const rawPlayers =
    Array.isArray(data?.groups) && data.groups.length
      ? data.groups.flatMap((group) => group.players || [])
      : Array.isArray(data?.players)
        ? data.players
        : [];

  return rawPlayers.map((player) => normalizeTeamPlayer(player, language)).filter(Boolean);
}

export function buildVisibleGroups(data, language = "ru") {
  const rawGroups =
    Array.isArray(data?.groups) && data.groups.length ? data.groups : null;

  if (rawGroups) {
    return rawGroups
      .map((group, index) => {
        const resolvedKey = resolvePositionKey(
          group?.key || group?.label || group?.players?.[0]?.position,
        );

        return {
          ...group,
          key: resolvedKey,
          label: resolvePositionLabel(resolvedKey, language),
          anchorId: `team-group-${resolvedKey.toLowerCase()}-${index + 1}`,
          players: Array.isArray(group?.players)
            ? group.players.map((player) => normalizeTeamPlayer(player, language)).filter(Boolean)
            : [],
        };
      })
      .filter((group) => group.players.length > 0)
      .sort(
        (a, b) =>
          (POSITION_ORDER[resolvePositionKey(a.key)] || 99) -
          (POSITION_ORDER[resolvePositionKey(b.key)] || 99),
      );
  }

  const players = collectAllPlayers(data, language);
  const bucket = new Map();

  players.forEach((player) => {
    const key = resolvePositionKey(player.position);

    if (!bucket.has(key)) {
      bucket.set(key, {
        key,
        label: resolvePositionLabel(key, language),
        anchorId: `team-group-${key.toLowerCase()}`,
        players: [],
      });
    }

    bucket.get(key).players.push(player);
  });

  return [...bucket.values()]
    .map((group) => ({
      ...group,
      players: [...group.players].sort(
        (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999),
      ),
    }))
    .sort(
      (a, b) =>
        (POSITION_ORDER[resolvePositionKey(a.key)] || 99) -
        (POSITION_ORDER[resolvePositionKey(b.key)] || 99),
    );
}

export function findCaptain(data, players = [], language = "ru") {
  return normalizeTeamPlayer(data?.captain, language) || players.find((player) => player?.captain) || null;
}

export function getAveragePlayerAge(players = []) {
  const values = players
    .map((player) => Number(player.age))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!values.length) return null;

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function buildRelatedPlayers(players, currentPlayer, limit = 3) {
  return players
    .filter(
      (item) =>
        item.slug !== currentPlayer.slug &&
        resolvePositionKey(item.position) === resolvePositionKey(currentPlayer.position),
    )
    .sort((a, b) => {
      const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featuredDelta !== 0) return featuredDelta;

      const captainDelta = Number(Boolean(b.captain)) - Number(Boolean(a.captain));
      if (captainDelta !== 0) return captainDelta;

      return (a.sort_order ?? 999) - (b.sort_order ?? 999);
    })
    .slice(0, limit);
}

export function getGroupMeta(group, language = "ru") {
  const key = resolvePositionKey(group?.key || group?.label);

  if (key === "GK") {
    return {
      short: "GK",
      label: translate(language, "positions.GK"),
      chipClass:
        "border-sky-200/90 bg-white text-sky-700 shadow-[0_12px_24px_rgba(59,130,246,.08)] hover:border-sky-300 hover:bg-sky-50/75",
      iconWrapClass: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/80",
      countClass: "bg-sky-600 text-white",
      lineClass: "from-sky-500 via-cyan-400 to-transparent",
    };
  }

  if (key === "DF") {
    return {
      short: "DF",
      label: translate(language, "positions.DF"),
      chipClass:
        "border-indigo-200/90 bg-white text-indigo-700 shadow-[0_12px_24px_rgba(99,102,241,.08)] hover:border-indigo-300 hover:bg-indigo-50/70",
      iconWrapClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/80",
      countClass: "bg-indigo-600 text-white",
      lineClass: "from-indigo-500 via-blue-400 to-transparent",
    };
  }

  if (key === "MF") {
    return {
      short: "MF",
      label: translate(language, "positions.MF"),
      chipClass:
        "border-violet-200/90 bg-white text-violet-700 shadow-[0_12px_24px_rgba(139,92,246,.08)] hover:border-violet-300 hover:bg-violet-50/70",
      iconWrapClass: "bg-violet-50 text-violet-700 ring-1 ring-violet-200/80",
      countClass: "bg-violet-600 text-white",
      lineClass: "from-violet-500 via-fuchsia-400 to-transparent",
    };
  }

  return {
    short: "FW",
    label: translate(language, "positions.FW"),
    chipClass:
      "border-amber-200/90 bg-white text-amber-700 shadow-[0_12px_24px_rgba(245,158,11,.08)] hover:border-amber-300 hover:bg-amber-50/70",
    iconWrapClass: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
    countClass: "bg-amber-500 text-white",
    lineClass: "from-amber-500 via-orange-400 to-transparent",
  };
}

export function scrollToAnchor(anchorId, offset = 110) {
  const element = document.getElementById(anchorId);
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top,
    behavior: "smooth",
  });
}

export function getPlayerTone(player) {
  const raw = `${player?.position_label || ""} ${player?.position || ""}`.toLowerCase();

  if (raw.includes("gk") || raw.includes("врат") || raw.includes("goal")) {
    return {
      heroBg:
        "bg-[linear-gradient(180deg,rgba(248,252,255,.98)_0%,rgba(234,245,255,.98)_45%,rgba(226,239,252,.98)_100%)]",
      posterBg: "bg-[linear-gradient(180deg,#eef8ff_0%,#dcefff_100%)]",
      line: "from-sky-500 via-cyan-400 to-sky-300",
      chipClass: "border-sky-200/80 bg-white/88 text-sky-700",
      strongChipClass: "border-sky-600 bg-sky-600 text-white",
      ringClass: "border-sky-500/14",
      glowClass: "bg-sky-300/18",
      numberClass: "text-sky-700/[0.08]",
      captainChip: "border-sky-200 bg-white/90 text-sky-700",
      poster: "bg-[linear-gradient(180deg,#eef8ff_0%,#dcefff_100%)]",
    };
  }

  if (raw.includes("df") || raw.includes("защит") || raw.includes("def")) {
    return {
      heroBg:
        "bg-[linear-gradient(180deg,rgba(250,252,255,.98)_0%,rgba(240,245,255,.98)_45%,rgba(231,239,255,.98)_100%)]",
      posterBg: "bg-[linear-gradient(180deg,#f1f4ff_0%,#dde6ff_100%)]",
      line: "from-indigo-500 via-blue-500 to-sky-400",
      chipClass: "border-indigo-200/80 bg-white/88 text-indigo-700",
      strongChipClass: "border-indigo-600 bg-indigo-600 text-white",
      ringClass: "border-indigo-500/14",
      glowClass: "bg-indigo-300/16",
      numberClass: "text-indigo-700/[0.08]",
      captainChip: "border-indigo-200 bg-white/90 text-indigo-700",
      poster: "bg-[linear-gradient(180deg,#f1f4ff_0%,#dde6ff_100%)]",
    };
  }

  if (raw.includes("mf") || raw.includes("полузащит") || raw.includes("mid")) {
    return {
      heroBg:
        "bg-[linear-gradient(180deg,rgba(251,250,255,.98)_0%,rgba(245,240,255,.98)_45%,rgba(238,232,255,.98)_100%)]",
      posterBg: "bg-[linear-gradient(180deg,#f5f1ff_0%,#ece3ff_100%)]",
      line: "from-violet-500 via-fuchsia-400 to-sky-300",
      chipClass: "border-violet-200/80 bg-white/88 text-violet-700",
      strongChipClass: "border-violet-600 bg-violet-600 text-white",
      ringClass: "border-violet-500/14",
      glowClass: "bg-violet-300/16",
      numberClass: "text-violet-700/[0.08]",
      captainChip: "border-violet-200 bg-white/90 text-violet-700",
      poster: "bg-[linear-gradient(180deg,#f5f1ff_0%,#ece3ff_100%)]",
    };
  }

  return {
    heroBg:
      "bg-[linear-gradient(180deg,rgba(255,252,247,.98)_0%,rgba(255,246,234,.98)_45%,rgba(255,238,214,.98)_100%)]",
    posterBg: "bg-[linear-gradient(180deg,#fff8ef_0%,#ffeacf_100%)]",
    line: "from-amber-500 via-orange-400 to-yellow-300",
    chipClass: "border-amber-200/80 bg-white/88 text-amber-700",
    strongChipClass: "border-amber-500 bg-amber-500 text-white",
    ringClass: "border-amber-500/16",
    glowClass: "bg-amber-300/18",
    numberClass: "text-amber-700/[0.08]",
    captainChip: "border-amber-200 bg-white/90 text-amber-700",
    poster: "bg-[linear-gradient(180deg,#fff8ef_0%,#ffeacf_100%)]",
  };
}

export function getPlayerHeroStats(player, language = "ru") {
  const position = resolvePositionKey(player.position);

  if (position === "GK") {
    return [
      { label: translate(language, "common.matches"), value: player.matches_for_club },
      { label: translate(language, "common.minutes"), value: player.minutes_for_club },
      { label: translate(language, "common.height"), value: formatHeightValue(language, player.height_cm) },
    ];
  }

  return [
    { label: translate(language, "common.matches"), value: player.matches_for_club },
    { label: translate(language, "common.minutes"), value: player.minutes_for_club },
    { label: translate(language, "common.goals"), value: player.goals_for_club },
  ];
}

export function buildPlayerTraits(player, language = "ru") {
  const position = resolvePositionKey(player.position);
  const matches = safeNumber(player.matches_for_club);
  const minutes = safeNumber(player.minutes_for_club);
  const goals = safeNumber(player.goals_for_club);
  const yellow = safeNumber(player.yellow_cards);
  const red = safeNumber(player.red_cards);
  const age = safeNumber(player.age, 26);
  const height = safeNumber(player.height_cm, 180);
  const weight = safeNumber(player.weight_kg, 75);

  const minutesBoost = minutes / 280;
  const matchesBoost = matches / 9;
  const goalBoost = goals * 1.8;
  const ageSpeedAdjust = age <= 23 ? 8 : age <= 28 ? 5 : age <= 32 ? 1 : -4;
  const disciplinePenalty = yellow * 1.6 + red * 10;
  const sizeBoost = (height - 175) * 0.45 + (weight - 72) * 0.25;

  if (position === "GK") {
    return [
      { label: translate(language, "player.trait.reaction"), value: clamp(72 + minutesBoost + ageSpeedAdjust * 0.35, 58, 97) },
      { label: translate(language, "player.trait.positioning"), value: clamp(68 + matchesBoost + minutes / 420, 58, 96) },
      { label: translate(language, "player.trait.handling"), value: clamp(70 + matchesBoost, 55, 96) },
      { label: translate(language, "player.trait.footwork"), value: clamp(58 + minutes / 520 + goalBoost * 0.2, 46, 88) },
      { label: translate(language, "player.trait.composure"), value: clamp(74 + matches / 14 - disciplinePenalty * 0.18, 50, 95) },
    ];
  }

  if (position === "DF") {
    return [
      { label: translate(language, "player.trait.speed"), value: clamp(66 + ageSpeedAdjust + (180 - Math.abs(height - 180)) * 0.2, 54, 92) },
      { label: translate(language, "player.trait.stamina"), value: clamp(68 + minutesBoost + matches / 15, 56, 96) },
      { label: translate(language, "player.trait.tackling"), value: clamp(72 + matchesBoost + sizeBoost * 0.35, 58, 97) },
      { label: translate(language, "player.trait.power"), value: clamp(70 + sizeBoost, 56, 95) },
      { label: translate(language, "player.trait.discipline"), value: clamp(88 - disciplinePenalty + matches / 28, 40, 94) },
    ];
  }

  if (position === "MF") {
    return [
      { label: translate(language, "player.trait.speed"), value: clamp(68 + ageSpeedAdjust, 55, 93) },
      { label: translate(language, "player.trait.stamina"), value: clamp(70 + minutesBoost + matches / 16, 58, 97) },
      { label: translate(language, "player.trait.technique"), value: clamp(72 + goalBoost * 0.35, 58, 97) },
      { label: translate(language, "player.trait.creativity"), value: clamp(70 + goalBoost * 0.3 + matches / 18, 56, 95) },
      { label: translate(language, "player.trait.iq"), value: clamp(72 + matches / 10 + age * 0.15, 58, 96) },
    ];
  }

  return [
    { label: translate(language, "player.trait.speed"), value: clamp(72 + ageSpeedAdjust, 58, 96) },
    { label: translate(language, "player.trait.stamina"), value: clamp(66 + minutesBoost + matches / 16, 56, 95) },
    { label: translate(language, "player.trait.shot"), value: clamp(72 + goalBoost, 55, 98) },
    { label: translate(language, "player.trait.sharpness"), value: clamp(70 + goalBoost * 0.4 + ageSpeedAdjust * 0.5, 56, 96) },
    { label: translate(language, "player.trait.power"), value: clamp(66 + sizeBoost * 0.8, 54, 94) },
  ];
}

export function buildPlayerBiography(player, language = "ru") {
  const birthInfo =
    player.birth_date_label !== translate(language, "common.na")
      ? resolveBirthInfo(language, player.birth_date_label)
      : translate(language, "player.bio.birthUnknown");

  const birthPlace = player.place_of_birth
    ? resolveLanguageSpecificBirthPlace(language, player.place_of_birth)
    : "";
  const nationality =
    player.citizenship && player.citizenship !== translate(language, "common.na")
      ? translate(language, "player.bio.represents", { value: player.citizenship })
      : "";
  const previousClub =
    player.previous_club && player.previous_club !== translate(language, "common.na")
      ? translate(language, "player.bio.previousClub", { value: player.previous_club })
      : "";
  const shirtNumber = player.number ? translate(language, "player.bio.shirtNumber", { value: player.number }) : "";
  const captain =
    player.captain
      ? translate(language, "player.bio.captain")
      : "";

  let roleText = translate(language, "player.bio.role.default");

  if (player.position === "GK") {
    roleText = translate(language, "player.bio.role.GK");
  } else if (player.position === "DF") {
    roleText = translate(language, "player.bio.role.DF");
  } else if (player.position === "MF") {
    roleText = translate(language, "player.bio.role.MF");
  } else if (player.position === "FW") {
    roleText = translate(language, "player.bio.role.FW");
  }

  return [
    translate(language, "player.bio.summary", {
      name: player.full_name,
      position: player.position_label.toLowerCase(),
      birthInfo,
      birthPlace,
      nationality,
      previousClub,
      shirtNumber,
    }).trim(),
    `${roleText}${captain}`.trim(),
  ];
}

function resolveLanguageSpecificBirthPlace(language, placeOfBirth) {
  if (language === "en") {
    return ` in ${placeOfBirth}`;
  }

  return ` в ${placeOfBirth}`;
}

function resolveBirthInfo(language, birthDateLabel) {
  if (language === "en") {
    return `Born on ${birthDateLabel}`;
  }

  return `Родился ${birthDateLabel}`;
}
