from __future__ import annotations

import re


def build_maps(pairs: list[tuple[str, str]]) -> tuple[dict[str, str], dict[str, str]]:
    ru_to_en = dict(pairs)
    en_to_ru = {en: ru for ru, en in pairs}
    return ru_to_en, en_to_ru


def contains_cyrillic(value: str) -> bool:
    return bool(re.search(r"[А-Яа-яЁё]", value or ""))


def contains_latin(value: str) -> bool:
    return bool(re.search(r"[A-Za-z]", value or ""))


CYRILLIC_TO_LATIN = {
    "А": "A",
    "Б": "B",
    "В": "V",
    "Г": "G",
    "Д": "D",
    "Е": "E",
    "Ё": "Yo",
    "Ж": "Zh",
    "З": "Z",
    "И": "I",
    "Й": "Y",
    "К": "K",
    "Л": "L",
    "М": "M",
    "Н": "N",
    "О": "O",
    "П": "P",
    "Р": "R",
    "С": "S",
    "Т": "T",
    "У": "U",
    "Ф": "F",
    "Х": "Kh",
    "Ц": "Ts",
    "Ч": "Ch",
    "Ш": "Sh",
    "Щ": "Shch",
    "Ъ": "",
    "Ы": "Y",
    "Ь": "",
    "Э": "E",
    "Ю": "Yu",
    "Я": "Ya",
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "yo",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "y",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "kh",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ъ": "",
    "ы": "y",
    "ь": "",
    "э": "e",
    "ю": "yu",
    "я": "ya",
}

LATIN_MULTI_TO_CYRILLIC = [
    ("shch", "щ"),
    ("yo", "ё"),
    ("yu", "ю"),
    ("ya", "я"),
    ("zh", "ж"),
    ("kh", "х"),
    ("ts", "ц"),
    ("ch", "ч"),
    ("sh", "ш"),
    ("jo", "джо"),
]

LATIN_TO_CYRILLIC = {
    "a": "а",
    "b": "б",
    "c": "к",
    "d": "д",
    "e": "е",
    "f": "ф",
    "g": "г",
    "h": "х",
    "i": "и",
    "j": "дж",
    "k": "к",
    "l": "л",
    "m": "м",
    "n": "н",
    "o": "о",
    "p": "п",
    "q": "к",
    "r": "р",
    "s": "с",
    "t": "т",
    "u": "у",
    "v": "в",
    "w": "в",
    "x": "кс",
    "y": "й",
    "z": "з",
}


def transliterate_to_latin(value: str) -> str:
    return "".join(CYRILLIC_TO_LATIN.get(char, char) for char in str(value or ""))


def _replace_token(match: re.Match[str], replacement: str) -> str:
    token = match.group(0)
    if token.upper() == token:
        return replacement.upper()
    if token[0].upper() == token[0]:
        return replacement[:1].upper() + replacement[1:]
    return replacement


def transliterate_to_cyrillic(value: str) -> str:
    resolved = str(value or "")
    for source, target in LATIN_MULTI_TO_CYRILLIC:
        resolved = re.sub(source, lambda match: _replace_token(match, target), resolved, flags=re.I)

    def replace_single(match: re.Match[str]) -> str:
        char = match.group(0)
        mapped = LATIN_TO_CYRILLIC.get(char.lower(), char)
        if char.upper() == char:
            return mapped[:1].upper() + mapped[1:]
        return mapped

    return re.sub(r"[A-Za-z]", replace_single, resolved)


def resolve_exact(value: str, language: str, ru_to_en: dict[str, str], en_to_ru: dict[str, str]) -> str:
    raw = str(value or "").strip()
    if not raw:
        return ""
    if language == "en":
        return ru_to_en.get(raw, raw)
    return en_to_ru.get(raw, raw)


def localize_exact(value: str, language: str, pairs: tuple[dict[str, str], dict[str, str]], fallback: str | None = None) -> str:
    raw = str(value or "").strip()
    if not raw:
        return ""

    ru_to_en, en_to_ru = pairs
    resolved = resolve_exact(raw, language, ru_to_en, en_to_ru)
    if resolved != raw:
        return resolved

    if fallback == "latin" and language == "en" and contains_cyrillic(raw):
        return transliterate_to_latin(raw)
    if fallback == "cyrillic" and language == "ru" and contains_latin(raw):
        return transliterate_to_cyrillic(raw)
    return raw


PLAYER_NAME_MAPS = build_maps(
    [
        ("Евгений Латышонок", "Evgeniy Latyshonok"),
        ("Денис Адамов", "Denis Adamov"),
        ("Михаил Кержаков", "Mikhail Kerzhakov"),
        ("Богдан Москвичёв", "Bogdan Moskvichev"),
        ("Дуглас Сантос", "Douglas Santos"),
        ("Юрий Горшков", "Yuri Gorshkov"),
        ("Ваня Дркушич", "Vanja Drkusic"),
        ("Нино", "Nino"),
        ("Вячеслав Караваев", "Vyacheslav Karavaev"),
        ("Арсен Адамов", "Arsen Adamov"),
        ("Нуралы Алип", "Nuraly Alip"),
        ("Игорь Дивеев", "Igor Diveev"),
        ("Вендел", "Wendel"),
        ("Максим Глушенков", "Maksim Glushenkov"),
        ("Вильмар Барриос", "Wilmar Barrios"),
        ("Андрей Мостовой", "Andrey Mostovoy"),
        ("Луис Энрике", "Luiz Henrique"),
        ("Густаво Мантуан", "Gustavo Mantuan"),
        ("Ярослав Михайлов", "Yaroslav Mihailov"),
        ("Педро", "Pedro"),
        ("Жон Жон", "Jhon Jhon"),
        ("Даниил Кондаков", "Daniil Kondakov"),
        ("Вадим Шилов", "Vadim Shilov"),
        ("Александр Соболев", "Aleksandr Sobolev"),
        ("Александр Ерохин", "Aleksander Erokhin"),
        ("Роман Вега", "Roman Vega"),
        ("Джон Дуран", "Jhon Duran"),
    ]
)

COUNTRY_MAPS = build_maps(
    [
        ("Россия", "Russia"),
        ("Бразилия", "Brazil"),
        ("Бразилия / Россия", "Brazil / Russia"),
        ("Колумбия", "Colombia"),
        ("Казахстан", "Kazakhstan"),
        ("Словения", "Slovenia"),
        ("Аргентина", "Argentina"),
    ]
)

PREVIOUS_CLUB_MAPS = build_maps(
    [
        ("Аль-Наср", "Al-Nassr"),
        ("Архентинос Хуниорс", "Argentinos Juniors"),
        ("Балтика Калининград", "Baltika Kaliningrad"),
        ("Бока Хуниорс", "Boca Juniors"),
        ("Ботафого", "Botafogo"),
        ("Коринтианс", "Corinthians"),
        ("Кайрат", "FC Kairat"),
        ("Урал", "Fc Ural"),
        ("Флуминенсе", "Fluminense"),
        ("Гамбург", "Hamburg"),
        ("Химки", "Khimki"),
        ("Крылья Советов", "Krylia Sovetov"),
        ("Локомотив Москва", "Lokomotiv Moscow"),
        ("Ред Булл Брагантино", "Red Bull Bragantino"),
        ("Ростов", "Rostov"),
        ("Витесс", "SBV Vitesse"),
        ("Сочи", "Sochi"),
        ("Спартак Москва", "Spartak Moscow"),
        ("Спортинг Лиссабон", "Sporting Lisbon"),
        ("ЦСКА", "CSKA Moscow"),
    ]
)

PLACE_MAPS = build_maps(
    [
        ("Актау, Казахстан", "Aktau, Kazakhstan"),
        ("Барнаул", "Barnaul"),
        ("Белгород, Россия", "Belgorod, Russia"),
        ("Буэнос-Айрес", "Buenos Aires"),
        ("Картахена-де-Индиас", "Cartagena de Indias"),
        ("Дуке-ди-Кашиас", "Duque de Caxias"),
        ("Гиагинская", "Giaginskaya"),
        ("Жуан-Песоа", "Joao Pessoa"),
        ("Кингисепп", "Kingisepp"),
        ("Кондопога", "Kondopoga"),
        ("Москва", "Moscow"),
        ("Нижний Тагил", "Nizhny Tagil"),
        ("Ново-Место, Словения", "Novo Mesto, Slovenia"),
        ("Омск", "Omsk"),
        ("Петрополис, Рио-де-Жанейро", "Petropolis, Rio de Janeiro"),
        ("Ресифи", "Recife"),
        ("Санту-Андре", "Santo Andre"),
        ("Смоленск", "Smolensk"),
        ("Сан-Паулу", "Sao Paulo"),
        ("Ульяновск", "Ulyanovsk"),
        ("Витория, Бразилия", "Vitoria, Brazil"),
        ("Сарагоса, Колумбия", "Zaragoza, Colombia"),
        ("Уфа", "Ufa"),
        ("Санкт-Петербург", "Saint Petersburg"),
    ]
)

OPPONENT_MAPS = build_maps(
    [
        ("Акрон", "Akron"),
        ("Ахмат", "Akhmat"),
        ("Балтика", "Baltika"),
        ("Воеводина", "Vojvodina"),
        ("Динамо Махачкала", "Dynamo Makhachkala"),
        ("Динамо Москва", "Dynamo Moscow"),
        ("Динамо Самарканд", "Dynamo Samarqand"),
        ("Кайрат", "Kairat"),
        ("Краснодар", "Krasnodar"),
        ("Крылья Советов", "Krylia Sovetov"),
        ("Локомотив Москва", "Lokomotiv Moscow"),
        ("Оренбург", "Orenburg"),
        ("Пари НН", "Pari NN"),
        ("Ростов", "Rostov"),
        ("Рубин", "Rubin"),
        ("Сочи", "Sochi"),
        ("Спартак", "Spartak Moscow"),
        ("Сьон", "Sion"),
        ("ЦСКА", "CSKA Moscow"),
        ("Црвена Звезда", "Crvena Zvezda"),
        ("Шанхай Порт", "Shanghai Port"),
    ]
)

OPPONENT_EN_TO_RU_ALIASES = {
    "Akhmat Grozny": "Ахмат",
    "FC Sochi": "Сочи",
    "FK Vojvodina": "Воеводина",
    "Rubin Kazan": "Рубин",
    "Dinamo Samarqand": "Динамо Самарканд",
    "Dynamo Samarqand": "Динамо Самарканд",
}

OPPONENT_RU_TO_EN_ALIASES = {
    "Ахмат": "Akhmat",
    "Сочи": "Sochi",
    "Воеводина": "Vojvodina",
    "Рубин": "Rubin",
    "Динамо Самарканд": "Dinamo Samarqand",
}

VENUE_MAPS = build_maps(
    [
        ("Ахмат Арена", "Akhmat Arena"),
        ("Стадион Аль-Нахаян", "Al Nahyan Stadium"),
        ("Стадион Аспайр", "Aspire Stadium"),
        ("Олимпийский стадион Фишт", "Fisht Olympic Stadium"),
        ("Стадион Газовик", "Gazovik Stadium"),
        ("Лукойл Арена", "Lukoil Arena"),
        ("Стадион Нижний Новгород", "Nizhny Novgorod Stadium"),
        ("Озон Арена", "Ozon Arena"),
        ("Стадион Смена", "Smena Stadium"),
        ("Солидарность Самара Арена", "Solidarnost Samara Arena"),
        ("Стадион Фишт", "Stadion Fisht"),
        ("Газпром Арена", "Gazprom Arena"),
        ("Ак Барс Арена", "Ak Bars Arena"),
        ("ВТБ Арена", "VTB Arena"),
        ("Лужники", "Luzhniki"),
        ("Ростех Арена", "Rostec Arena"),
        ("Стадион Jebel Ali", "Jebel Ali Stadium"),
    ]
)

STORY_TITLE_MAPS = build_maps(
    [
        ("Педро: «Было очень важно одержать победу в таком принципиальном противостоянии»", "Pedro: “It was very important to win such an important game today”"),
        ("Александр Соболев: «Конечно, я хотел забить»", "Alexander Sobolev: “Of course, I wanted to score. ”"),
        ("Сергей Семак: «Мы, безусловно, довольны результатом»", 'Sergei Semak: "We are certainly happy with the result"'),
        ("Соболев и Педро выйдут с первых минут против «Спартака»", "Sobolev and Pedro to start against Spartak Moscow"),
        ("Сегодня «Зенит» сыграет со «Спартаком» на «Газпром Арене»", "We play Spartak today at the Gazprom Arena"),
        ("Фильм «Зенит навсегда»: в Петербурге прошла премьера новой картины клуба", "Zenit Forever the movie: The premier of the club’s new film took place in St. Petersburg"),
    ]
)

STORY_EXCERPT_MAPS = build_maps(
    [
        ("Лучший игрок матча рассказал нам о победе над «Спартаком» со счётом 2:0.", "Today’s Man of the Match spoke to us after the 2-0 win over Spartak Moscow."),
        ("Нападающий «Зенита» рассказал о голе, праздновании и победе над «Спартаком».", "The Zenit striker spoke to us about scoring, his goal celebration, and the win over Spartak."),
        ("Послематчевая пресс-конференция главного тренера «Зенита» после победы над «Спартаком».", "The Zenit manager’s post match press conference after the win over Spartak Moscow."),
        ("Сергей Семак назвал стартовый состав на матч на «Газпром Арене».", "Sergei Semak has named his starting XI for the match at the Gazprom Arena."),
        ("21-й матч этого сезона РПЛ начнётся в 16:00 по петербургскому времени.", "Our 21st game of this RPL season kicks off at 4pm St. Petersburg time."),
        ("Фильм посвящён столетию клуба и рассказывает об уникальной 100-летней истории команды: от заводского коллектива 1925 года до одного из главных клубов России сегодня.", "The film celebrates our centenary and covers the unique 100 year history of the club, from our founding as a factory team in 1925, to becoming Russia’s biggest club today."),
    ]
)

STORY_BODY_MAPS = build_maps(
    [
        ("Официальный материал «Зенита». Полную публикацию смотрите в источнике.", "Official Zenit story. Read the full piece at the source."),
    ]
)

TROPHY_TITLE_MAPS = build_maps(
    [
        ("Кубок УЕФА", "UEFA Cup"),
        ("Российская Премьер-Лига", "Russian Premier Liga"),
        ("Суперкубок России", "Russian Super Cup"),
        ("Суперкубок УЕФА", "UEFA Super Cup"),
    ]
)

TROPHY_DESCRIPTION_MAPS = build_maps(
    [
        ("Европейский трофей клуба на международной арене.", "The club's European trophy on the international stage."),
        ("Чемпион России по итогам сезона.", "Champions of Russia at the end of the season."),
        ("Победа в матче за Суперкубок России.", "Victory in the Russian Super Cup match."),
        ("Победа над обладателем Лиги чемпионов в матче за Суперкубок УЕФА.", "Victory over the reigning Champions League winners in the UEFA Super Cup match."),
    ]
)


def create_matchweek_label(language: str, number: str | int) -> str:
    value = int(number)
    return f"Matchweek {value}" if language == "en" else f"{value}-й тур"


def localize_competition(value: str, language: str) -> str:
    raw = str(value or "").strip()
    if not raw:
        return ""

    if language == "en":
        resolved = (
            raw.replace("Российская Премьер-Лига", "Russian Premier Liga")
            .replace("FONBET Кубок России", "FONBET Russian Cup")
            .replace("Кубок России", "Russian Cup")
            .replace("Товарищеские матчи", "Friendly matches")
            .replace("Winline Суперсерия", "Winline Super Series")
            .replace("Winline Зимний Кубок РПЛ", "Winline Winter Cup RPL")
            .replace("Групповой этап", "Group stage")
            .replace("1/2 финала", "Semi-final")
            .replace("1/4 финала", "Quarter-final")
        )
        resolved = re.sub(r",\s*(\d+)\s+round", lambda match: f", Matchweek {match.group(1)}", resolved, flags=re.I)
        return re.sub(r"(\d+)-й тур", lambda match: create_matchweek_label("en", match.group(1)), resolved)

    resolved = (
        raw.replace("Russian Premier Liga", "Российская Премьер-Лига")
        .replace("FONBET Russian Cup", "FONBET Кубок России")
        .replace("Russian Cup", "Кубок России")
        .replace("Friendly matches", "Товарищеские матчи")
        .replace("Friendly Matches", "Товарищеские матчи")
        .replace("Russian Super Cup", "Суперкубок России")
        .replace("Winline Super Series", "Winline Суперсерия")
        .replace("Winline Winter Cup RPL", "Winline Зимний Кубок РПЛ")
        .replace("Group stage", "Групповой этап")
        .replace("Semi-final", "1/2 финала")
        .replace("Quarter-final", "1/4 финала")
    )
    resolved = re.sub(r",\s*(\d+)\s+round", r", \1-й тур", resolved, flags=re.I)
    return re.sub(r"Matchweek (\d+)", lambda match: create_matchweek_label("ru", match.group(1)), resolved, flags=re.I)
def localize_player_name(value: str, language: str) -> str:
    return localize_exact(value, language, PLAYER_NAME_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_country(value: str, language: str) -> str:
    return localize_exact(value, language, COUNTRY_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_previous_club(value: str, language: str) -> str:
    return localize_exact(value, language, PREVIOUS_CLUB_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_place(value: str, language: str) -> str:
    return localize_exact(value, language, PLACE_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_opponent(value: str, language: str) -> str:
    raw = str(value or "").strip()
    if not raw:
        return ""
    if language == "en" and raw in OPPONENT_RU_TO_EN_ALIASES:
        return OPPONENT_RU_TO_EN_ALIASES[raw]
    if language == "ru" and raw in OPPONENT_EN_TO_RU_ALIASES:
        return OPPONENT_EN_TO_RU_ALIASES[raw]
    return localize_exact(raw, language, OPPONENT_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_venue(value: str, language: str) -> str:
    normalized = str(value or "").strip().replace("«", "").replace("»", "")
    return localize_exact(normalized, language, VENUE_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_story_title(value: str, language: str) -> str:
    return localize_exact(value, language, STORY_TITLE_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_story_excerpt(value: str, language: str) -> str:
    return localize_exact(value, language, STORY_EXCERPT_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_story_body(value: str, language: str) -> str:
    return localize_exact(value, language, STORY_BODY_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_trophy_title(value: str, language: str) -> str:
    return localize_exact(value, language, TROPHY_TITLE_MAPS, fallback="latin" if language == "en" else "cyrillic")


def localize_trophy_description(value: str, language: str) -> str:
    return localize_exact(value, language, TROPHY_DESCRIPTION_MAPS, fallback="latin" if language == "en" else "cyrillic")
