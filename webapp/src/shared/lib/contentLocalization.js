import { formatDateValue, resolveLanguage } from "@/shared/i18n/index.jsx";

function buildMaps(pairs) {
  return {
    ruToEn: new Map(pairs.map(([ru, en]) => [ru, en])),
    enToRu: new Map(pairs.map(([ru, en]) => [en, ru])),
  };
}

function exactLookup(language, value, maps) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const normalizedLanguage = resolveLanguage(language);
  if (normalizedLanguage === "en") {
    return maps.ruToEn.get(raw) || raw;
  }

  return maps.enToRu.get(raw) || raw;
}

function containsCyrillic(value) {
  return /[А-Яа-яЁё]/.test(String(value || ""));
}

function containsLatin(value) {
  return /[A-Za-z]/.test(String(value || ""));
}

const CYRILLIC_TO_LATIN = {
  А: "A",
  Б: "B",
  В: "V",
  Г: "G",
  Д: "D",
  Е: "E",
  Ё: "Yo",
  Ж: "Zh",
  З: "Z",
  И: "I",
  Й: "Y",
  К: "K",
  Л: "L",
  М: "M",
  Н: "N",
  О: "O",
  П: "P",
  Р: "R",
  С: "S",
  Т: "T",
  У: "U",
  Ф: "F",
  Х: "Kh",
  Ц: "Ts",
  Ч: "Ch",
  Ш: "Sh",
  Щ: "Shch",
  Ъ: "",
  Ы: "Y",
  Ь: "",
  Э: "E",
  Ю: "Yu",
  Я: "Ya",
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

const LATIN_MULTI_TO_CYRILLIC = [
  ["shch", "щ"],
  ["yo", "ё"],
  ["yu", "ю"],
  ["ya", "я"],
  ["zh", "ж"],
  ["kh", "х"],
  ["ts", "ц"],
  ["ch", "ч"],
  ["sh", "ш"],
  ["jo", "джо"],
];

const LATIN_TO_CYRILLIC = {
  a: "а",
  b: "б",
  c: "к",
  d: "д",
  e: "е",
  f: "ф",
  g: "г",
  h: "х",
  i: "и",
  j: "дж",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  q: "к",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  v: "в",
  w: "в",
  x: "кс",
  y: "й",
  z: "з",
};

function transliterateToLatin(value) {
  return String(value || "")
    .split("")
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join("");
}

function transliterateTokenToCyrillic(token) {
  let value = String(token || "");
  if (!value) return "";

  LATIN_MULTI_TO_CYRILLIC.forEach(([from, to]) => {
    value = value.replace(new RegExp(from, "gi"), (match) => {
      if (match.toUpperCase() === match) return to.toUpperCase();
      if (match[0] === match[0].toUpperCase()) {
        return to.charAt(0).toUpperCase() + to.slice(1);
      }

      return to;
    });
  });

  return value.replace(/[A-Za-z]/g, (char) => {
    const lower = char.toLowerCase();
    const resolved = LATIN_TO_CYRILLIC[lower] || char;

    if (char === char.toUpperCase()) {
      return resolved.charAt(0).toUpperCase() + resolved.slice(1);
    }

    return resolved;
  });
}

function transliterateToCyrillic(value) {
  return String(value || "").replace(/[A-Za-z]+/g, (token) =>
    transliterateTokenToCyrillic(token),
  );
}

function localizeExactValue(language, value, maps, options = {}) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const normalizedLanguage = resolveLanguage(language);
  const resolved = exactLookup(normalizedLanguage, raw, maps);

  if (resolved !== raw) {
    return resolved;
  }

  if (options.fallback === "latin" && normalizedLanguage === "en" && containsCyrillic(raw)) {
    return transliterateToLatin(raw);
  }

  if (options.fallback === "cyrillic" && normalizedLanguage === "ru" && containsLatin(raw)) {
    return transliterateToCyrillic(raw);
  }

  return raw;
}

export function resolveLocalizedField(entity, fieldName, language = "ru", fallback = "") {
  if (!entity) return fallback;

  const normalizedLanguage = resolveLanguage(language);
  const primary =
    String(entity?.[`${fieldName}_${normalizedLanguage}`] || "").trim();
  const secondary =
    String(entity?.[`${fieldName}_${normalizedLanguage === "en" ? "ru" : "en"}`] || "").trim();
  const legacy = String(entity?.[fieldName] || "").trim();

  return primary || legacy || secondary || fallback;
}

const CLUB_PROFILE_MAPS = buildMaps([
  ["ФК Зенит", "FC Zenit"],
  ["Газпром / Зенит", "Gazprom / Zenit"],
  ["Арена, команда и матч-дэй в фирменной подаче Газпрома.", "Arena, squad and matchday presented in Gazprom's signature style."],
  [
    "Сайт опирается на официальные данные первой команды «Зенита»: состав, фотографии, календарь и клубные публикации. На фронте всё подано как премиальная футбольная витрина Газпрома с акцентом на арену, матч-дэй и чистую визуальную дисциплину.",
    "The website is built on official first-team data from Zenit: squad, photos, fixtures and club stories. The frontend presents it as Gazprom's premium football showcase focused on the arena, matchday and clean visual discipline.",
  ],
  ["Санкт-Петербург", "Saint Petersburg"],
  ["Газпром Арена", "Gazprom Arena"],
  ["Санкт-Петербург, «Газпром Арена»", "Saint Petersburg, Gazprom Arena"],
  ["Газпром футбольная программа", "Gazprom football program"],
]);

const SOURCE_NAME_MAPS = buildMaps([
  ["ФК «Зенит»", "FC Zenit"],
  ["ФК Зенит", "FC Zenit"],
]);

const PLAYER_NAME_MAPS = buildMaps([
  ["Евгений Латышонок", "Evgeniy Latyshonok"],
  ["Денис Адамов", "Denis Adamov"],
  ["Михаил Кержаков", "Mikhail Kerzhakov"],
  ["Богдан Москвичёв", "Bogdan Moskvichev"],
  ["Дуглас Сантос", "Douglas Santos"],
  ["Юрий Горшков", "Yuri Gorshkov"],
  ["Ваня Дркушич", "Vanja Drkusic"],
  ["Нино", "Nino"],
  ["Вячеслав Караваев", "Vyacheslav Karavaev"],
  ["Арсен Адамов", "Arsen Adamov"],
  ["Нуралы Алип", "Nuraly Alip"],
  ["Игорь Дивеев", "Igor Diveev"],
  ["Вендел", "Wendel"],
  ["Максим Глушенков", "Maksim Glushenkov"],
  ["Вильмар Барриос", "Wilmar Barrios"],
  ["Андрей Мостовой", "Andrey Mostovoy"],
  ["Луис Энрике", "Luiz Henrique"],
  ["Густаво Мантуан", "Gustavo Mantuan"],
  ["Ярослав Михайлов", "Yaroslav Mihailov"],
  ["Педро", "Pedro"],
  ["Жон Жон", "Jhon Jhon"],
  ["Даниил Кондаков", "Daniil Kondakov"],
  ["Вадим Шилов", "Vadim Shilov"],
  ["Александр Соболев", "Aleksandr Sobolev"],
  ["Александр Ерохин", "Aleksander Erokhin"],
  ["Роман Вега", "Roman Vega"],
  ["Джон Дуран", "Jhon Duran"],
]);

const COUNTRY_MAPS = buildMaps([
  ["Россия", "Russia"],
  ["Бразилия", "Brazil"],
  ["Бразилия / Россия", "Brazil/Russia"],
  ["Бразилия / Россия", "Brazil / Russia"],
  ["Колумбия", "Colombia"],
  ["Казахстан", "Kazakhstan"],
  ["Словения", "Slovenia"],
  ["Аргентина", "Argentina"],
]);

const PREVIOUS_CLUB_MAPS = buildMaps([
  ["Аль-Наср", "Al-Nassr"],
  ["Архентинос Хуниорс", "Argentinos Juniors"],
  ["Балтика Калининград", "Baltika Kaliningrad"],
  ["Бока Хуниорс", "Boca Juniors"],
  ["Ботафого", "Botafogo"],
  ["Коринтианс", "Corinthians"],
  ["Кайрат", "FC Kairat"],
  ["Урал", "Fc Ural"],
  ["Флуминенсе", "Fluminense"],
  ["Гамбург", "Hamburg"],
  ["Химки", "Khimki"],
  ["Крылья Советов", "Krylia Sovetov"],
  ["Локомотив Москва", "Lokomotiv Moscow"],
  ["Ред Булл Брагантино", "Red Bull Bragantino"],
  ["Ростов", "Rostov"],
  ["Витесс", "SBV Vitesse"],
  ["Сочи", "Sochi"],
  ["Спартак Москва", "Spartak Moscow"],
  ["Спортинг Лиссабон", "Sporting Lisbon"],
  ["ЦСКА", "CSKA Moscow"],
]);

const PLACE_MAPS = buildMaps([
  ["Актау, Казахстан", "Aktau, Kazakhstan"],
  ["Барнаул", "Barnual"],
  ["Барнаул", "Barnaul"],
  ["Белгород, Россия", "Belgorod, Russia"],
  ["Буэнос-Айрес", "Buenos Aires"],
  ["Картахена-де-Индиас", "Cartagena de Indias"],
  ["Дуке-ди-Кашиас", "Duque de Caxias"],
  ["Гиагинская", "Giaginskaya"],
  ["Жуан-Песоа", "João Pessoa"],
  ["Кингисепп", "Kingisepp"],
  ["Кондопога", "Kondopoga"],
  ["Москва", "Moscow"],
  ["Нижний Тагил", "Nizhny Tagil"],
  ["Ново-Место, Словения", "Novo Mesto, Slovenia"],
  ["Омск", "Omsk"],
  ["Петрополис, Рио-де-Жанейро", "Petropolis, Rio de Janeiro."],
  ["Ресифи", "Recife"],
  ["Санту-Андре", "Santo André"],
  ["Смоленск", "Smolensk"],
  ["Сан-Паулу", "São Paulo"],
  ["Ульяновск", "Ulyanovsk"],
  ["Витория, Бразилия", "Vitoria, Brazil"],
  ["Сарагоса, Колумбия", "Zaragoza, Colombia"],
  ["Уфа", "Ufa"],
]);

const OPPONENT_MAPS = buildMaps([
  ["Акрон", "Akron"],
  ["Ахмат", "Akhmat"],
  ["Балтика", "Baltika"],
  ["Воеводина", "Vojvodina"],
  ["Динамо Махачкала", "Dynamo Makhachkala"],
  ["Динамо Москва", "Dynamo Moscow"],
  ["Динамо Самарканд", "Dynamo Samarkand"],
  ["Кайрат", "Kairat"],
  ["Краснодар", "Krasnodar"],
  ["Крылья Советов", "Krylia Sovetov"],
  ["Локомотив Москва", "Lokomotiv Moscow"],
  ["Оренбург", "Orenburg"],
  ["Пари НН", "Pari NN"],
  ["Ростов", "Rostov"],
  ["Рубин", "Rubin"],
  ["Сочи", "Sochi"],
  ["Спартак", "Spartak Moscow"],
  ["Сьон", "Sion"],
  ["ЦСКА", "CSKA Moscow"],
  ["Црвена Звезда", "Crvena Zvezda"],
  ["Шанхай Порт", "Shanghai Port"],
]);

const VENUE_MAPS = buildMaps([
  ["Ахмат Арена", "Akhmat Arena"],
  ["Стадион Аль-Нахаян", "Al Nahyan Stadium"],
  ["Стадион «Аспайр»", "Aspire Stadium"],
  ["Олимпийский стадион «Фишт»", "Fisht Olympic Stadium"],
  ["Стадион «Газовик»", "Gazovik Stadium"],
  ["Лукойл Арена", "Lukoil Arena"],
  ["Стадион «Нижний Новгород»", "Nizhny Novgorod Stadium"],
  ["Озон Арена", "Ozon Arena"],
  ["Стадион «Смена»", "Smena Stadium"],
  ["Солидарность Самара Арена", "Solidarnost Samara Arena"],
  ["Стадион «Фишт»", "Stadion Fisht"],
  ["Газпром Арена", "Gazprom Arena"],
  ["Ак Барс Арена", "Ak Bars Arena"],
  ["ВТБ Арена", "VTB Arena"],
  ["Лужники", "Luzhniki"],
  ["Ростех Арена", "Rostec Arena"],
  ["Стадион Jebel Ali", "Jebel Ali Stadium"],
]);

const STORY_TITLE_MAPS = buildMaps([
  ["Педро: «Было очень важно одержать победу в таком принципиальном противостоянии»", "Pedro: “It was very important to win such an important game today”"],
  ["Александр Соболев: «Конечно, я хотел забить»", "Alexander Sobolev: “Of course, I wanted to score. ”"],
  ["Сергей Семак: «Мы, безусловно, довольны результатом»", "Sergei Semak: \"We are certainly happy with the result\""],
  ["Соболев и Педро выйдут с первых минут против «Спартака»", "Sobolev and Pedro to start against Spartak Moscow"],
  ["Сегодня «Зенит» сыграет со «Спартаком» на «Газпром Арене»", "We play Spartak today at the Gazprom Arena"],
  ["Фильм «Зенит навсегда»: в Петербурге прошла премьера новой картины клуба", "Zenit Forever the movie: The premier of the club’s new film took place in St. Petersburg"],
]);

const STORY_EXCERPT_MAPS = buildMaps([
  ["Лучший игрок матча рассказал нам о победе над «Спартаком» со счётом 2:0.", "Today’s Man of the Match spoke to us after the 2-0 win over Spartak Moscow."],
  ["Нападающий «Зенита» рассказал о голе, праздновании и победе над «Спартаком».", "The Zenit striker spoke to us about scoring, his goal celebration, and the win over Spartak."],
  ["Послематчевая пресс-конференция главного тренера «Зенита» после победы над «Спартаком».", "The Zenit manager’s post match press conference after the win over Spartak Moscow."],
  ["Сергей Семак назвал стартовый состав на матч на «Газпром Арене».", "Sergei Semak has named his starting XI for the match at the Gazprom Arena."],
  ["21-й матч этого сезона РПЛ начнётся в 16:00 по петербургскому времени.", "Our 21st game of this RPL season kicks off at 4pm St. Petersburg time."],
  ["Фильм посвящён столетию клуба и рассказывает об уникальной 100-летней истории команды: от заводского коллектива 1925 года до одного из главных клубов России сегодня.", "The film celebrates our centenary and covers the unique 100 year history of the club, from our founding as a factory team in 1925, to becoming Russia’s biggest club today."],
]);

const STORY_BODY_MAPS = buildMaps([
  ["Официальный материал «Зенита». Полную публикацию смотрите в источнике.", "Official Zenit story. Read the full piece at the source."],
]);

const TROPHY_TITLE_MAPS = buildMaps([
  ["Кубок УЕФА", "UEFA Cup"],
  ["Российская Премьер-Лига", "Russian Premier Liga"],
  ["Суперкубок России", "Russian Super Cup"],
  ["Суперкубок УЕФА", "UEFA Super Cup"],
]);

const TROPHY_DESCRIPTION_MAPS = buildMaps([
  ["Европейский трофей клуба на международной арене.", "The club's European trophy on the international stage."],
  ["Чемпион России по итогам сезона.", "Champions of Russia at the end of the season."],
  ["Победа в матче за Суперкубок России.", "Victory in the Russian Super Cup match."],
  ["Победа над обладателем Лиги чемпионов в матче за Суперкубок УЕФА.", "Victory over the reigning Champions League winners in the UEFA Super Cup match."],
]);

function createMatchweekLabel(language, number) {
  const value = Number(number);
  if (!Number.isFinite(value)) return "";
  return resolveLanguage(language) === "en" ? `Matchweek ${value}` : `${value}-й тур`;
}

export function localizeClubProfile(club, language = "ru") {
  if (!club) return club;

  return {
    ...club,
    name: localizeExactValue(language, resolveLocalizedField(club, "name", language), CLUB_PROFILE_MAPS, { fallback: "latin" }),
    short_name: localizeExactValue(language, resolveLocalizedField(club, "short_name", language), CLUB_PROFILE_MAPS, { fallback: "latin" }),
    tagline: localizeExactValue(language, resolveLocalizedField(club, "tagline", language), CLUB_PROFILE_MAPS, { fallback: "latin" }),
    mission: localizeExactValue(language, resolveLocalizedField(club, "mission", language), CLUB_PROFILE_MAPS, { fallback: "latin" }),
    city: localizePlace(resolveLocalizedField(club, "city", language), language),
    stadium: localizeVenue(resolveLocalizedField(club, "stadium", language), language),
    address: localizeExactValue(language, resolveLocalizedField(club, "address", language), CLUB_PROFILE_MAPS, { fallback: "latin" }),
    hero_badge: localizeExactValue(language, resolveLocalizedField(club, "hero_badge", language), CLUB_PROFILE_MAPS, { fallback: "latin" }),
  };
}

export function localizeSourceName(value, language = "ru") {
  return localizeExactValue(language, value, SOURCE_NAME_MAPS, {
    fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
  });
}

export function localizePlayerName(value, language = "ru") {
  return localizeExactValue(language, value, PLAYER_NAME_MAPS, {
    fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
  });
}

export function localizeCountry(value, language = "ru") {
  return localizeExactValue(language, value, COUNTRY_MAPS, {
    fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
  });
}

export function localizePreviousClub(value, language = "ru") {
  return localizeExactValue(language, value, PREVIOUS_CLUB_MAPS, {
    fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
  });
}

export function localizePlace(value, language = "ru") {
  return localizeExactValue(language, value, PLACE_MAPS, {
    fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
  });
}

export function localizeOpponent(value, language = "ru") {
  return localizeExactValue(language, value, OPPONENT_MAPS, {
    fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
  });
}

export function localizeVenue(value, language = "ru") {
  const normalized = String(value || "").trim().replace(/^«(.+)»$/u, "$1");
  return localizeExactValue(language, normalized, VENUE_MAPS, {
    fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
  });
}

export function localizeCompetition(value, language = "ru") {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const normalizedLanguage = resolveLanguage(language);

  if (normalizedLanguage === "en") {
    return raw
      .replace(/Российская Премьер-Лига/gu, "Russian Premier Liga")
      .replace(/FONBET Кубок России/gu, "FONBET Russian Cup")
      .replace(/Товарищеские матчи/gu, "Friendly matches")
      .replace(/Winline Суперсерия/gu, "Winline Super Series")
      .replace(/Winline Зимний Кубок РПЛ/gu, "Winline Winter Cup RPL")
      .replace(/Групповой этап/gu, "Group stage")
      .replace(/1\/2 финала/gu, "Semi-final")
      .replace(/1\/4 финала/gu, "Quarter-final")
      .replace(/(\d+)-й тур/gu, (_, number) => createMatchweekLabel("en", number));
  }

  return raw
    .replace(/Russian Premier Liga/gu, "Российская Премьер-Лига")
    .replace(/FONBET Russian Cup/gu, "FONBET Кубок России")
    .replace(/Friendly matches/gu, "Товарищеские матчи")
    .replace(/Winline Super Series/gu, "Winline Суперсерия")
    .replace(/Winline Winter Cup RPL/gu, "Winline Зимний Кубок РПЛ")
    .replace(/Group stage/gu, "Групповой этап")
    .replace(/Semi-final/gu, "1/2 финала")
    .replace(/Quarter-final/gu, "1/4 финала")
    .replace(/Matchweek (\d+)/gu, (_, number) => createMatchweekLabel("ru", number));
}

export function localizeStory(story, language = "ru") {
  if (!story) return story;

  const publishedLabel =
    formatDateValue(language, story.published_at, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) ||
    story.published_label ||
    "";

  return {
    ...story,
    title: localizeExactValue(language, resolveLocalizedField(story, "title", language), STORY_TITLE_MAPS, {
      fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
    }),
    excerpt: localizeExactValue(language, resolveLocalizedField(story, "excerpt", language), STORY_EXCERPT_MAPS, {
      fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
    }),
    body: localizeExactValue(language, resolveLocalizedField(story, "body", language), STORY_BODY_MAPS, {
      fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
    }),
    published_label: publishedLabel,
  };
}

export function localizeGalleryItem(item, language = "ru") {
  if (!item) return item;

  return {
    ...item,
    title: localizeExactValue(language, resolveLocalizedField(item, "title", language), STORY_TITLE_MAPS, {
      fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
    }),
    caption: localizeExactValue(language, resolveLocalizedField(item, "caption", language), STORY_EXCERPT_MAPS, {
      fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
    }),
    accent: localizeSourceName(resolveLocalizedField(item, "accent", language), language),
  };
}

export function localizeTrophy(trophy, language = "ru") {
  if (!trophy) return trophy;

  return {
    ...trophy,
    title: localizeExactValue(language, resolveLocalizedField(trophy, "title", language), TROPHY_TITLE_MAPS, {
      fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
    }),
    description: localizeExactValue(language, resolveLocalizedField(trophy, "description", language), TROPHY_DESCRIPTION_MAPS, {
      fallback: resolveLanguage(language) === "en" ? "latin" : "cyrillic",
    }),
  };
}
