import { createContext, startTransition, useContext, useEffect, useState } from "react";

export const DEFAULT_LANGUAGE = "ru";
export const SUPPORTED_LANGUAGES = ["ru", "en"];
export const LANGUAGE_STORAGE_KEY = "gazprom-public-language";

const MESSAGES = {
  ru: {
    "nav.home": "Главная",
    "nav.team": "Команда",
    "nav.matches": "Матчи",
    "nav.media": "Медиа",
    "nav.contacts": "Контакты",

    "brand.company": "ПАО «Газпром»",
    "brand.defaultClubName": "Газпром Футбол",
    "brand.defaultShortName": "Газпром",
    "brand.defaultBadge": "Газпром футбольная программа",
    "brand.defaultStadium": "Газпром Арена",
    "brand.defaultCity": "Санкт-Петербург",
    "brand.defaultMission": "Официальная витрина клуба.",

    "language.toggleToEn": "Переключить язык на английский",
    "language.toggleToRu": "Переключить язык на русский",
    "language.ruShort": "RU",
    "language.enShort": "EN",
    "header.openMenu": "Открыть меню",
    "header.closeMenu": "Закрыть меню",

    "common.na": "—",
    "common.players": "Игроки",
    "common.player": "Игрок",
    "common.club": "Клуб",
    "common.opponent": "Соперник",
    "common.date": "Дата",
    "common.time": "Время",
    "common.arena": "Арена",
    "common.stadium": "Стадион",
    "common.location": "Локация",
    "common.tournament": "Турнир",
    "common.matches": "Матчи",
    "common.minutes": "Минуты",
    "common.goals": "Голы",
    "common.height": "Рост",
    "common.birthDate": "Дата рождения",
    "common.birthPlace": "Место рождения",
    "common.citizenship": "Гражданство",
    "common.previousClub": "Предыдущий клуб",
    "common.position": "Позиция",
    "common.measurements": "Антропометрия",
    "common.officialWebsite": "Официальный сайт",
    "common.openOnMap": "Открыть на карте",
    "common.open": "Открыть",
    "common.openSource": "Открыть источник",
    "common.openSection": "Открыть раздел",
    "common.openMaterial": "Открыть материал",
    "common.goTo": "Перейти",
    "common.matchCenter": "Матч-центр",
    "common.calendar": "Календарь",
    "common.allMaterials": "Все материалы",
    "common.reloadPage": "Обновить страницу",
    "common.back": "Назад",
    "common.toHome": "На главную",
    "common.linkLater": "Ссылка появится позже",
    "common.linkLaterShort": "Ссылка позже",
    "common.protocol": "Протокол",
    "common.matchProtocol": "Протокол матча",
    "common.gallery": "Галерея",
    "common.news": "Новости",
    "common.media": "Медиа",
    "common.channels": "Каналы",
    "common.email": "Эл. почта",
    "common.phone": "Телефон",
    "common.address": "Адрес",
    "common.headquarters": "Штаб-квартира",
    "common.officialResource": "Официальный ресурс",
    "common.shop": "Магазин",
    "common.hospitality": "Премиум",
    "common.photoStories": "Фотоисторий",
    "common.publications": "Публикаций",
    "common.mainFeature": "Главный материал",
    "common.latestResult": "Последний результат",
    "common.playerOfWeek": "Игрок недели",
    "common.homeArena": "Домашняя арена",
    "common.quickStatus": "Быстрый статус",
    "common.clubLocation": "Клубная локация",
    "common.noActiveSelection": "Нет активного выбора",
    "common.years": "лет",
    "common.defaultLoading": "Загрузка",
    "common.notSpecified": "Не указано",
    "common.readMore": "Подробнее",
    "common.selectValue": "Выберите значение",
    "common.versus": "против",
    "common.heightValue": "{value} см",
    "common.weightValue": "{value} кг",

    "layout.routeErrorTitle": "Не удалось открыть раздел «{label}»",
    "layout.routeErrorMessage": "Клиентская навигация не смогла получить данные страницы.",

    "loading.title": "Загрузка",
    "loading.openPage": "Открываем страницу",
    "loading.openSection": "Открываем раздел «{label}»",
    "loading.openPlayer": "Открываем страницу {name}",
    "loading.playerFallback": "игрока",

    "error.notFound.badge": "Страница не найдена",
    "error.notFound.title": "Не удалось найти страницу",
    "error.notFound.message": "Возможно, ссылка устарела или адрес был введён неправильно.",
    "error.notFound.hint": "Проверьте адрес страницы или вернитесь на главную.",
    "error.network.badge": "Проблема с загрузкой",
    "error.network.title": "Не удалось открыть раздел",
    "error.network.message": "Мы не смогли загрузить данные страницы. Обычно это временная проблема с интернетом или соединением с сервером.",
    "error.network.hint": "Попробуйте обновить страницу или зайти ещё раз чуть позже.",
    "error.forbidden.badge": "Доступ ограничен",
    "error.forbidden.title": "Этот раздел недоступен",
    "error.forbidden.message": "Похоже, у вашей учётной записи нет доступа к этой странице.",
    "error.forbidden.hint": "Вернитесь назад или откройте другой раздел.",
    "error.server.badge": "Временная ошибка",
    "error.server.title": "Страница временно недоступна",
    "error.server.message": "На сервере произошёл сбой. Обычно такая ошибка проходит через некоторое время.",
    "error.server.hint": "Обновите страницу и попробуйте снова через пару минут.",
    "error.generic.badge": "Что-то пошло не так",
    "error.generic.title": "Не удалось открыть страницу",
    "error.generic.message": "Во время загрузки произошла ошибка. Попробуйте повторить действие ещё раз.",
    "error.generic.hint": "Обновите страницу или вернитесь назад.",

    "countdown.details": "Детали матча",
    "countdown.started": "Матч начался",
    "countdown.dayShort": "д",
    "countdown.hourShort": "ч",
    "countdown.minuteShort": "м",

    "match.withoutDate": "Без даты",
    "match.datePending": "Дата уточняется",
    "match.clubMatch": "Матч клуба",
    "match.arenaTba": "Арена уточняется",
    "match.locationTba": "Локация уточняется",
    "match.allTournaments": "Все турниры",
    "match.allMonths": "Все месяцы",
    "match.status.live": "Идёт матч",
    "match.status.win": "Победа",
    "match.status.loss": "Поражение",
    "match.status.draw": "Ничья",
    "match.status.soon": "Скоро",
    "match.status.finished": "Завершён",
    "match.status.default": "Матч",
    "match.count.one": "матч",
    "match.count.few": "матча",
    "match.count.many": "матчей",
    "match.team.club": "Клуб",
    "match.team.opponent": "Соперник",
    "match.featured": "Главный матч",

    "positions.GK": "Вратарь",
    "positions.DF": "Защитник",
    "positions.MF": "Полузащитник",
    "positions.FW": "Нападающий",
    "positions.GK.plural": "Вратари",
    "positions.DF.plural": "Защитники",
    "positions.MF.plural": "Полузащитники",
    "positions.FW.plural": "Нападающие",
    "positions.default": "Игрок",
    "positions.defaultPlural": "Игроки",

    "team.firstTeam": "Первая команда",
    "team.squadTitle": "Состав команды",
    "team.squadDescription": "Игроки первой команды «Зенита» — состав клуба по игровым линиям.",
    "team.metric.players": "Игроков",
    "team.metric.lines": "Линий состава",
    "team.metric.averageAge": "Средний возраст",
    "team.playerCountSuffix.one": "игрок",
    "team.playerCountSuffix.few": "игрока",
    "team.playerCountSuffix.many": "игроков",
    "team.captain": "Капитан",
    "team.captainUnset": "Капитан пока не указан",
    "team.firstTeamPlayer": "Игрок первой команды",
    "team.firstTeamPlayerLong": "Игрок первой команды клуба.",
    "team.profileEyebrow": "Профиль",
    "team.profileTitle": "Игровые и биографические данные",
    "team.traitsEyebrow": "Игровой профиль",
    "team.traitsTitle": "Ключевые качества",
    "team.biographyEyebrow": "Биография",
    "team.biographyTitle": "О игроке",
    "team.sameLineEyebrow": "Эта же линия",
    "team.morePosition": "Ещё {position}",
    "team.playerNotFound": "Игрок не найден",

    "player.trait.reaction": "Реакция",
    "player.trait.positioning": "Позиция",
    "player.trait.handling": "Игра руками",
    "player.trait.footwork": "Игра ногами",
    "player.trait.composure": "Хладнокровие",
    "player.trait.speed": "Скорость",
    "player.trait.stamina": "Выносливость",
    "player.trait.tackling": "Отбор",
    "player.trait.power": "Мощь",
    "player.trait.discipline": "Дисциплина",
    "player.trait.technique": "Техника",
    "player.trait.creativity": "Креативность",
    "player.trait.iq": "Игровой интеллект",
    "player.trait.shot": "Удар",
    "player.trait.sharpness": "Резкость",

    "player.bio.birthUnknown": "Дата рождения не указана",
    "player.heroSubtitle.withBirthPlace": "Родился в {place}",
    "player.bio.represents": " Представляет {value}.",
    "player.bio.previousClub": " До перехода в клуб выступал за {value}.",
    "player.bio.shirtNumber": " Играет под номером #{value}.",
    "player.bio.captain": " Является одним из лидеров команды и носит капитанскую повязку.",
    "player.bio.role.default": " Игрок первой команды и важная часть текущей обоймы клуба.",
    "player.bio.role.GK": " Вратарь, который отвечает за надёжность последнего рубежа, игру на выходах и контроль штрафной.",
    "player.bio.role.DF": " Защитник, который даёт команде баланс в обороне, работу в единоборствах и надёжность без мяча.",
    "player.bio.role.MF": " Полузащитник, который помогает команде в темпе игры, продвижении мяча и связке между линиями.",
    "player.bio.role.FW": " Нападающий, который отвечает за остроту впереди, рывки за спину и завершение эпизодов.",
    "player.bio.summary": "{name} — {position} первой команды. {birthInfo}{birthPlace}.{nationality}{previousClub}{shirtNumber}",

    "home.nextMatch": "Следующий матч",
    "home.stats.wins": "Побед",
    "home.stats.goals": "Голы",
    "home.stats.cleanSheets": "Сухих матчей",
    "home.stats.winsHint": "За основной цикл сезона",
    "home.stats.goalsHint": "Во всех турнирах",
    "home.stats.cleanSheetsHint": "Надёжность обороны",
    "home.leadStoryFallback": "Главная история недели",
    "home.secondStoryFallback": "Вторая история",
    "home.newsDefault": "Новость клуба",
    "home.playerOfWeekFallback": "Один из ключевых игроков первой команды в текущем игровом цикле.",
    "home.trophiesEyebrow": "Трофеи",
    "home.trophiesTitle": "Главные достижения клуба",
    "home.galleryFallback": "Галерея",
    "home.matchdayEyebrow": "Матчдэй",
    "home.matchdayTitle": "Матчдэй на «Газпром Арене»",
    "home.matchdayDescription": "Билеты, премиум-сервис, результат недели и ближайшие матчи — в одном собранном блоке.",
    "home.upcomingMatches": "Ближайшие матчи",
    "home.arenaEyebrow": "Арена",
    "home.arenaTitle": "Арена и матчдэй",
    "home.arenaDescription": "Сначала большая сцена стадиона, потом аккуратный информационный ряд под ней.",
    "home.homeArenaEyebrow": "Домашняя арена",
    "home.homeArenaFallbackText": "{city} · домашние матчи, клубная программа и центральная сцена сезона.",
    "home.nextSlotEyebrow": "Ближайший слот",
    "home.nextSlotFallbackTitle": "Ближайший игровой слот",
    "home.nextSlotFallbackText": "Клуб держит в центре внимания ближайший домашний матч.",
    "home.squadEyebrow": "Состав",
    "home.squadTitle": "Ключевые игроки сезона",
    "home.squadDescription": "Ровная и чистая сетка без лишнего шума — здесь лучше работает простая подача.",
    "home.mediaEyebrow": "Медиа",
    "home.mediaTitle": "Новости и фотоистории недели",
    "home.mediaDescription": "Одна главная история, вторая публикация рядом и отдельная лента галереи ниже.",
    "home.mediaFocusEyebrow": "Медиа-фокус",
    "home.mediaFocusTitle": "Клубная повестка недели",
    "home.mediaFocusDescription": "Интервью, заметки и публикации вокруг ближайшего матча.",
    "home.mediaSectionEyebrow": "Медиа-раздел",
    "home.mediaSectionTitle": "Все публикации клуба",
    "home.galleryEyebrow": "Галерея",
    "home.galleryTitle": "Матчдэй и клубные кадры",
    "home.ecosystemEyebrow": "Клубная экосистема",
    "home.ecosystemTitle": "Состав, календарь, арена и медиа — в одной витрине сезона",
    "home.ecosystemDescription": "Финальный блок лучше держать компактным: короткий месседж и два ясных действия.",
    "home.matchesButton": "Календарь матчей",
    "home.teamButton": "Состав команды",

    "matches.feed.all": "Все матчи",
    "matches.feed.upcoming": "Ближайшие",
    "matches.feed.finished": "Результаты",
    "matches.feed.live": "В эфире",
    "matches.defaultClubName": "ФК Зенит",
    "matches.heroBadge": "Матч-центр",
    "matches.heroTitle": "Календарь сезона и результаты команды",
    "matches.heroDescription": "Ближайшие матчи, сыгранные встречи, арена, время и официальный протокол — в одной аккуратной сезонной ленте.",
    "matches.stat.total": "Матчей в сезоне",
    "matches.stat.upcoming": "Ближайшие игры",
    "matches.stat.finished": "Сыгранные матчи",
    "matches.subscribeCalendar": "Подписаться на календарь",
    "matches.sectionEyebrow": "Календарь сезона",
    "matches.sectionTitle": "Полный календарь сезона: от афиши до финального счёта",
    "matches.filter.type": "Тип матчей",
    "matches.filter.tournament": "Турнир",
    "matches.filter.month": "Месяц",
    "matches.filter.placeholderType": "Выберите тип",
    "matches.filter.placeholderTournament": "Выберите турнир",
    "matches.filter.placeholderMonth": "Выберите месяц",
    "matches.filter.inFeed": "В ленте: {count}",
    "matches.empty": "По текущим фильтрам матчей не найдено.",

    "media.badge": "Медиа клуба",
    "media.heroTitle": "Медиа и истории сезона",
    "media.heroDescription": "Главные публикации, клубные новости и визуальные истории.",
    "media.leadStory": "Главный материал",
    "media.sideMaterial": "Материал клуба",
    "media.story": "Публикация",
    "media.storyDefault": "Материал",
    "media.storyLeadDefault": "Главный материал клуба",
    "media.storyLeadExcerpt": "Официальный материал клуба.",
    "media.storyLeadLabel": "Главная публикация",
    "media.newsChipDefault": "Публикация клуба",
    "media.newsFallbackTitle": "Материал клуба",
    "media.newsFallbackExcerpt": "Официальная публикация клуба.",
    "media.newsFallbackLabel": "Новости",
    "media.galleryFallbackTitle": "Фотоистория клуба",
    "media.galleryFallbackLabel": "Галерея",
    "media.emptyLeadEyebrow": "Главная публикация",
    "media.emptyLeadTitle": "Свежий материал скоро появится",
    "media.emptyLeadDescription": "Мы обновляем медийную витрину клуба. Загляни чуть позже — здесь появится главная история дня.",
    "media.emptyStreamEyebrow": "Лента клуба",
    "media.emptyStreamTitle": "Новые публикации готовятся",
    "media.emptyStreamDescription": "Скоро здесь появится ещё один материал редакционной витрины команды.",
    "media.emptyUpdateEyebrow": "Медиа",
    "media.emptyUpdateTitle": "Обновление совсем скоро",
    "media.emptyUpdateDescription": "Ещё один сюжет появится после следующего обновления раздела.",
    "media.newsEyebrow": "Новости",
    "media.newsTitle": "Редакционная лента клуба",
    "media.newsEmptyEyebrow": "Новости клуба",
    "media.newsEmptyTitle": "Сейчас лента обновляется",
    "media.newsEmptyDescription": "Новые публикации появятся здесь немного позже. Как только материалы будут готовы, раздел наполнится свежими новостями команды.",
    "media.galleryEyebrow": "Галерея",
    "media.galleryTitle": "Фотоистории",
    "media.galleryEmptyEyebrow": "Фотогалерея",
    "media.galleryEmptyTitle": "Новые кадры скоро появятся",
    "media.galleryEmptyDescription": "Мы готовим свежую подборку фотографий команды. После обновления здесь появятся лучшие моменты матчдэй и атмосфера клуба.",

    "contacts.heroBadge": "Контакты клуба",
    "contacts.heroTitle": "Официальный контактный контур клуба и арены",
    "contacts.hqEyebrow": "Штаб-квартира",
    "contacts.defaultClubName": "Футбольный клуб",
    "contacts.channelsEyebrow": "Каналы",
    "contacts.channelsTitle": "Официальные каналы клуба",
    "contacts.channelsEmpty": "Каналы пока не заполнены.",

    "footer.arena": "Арена",
    "footer.communications": "Коммуникации",
    "footer.location": "Локация",

    "stadium.matchday": "Матчдэй",
    "stadium.homeArena": "Домашняя арена клуба",
    "stadium.homeMatch": "Домашний матч",
  },
  en: {
    "nav.home": "Home",
    "nav.team": "Team",
    "nav.matches": "Matches",
    "nav.media": "Media",
    "nav.contacts": "Contacts",

    "brand.company": "PJSC Gazprom",
    "brand.defaultClubName": "Gazprom Football",
    "brand.defaultShortName": "Gazprom",
    "brand.defaultBadge": "Gazprom football program",
    "brand.defaultStadium": "Gazprom Arena",
    "brand.defaultCity": "Saint Petersburg",
    "brand.defaultMission": "Official club showcase.",

    "language.toggleToEn": "Switch language to English",
    "language.toggleToRu": "Switch language to Russian",
    "language.ruShort": "RU",
    "language.enShort": "EN",
    "header.openMenu": "Open menu",
    "header.closeMenu": "Close menu",

    "common.na": "—",
    "common.players": "Players",
    "common.player": "Player",
    "common.club": "Club",
    "common.opponent": "Opponent",
    "common.date": "Date",
    "common.time": "Time",
    "common.arena": "Arena",
    "common.stadium": "Stadium",
    "common.location": "Location",
    "common.tournament": "Competition",
    "common.matches": "Matches",
    "common.minutes": "Minutes",
    "common.goals": "Goals",
    "common.height": "Height",
    "common.birthDate": "Date of birth",
    "common.birthPlace": "Place of birth",
    "common.citizenship": "Citizenship",
    "common.previousClub": "Previous club",
    "common.position": "Position",
    "common.measurements": "Measurements",
    "common.officialWebsite": "Official website",
    "common.openOnMap": "Open on map",
    "common.open": "Open",
    "common.openSource": "Open source",
    "common.openSection": "Open section",
    "common.openMaterial": "Open story",
    "common.goTo": "Go",
    "common.matchCenter": "Match hub",
    "common.calendar": "Calendar",
    "common.allMaterials": "All stories",
    "common.reloadPage": "Reload page",
    "common.back": "Back",
    "common.toHome": "Home",
    "common.linkLater": "Link will appear later",
    "common.linkLaterShort": "Link later",
    "common.protocol": "Protocol",
    "common.matchProtocol": "Match protocol",
    "common.gallery": "Gallery",
    "common.news": "News",
    "common.media": "Media",
    "common.channels": "Channels",
    "common.email": "Email",
    "common.phone": "Phone",
    "common.address": "Address",
    "common.headquarters": "Headquarters",
    "common.officialResource": "Official resource",
    "common.shop": "Shop",
    "common.hospitality": "Hospitality",
    "common.photoStories": "Photo stories",
    "common.publications": "Stories",
    "common.mainFeature": "Lead story",
    "common.latestResult": "Latest result",
    "common.playerOfWeek": "Player of the week",
    "common.homeArena": "Home arena",
    "common.quickStatus": "Quick status",
    "common.clubLocation": "Club location",
    "common.noActiveSelection": "No active selection",
    "common.years": "years",
    "common.defaultLoading": "Loading",
    "common.notSpecified": "Not specified",
    "common.readMore": "Read more",
    "common.selectValue": "Choose value",
    "common.versus": "vs",
    "common.heightValue": "{value} cm",
    "common.weightValue": "{value} kg",

    "layout.routeErrorTitle": "Could not open the “{label}” section",
    "layout.routeErrorMessage": "Client navigation could not load the page data.",

    "loading.title": "Loading",
    "loading.openPage": "Opening page",
    "loading.openSection": "Opening “{label}”",
    "loading.openPlayer": "Opening {name}",
    "loading.playerFallback": "player",

    "error.notFound.badge": "Page not found",
    "error.notFound.title": "We couldn't find this page",
    "error.notFound.message": "The link may be outdated or the address may have been entered incorrectly.",
    "error.notFound.hint": "Check the page address or return to the homepage.",
    "error.network.badge": "Loading problem",
    "error.network.title": "Could not open the section",
    "error.network.message": "We couldn't load the page data. This is usually a temporary issue with the internet connection or the server.",
    "error.network.hint": "Try refreshing the page or come back a little later.",
    "error.forbidden.badge": "Access restricted",
    "error.forbidden.title": "This section is unavailable",
    "error.forbidden.message": "It looks like your account does not have access to this page.",
    "error.forbidden.hint": "Go back or open another section.",
    "error.server.badge": "Temporary issue",
    "error.server.title": "This page is temporarily unavailable",
    "error.server.message": "The server encountered an error. These issues usually clear up after a while.",
    "error.server.hint": "Refresh the page and try again in a couple of minutes.",
    "error.generic.badge": "Something went wrong",
    "error.generic.title": "Could not open the page",
    "error.generic.message": "An error occurred while loading the page. Please try again.",
    "error.generic.hint": "Refresh the page or go back.",

    "countdown.details": "Match details",
    "countdown.started": "Match started",
    "countdown.dayShort": "d",
    "countdown.hourShort": "h",
    "countdown.minuteShort": "m",

    "match.withoutDate": "No date",
    "match.datePending": "Date to be confirmed",
    "match.clubMatch": "Club match",
    "match.arenaTba": "Arena TBC",
    "match.locationTba": "Location TBC",
    "match.allTournaments": "All competitions",
    "match.allMonths": "All months",
    "match.status.live": "Live",
    "match.status.win": "Win",
    "match.status.loss": "Loss",
    "match.status.draw": "Draw",
    "match.status.soon": "Soon",
    "match.status.finished": "Finished",
    "match.status.default": "Match",
    "match.count.one": "match",
    "match.count.few": "matches",
    "match.count.many": "matches",
    "match.team.club": "Club",
    "match.team.opponent": "Opponent",
    "match.featured": "Featured match",

    "positions.GK": "Goalkeeper",
    "positions.DF": "Defender",
    "positions.MF": "Midfielder",
    "positions.FW": "Forward",
    "positions.GK.plural": "Goalkeepers",
    "positions.DF.plural": "Defenders",
    "positions.MF.plural": "Midfielders",
    "positions.FW.plural": "Forwards",
    "positions.default": "Player",
    "positions.defaultPlural": "Players",

    "team.firstTeam": "First team",
    "team.squadTitle": "Team squad",
    "team.squadDescription": "The Zenit first-team roster grouped by playing lines.",
    "team.metric.players": "Players",
    "team.metric.lines": "Squad lines",
    "team.metric.averageAge": "Average age",
    "team.playerCountSuffix.one": "player",
    "team.playerCountSuffix.few": "players",
    "team.playerCountSuffix.many": "players",
    "team.captain": "Captain",
    "team.captainUnset": "Captain has not been specified yet",
    "team.firstTeamPlayer": "First-team player",
    "team.firstTeamPlayerLong": "First-team player.",
    "team.profileEyebrow": "Profile",
    "team.profileTitle": "Playing and biographical data",
    "team.traitsEyebrow": "Playing profile",
    "team.traitsTitle": "Key qualities",
    "team.biographyEyebrow": "Biography",
    "team.biographyTitle": "About the player",
    "team.sameLineEyebrow": "Same line",
    "team.morePosition": "More {position}",
    "team.playerNotFound": "Player not found",

    "player.trait.reaction": "Reaction",
    "player.trait.positioning": "Positioning",
    "player.trait.handling": "Handling",
    "player.trait.footwork": "Footwork",
    "player.trait.composure": "Composure",
    "player.trait.speed": "Speed",
    "player.trait.stamina": "Stamina",
    "player.trait.tackling": "Tackling",
    "player.trait.power": "Power",
    "player.trait.discipline": "Discipline",
    "player.trait.technique": "Technique",
    "player.trait.creativity": "Creativity",
    "player.trait.iq": "Game IQ",
    "player.trait.shot": "Shot",
    "player.trait.sharpness": "Sharpness",

    "player.bio.birthUnknown": "Date of birth not specified",
    "player.heroSubtitle.withBirthPlace": "Born in {place}",
    "player.bio.represents": " Represents {value}.",
    "player.bio.previousClub": " Before joining the club, he played for {value}.",
    "player.bio.shirtNumber": " Wears #{value}.",
    "player.bio.captain": " He is one of the leaders of the team and wears the captain's armband.",
    "player.bio.role.default": " First-team player and an important part of the current squad.",
    "player.bio.role.GK": " Goalkeeper responsible for the last line, commanding the box and handling crosses.",
    "player.bio.role.DF": " Defender who gives the team balance without the ball, works in duels and keeps the back line stable.",
    "player.bio.role.MF": " Midfielder who helps the team control tempo, progress the ball and connect the lines.",
    "player.bio.role.FW": " Forward responsible for attacking threat, runs in behind and finishing moves.",
    "player.bio.summary": "{name} is a first-team {position}. {birthInfo}{birthPlace}.{nationality}{previousClub}{shirtNumber}",

    "home.nextMatch": "Next match",
    "home.stats.wins": "Wins",
    "home.stats.goals": "Goals",
    "home.stats.cleanSheets": "Clean sheets",
    "home.stats.winsHint": "Across the main part of the season",
    "home.stats.goalsHint": "Across all competitions",
    "home.stats.cleanSheetsHint": "Defensive reliability",
    "home.leadStoryFallback": "Lead story of the week",
    "home.secondStoryFallback": "Second story",
    "home.newsDefault": "Club story",
    "home.playerOfWeekFallback": "One of the key first-team players in the current stretch of the season.",
    "home.trophiesEyebrow": "Trophies",
    "home.trophiesTitle": "Main club achievements",
    "home.galleryFallback": "Gallery",
    "home.matchdayEyebrow": "Matchday",
    "home.matchdayTitle": "Matchday at Gazprom Arena",
    "home.matchdayDescription": "Tickets, hospitality, the latest result and the next fixtures in one concise block.",
    "home.upcomingMatches": "Upcoming matches",
    "home.arenaEyebrow": "Arena",
    "home.arenaTitle": "Arena and matchday",
    "home.arenaDescription": "A large stadium scene first, then a clean information rail underneath it.",
    "home.homeArenaEyebrow": "Home arena",
    "home.homeArenaFallbackText": "{city} • home matches, club program and the central stage of the season.",
    "home.nextSlotEyebrow": "Next slot",
    "home.nextSlotFallbackTitle": "Next match slot",
    "home.nextSlotFallbackText": "The club keeps the next home match in focus.",
    "home.squadEyebrow": "Squad",
    "home.squadTitle": "Key players of the season",
    "home.squadDescription": "A calm, clean grid works better here than extra noise.",
    "home.mediaEyebrow": "Media",
    "home.mediaTitle": "News and photo stories of the week",
    "home.mediaDescription": "One lead story, a second publication nearby and a gallery rail below.",
    "home.mediaFocusEyebrow": "Media focus",
    "home.mediaFocusTitle": "Club agenda of the week",
    "home.mediaFocusDescription": "Interviews, notes and stories around the upcoming match.",
    "home.mediaSectionEyebrow": "Media section",
    "home.mediaSectionTitle": "All club stories",
    "home.galleryEyebrow": "Gallery",
    "home.galleryTitle": "Matchday and club visuals",
    "home.ecosystemEyebrow": "Club ecosystem",
    "home.ecosystemTitle": "Squad, calendar, arena and media in one season showcase",
    "home.ecosystemDescription": "The final block works best when it stays compact: one short message and two clear actions.",
    "home.matchesButton": "Match calendar",
    "home.teamButton": "Team squad",

    "matches.feed.all": "All matches",
    "matches.feed.upcoming": "Upcoming",
    "matches.feed.finished": "Results",
    "matches.feed.live": "Live",
    "matches.defaultClubName": "Zenit FC",
    "matches.heroBadge": "Match hub",
    "matches.heroTitle": "Season calendar and team results",
    "matches.heroDescription": "Upcoming fixtures, completed matches, venue, kickoff time and the official report in one tidy season feed.",
    "matches.stat.total": "Matches in season",
    "matches.stat.upcoming": "Upcoming games",
    "matches.stat.finished": "Played matches",
    "matches.subscribeCalendar": "Subscribe to calendar",
    "matches.sectionEyebrow": "Season calendar",
    "matches.sectionTitle": "The full season feed: from poster to final score",
    "matches.filter.type": "Match type",
    "matches.filter.tournament": "Competition",
    "matches.filter.month": "Month",
    "matches.filter.placeholderType": "Choose type",
    "matches.filter.placeholderTournament": "Choose competition",
    "matches.filter.placeholderMonth": "Choose month",
    "matches.filter.inFeed": "In feed: {count}",
    "matches.empty": "No matches were found for the current filters.",

    "media.badge": "Club media",
    "media.heroTitle": "Media and stories of the season",
    "media.heroDescription": "Lead stories, club news and visual narratives.",
    "media.leadStory": "Lead story",
    "media.sideMaterial": "Club story",
    "media.story": "Publication",
    "media.storyDefault": "Story",
    "media.storyLeadDefault": "Lead club story",
    "media.storyLeadExcerpt": "Official club story.",
    "media.storyLeadLabel": "Lead publication",
    "media.newsChipDefault": "Club publication",
    "media.newsFallbackTitle": "Club story",
    "media.newsFallbackExcerpt": "Official club publication.",
    "media.newsFallbackLabel": "News",
    "media.galleryFallbackTitle": "Club photo story",
    "media.galleryFallbackLabel": "Gallery",
    "media.emptyLeadEyebrow": "Lead publication",
    "media.emptyLeadTitle": "A fresh story will appear soon",
    "media.emptyLeadDescription": "We are refreshing the club media showcase. Check back a little later for today's lead story.",
    "media.emptyStreamEyebrow": "Club feed",
    "media.emptyStreamTitle": "New stories are being prepared",
    "media.emptyStreamDescription": "Another editorial story will appear here soon.",
    "media.emptyUpdateEyebrow": "Media",
    "media.emptyUpdateTitle": "Another update is coming soon",
    "media.emptyUpdateDescription": "One more story will appear after the next section refresh.",
    "media.newsEyebrow": "News",
    "media.newsTitle": "Editorial club feed",
    "media.newsEmptyEyebrow": "Club news",
    "media.newsEmptyTitle": "The feed is being refreshed",
    "media.newsEmptyDescription": "New stories will appear here a bit later. As soon as the materials are ready, the section will fill with fresh team news.",
    "media.galleryEyebrow": "Gallery",
    "media.galleryTitle": "Photo stories",
    "media.galleryEmptyEyebrow": "Photo gallery",
    "media.galleryEmptyTitle": "New shots will appear soon",
    "media.galleryEmptyDescription": "We are preparing a fresh selection of team photos. After the next update, the best matchday moments and club atmosphere will appear here.",

    "contacts.heroBadge": "Club contacts",
    "contacts.heroTitle": "The official contact layer for the club and arena",
    "contacts.hqEyebrow": "Headquarters",
    "contacts.defaultClubName": "Football club",
    "contacts.channelsEyebrow": "Channels",
    "contacts.channelsTitle": "Official club channels",
    "contacts.channelsEmpty": "Channels have not been filled in yet.",

    "footer.arena": "Arena",
    "footer.communications": "Communications",
    "footer.location": "Location",

    "stadium.matchday": "Matchday",
    "stadium.homeArena": "Club home arena",
    "stadium.homeMatch": "Home match",
  },
};

const I18nContext = createContext(null);

function replaceVariables(value, variables = {}) {
  return String(value).replace(/\{(\w+)\}/g, (_, name) => {
    const resolved = variables[name];
    return resolved === undefined || resolved === null ? "" : String(resolved);
  });
}

export function resolveLanguage(value) {
  const normalized = String(value || DEFAULT_LANGUAGE)
    .trim()
    .toLowerCase()
    .split("-")[0];

  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

function readInitialLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored) {
    return resolveLanguage(stored);
  }

  return resolveLanguage(window.navigator.language);
}

export function translate(language, key, variables) {
  const resolvedLanguage = resolveLanguage(language);
  const value =
    MESSAGES[resolvedLanguage]?.[key] ??
    MESSAGES[DEFAULT_LANGUAGE]?.[key] ??
    key;

  return replaceVariables(value, variables);
}

export function getLocale(language) {
  return resolveLanguage(language) === "en" ? "en-US" : "ru-RU";
}

export function formatDateValue(language, value, options) {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(getLocale(language), options).format(date);
}

export function formatMonthLabel(language, value) {
  return formatDateValue(language, value, {
    month: "long",
    year: "numeric",
  });
}

export function formatFullDateLabel(language, value) {
  return formatDateValue(language, value, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatTimeLabel(language, value) {
  return formatDateValue(language, value, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatHeightValue(language, value) {
  if (value === null || value === undefined || value === "") {
    return translate(language, "common.na");
  }

  return translate(language, "common.heightValue", { value });
}

export function formatWeightValue(language, value) {
  if (value === null || value === undefined || value === "") {
    return translate(language, "common.na");
  }

  return translate(language, "common.weightValue", { value });
}

export function formatPlayerCount(language, count) {
  const resolvedLanguage = resolveLanguage(language);

  if (resolvedLanguage === "en") {
    return `${count} ${count === 1 ? "player" : "players"}`;
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} ${translate(resolvedLanguage, "team.playerCountSuffix.one")}`;
  }

  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${count} ${translate(resolvedLanguage, "team.playerCountSuffix.few")}`;
  }

  return `${count} ${translate(resolvedLanguage, "team.playerCountSuffix.many")}`;
}

export function formatMatchCount(language, count) {
  const resolvedLanguage = resolveLanguage(language);

  if (resolvedLanguage === "en") {
    return `${count} ${count === 1 ? "match" : "matches"}`;
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} ${translate(resolvedLanguage, "match.count.one")}`;
  }

  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${count} ${translate(resolvedLanguage, "match.count.few")}`;
  }

  return `${count} ${translate(resolvedLanguage, "match.count.many")}`;
}

export function translateChannelLabel(language, label) {
  const raw = String(label || "").trim().toLowerCase();

  if (!raw) return "";
  if (raw.includes("telegram") || raw.includes("tg")) return "Telegram";
  if (raw.includes("vk") || raw.includes("вк") || raw.includes("вконтакте")) return "VK";
  if (raw.includes("youtube") || raw.includes("ютуб")) return "YouTube";
  if (raw.includes("instagram") || raw.includes("inst")) return "Instagram";
  if (raw.includes("video") || raw.includes("видео")) return resolveLanguage(language) === "en" ? "Video" : "Видео";

  return label;
}

export function translateGalleryCategory(language, category, fallbackLabel) {
  const raw = String(category || "").trim().toLowerCase();

  if (raw === "matchday") {
    return resolveLanguage(language) === "en" ? "Matchday" : "Матч-дэй";
  }

  if (raw === "training") {
    return resolveLanguage(language) === "en" ? "Training" : "Тренировка";
  }

  if (raw === "community") {
    return resolveLanguage(language) === "en" ? "Community" : "Сообщество";
  }

  return fallbackLabel || translate(language, "common.gallery");
}

export function getPageTitle(language, page, clubName) {
  const brand = clubName || translate(language, "brand.defaultClubName");
  const pageLabel = translate(language, `nav.${page}`);

  if (!pageLabel || page === "home") {
    return brand;
  }

  return `${pageLabel} | ${brand}`;
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(readInitialLanguage);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    document.documentElement.lang = resolveLanguage(language);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolveLanguage(language));
  }, [language]);

  const setLanguage = (nextLanguage) => {
    const resolved =
      typeof nextLanguage === "function"
        ? resolveLanguage(nextLanguage(language))
        : resolveLanguage(nextLanguage);

    startTransition(() => {
      setLanguageState(resolved);
    });
  };

  const toggleLanguage = () => {
    setLanguage((current) => (resolveLanguage(current) === "ru" ? "en" : "ru"));
  };

  const value = {
    language,
    locale: getLocale(language),
    setLanguage,
    toggleLanguage,
    t: (key, variables) => translate(language, key, variables),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}
