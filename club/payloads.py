from hashlib import sha256

from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.formats import date_format, time_format

from .cache_utils import (
    MATCH_HUB_CACHE_KEY,
    PUBLIC_PAYLOAD_CACHE_KEY_PREFIX,
    PUBLIC_PAYLOAD_CACHE_TIMEOUT,
    get_public_payload_cache_version,
    safe_cache_get,
    safe_cache_set,
)
from .models import ClubProfile, GalleryItem, Match, NewsPost, Player, Trophy
from .tasks import refresh_match_hub


MATCH_STATUS_LABELS = {
    Match.Status.UPCOMING: {"ru": "Скоро", "en": "Soon"},
    Match.Status.LIVE: {"ru": "В эфире", "en": "Live"},
    Match.Status.FINISHED: {"ru": "Завершен", "en": "Finished"},
}


def get_request_cache_scope(request):
    if request is None:
        return "internal"
    return f"{request.scheme}://{request.get_host()}"


def build_public_payload_cache_key(page_name, request=None):
    version = get_public_payload_cache_version()
    scope = get_request_cache_scope(request)
    scope_hash = sha256(scope.encode("utf-8")).hexdigest()[:16]
    return f"{PUBLIC_PAYLOAD_CACHE_KEY_PREFIX}:{version}:{page_name}:{scope_hash}"


def build_cached_public_payload(page_name, request, builder):
    cache_key = build_public_payload_cache_key(page_name, request)
    cached_payload = safe_cache_get(cache_key)
    if cached_payload is not None:
        return cached_payload

    payload = builder(request)
    safe_cache_set(cache_key, payload, timeout=PUBLIC_PAYLOAD_CACHE_TIMEOUT)
    return payload


def absolutize_url(request, url):
    if not url:
        return ""
    if url.startswith(("http://", "https://")) or request is None:
        return url
    return request.build_absolute_uri(url)


def first_text(*values):
    for value in values:
        if value is None:
            continue
        if isinstance(value, str):
            value = value.strip()
        if value != "":
            return value
    return ""


def read_value(source, key, default=""):
    if source is None:
        return default
    if isinstance(source, dict):
        return source.get(key, default)
    return getattr(source, key, default)


def resolve_localized_pair(source, field_name, fallback_ru="", fallback_en=""):
    legacy = first_text(read_value(source, field_name, ""))
    value_ru = first_text(read_value(source, f"{field_name}_ru", ""))
    value_en = first_text(read_value(source, f"{field_name}_en", ""))

    resolved_ru = first_text(value_ru, legacy, value_en, fallback_ru, fallback_en)
    resolved_en = first_text(value_en, legacy, value_ru, fallback_en, fallback_ru)
    return resolved_ru, resolved_en


def assign_localized_field(payload, source, field_name, fallback_ru="", fallback_en=""):
    value_ru, value_en = resolve_localized_pair(source, field_name, fallback_ru, fallback_en)
    payload[field_name] = value_ru
    payload[f"{field_name}_ru"] = value_ru
    payload[f"{field_name}_en"] = value_en


def get_club_profile():
    return ClubProfile.objects.order_by("id").first()


def serialize_profile(profile):
    profile = profile or get_club_profile()

    payload = {
        "phone": profile.phone if profile else "+7 (800) 000-00-00",
        "email": profile.email if profile else "team@gazprom-fc.ru",
        "stats": {
            "wins": profile.stats_wins if profile else 18,
            "goals": profile.stats_goals if profile else 52,
            "clean_sheets": profile.stats_clean_sheets if profile else 9,
        },
        "links": {
            "telegram_url": profile.telegram_url if profile else "",
            "vk_url": profile.vk_url if profile else "",
        },
    }

    assign_localized_field(payload, profile, "name", "Футбольная команда Газпром", "Gazprom Football Club")
    assign_localized_field(payload, profile, "short_name", "Газпром Футбол", "Gazprom Football")
    assign_localized_field(
        payload,
        profile,
        "tagline",
        "Матч-дэй, арена и клубный продукт уровня большой команды.",
        "Matchday, arena and club product at top-flight level.",
    )
    assign_localized_field(
        payload,
        profile,
        "mission",
        "Клубная платформа строится вокруг следующего матча, домашней арены и медиа-кампании.",
        "The club platform is built around the next fixture, the home arena and the media campaign.",
    )
    assign_localized_field(payload, profile, "city", "Санкт-Петербург", "Saint Petersburg")
    assign_localized_field(payload, profile, "stadium", "Газпром Арена", "Gazprom Arena")
    assign_localized_field(payload, profile, "address", "Санкт-Петербург", "Saint Petersburg")
    assign_localized_field(payload, profile, "hero_badge", "Газпром футбольная программа", "Gazprom football program")
    return payload


def serialize_match(match, request=None):
    if not match:
        return None

    start_at = timezone.localtime(match.start_at)
    payload = {
        "status": match.status,
        "status_label": MATCH_STATUS_LABELS.get(match.status, {}).get("ru", match.get_status_display()),
        "status_label_ru": MATCH_STATUS_LABELS.get(match.status, {}).get("ru", match.get_status_display()),
        "status_label_en": MATCH_STATUS_LABELS.get(match.status, {}).get("en", match.get_status_display()),
        "date_label": date_format(start_at, "j E Y"),
        "short_date_label": date_format(start_at, "d E"),
        "time_label": time_format(start_at, "H:i"),
        "kickoff_iso": start_at.isoformat(),
        "score_for": match.score_for,
        "score_against": match.score_against,
        "result_label": match.result_label,
        "opponent_logo_url": absolutize_url(request, match.opponent_logo_url),
    }
    assign_localized_field(payload, match, "opponent")
    assign_localized_field(payload, match, "competition")
    assign_localized_field(payload, match, "city")
    assign_localized_field(payload, match, "venue")
    assign_localized_field(payload, match, "summary")
    return payload


def serialize_player(player, request=None):
    if not player:
        return None

    payload = {
        "id": player.id,
        "slug": player.slug,
        "number": player.number,
        "position": player.position,
        "position_label": player.get_position_display(),
        "captain": player.captain,
        "photo_url": absolutize_url(request, player.photo_url),
        "birth_date": player.birth_date.isoformat() if player.birth_date else "",
        "birth_date_label": date_format(player.birth_date, "j E Y") if player.birth_date else "",
        "age": player.age,
        "height_cm": player.height_cm,
        "weight_kg": player.weight_kg,
        "matches_for_club": player.matches_for_club,
        "minutes_for_club": player.minutes_for_club,
        "goals_for_club": player.goals_for_club,
        "yellow_cards": player.yellow_cards,
        "red_cards": player.red_cards,
        "speed": player.speed,
        "stamina": player.stamina,
        "technique": player.technique,
        "featured": player.featured,
        "compact_profile": player.compact_profile,
        "initials": player.initials,
    }
    assign_localized_field(payload, player, "full_name")
    assign_localized_field(payload, player, "bio")
    assign_localized_field(payload, player, "achievements")
    assign_localized_field(payload, player, "hometown")
    assign_localized_field(payload, player, "place_of_birth")
    assign_localized_field(payload, player, "citizenship")
    assign_localized_field(payload, player, "previous_club")
    return payload


def serialize_news(post, request=None):
    if not post:
        return None

    published_at = timezone.localtime(post.published_at)
    payload = {
        "id": post.id,
        "slug": post.slug,
        "cover_url": absolutize_url(request, post.cover_url),
        "published_at": published_at.isoformat(),
        "published_label": date_format(published_at, "j E Y"),
        "featured": post.featured,
    }
    assign_localized_field(payload, post, "title")
    assign_localized_field(payload, post, "excerpt")
    assign_localized_field(payload, post, "body")
    return payload


def serialize_gallery_item(item, request=None):
    if not item:
        return None

    payload = {
        "id": item.id,
        "category": item.category,
        "category_label": item.get_category_display(),
        "image_url": absolutize_url(request, item.image_url),
    }
    assign_localized_field(payload, item, "title")
    assign_localized_field(payload, item, "caption")
    assign_localized_field(payload, item, "accent")
    return payload


def serialize_trophy(trophy):
    if not trophy:
        return None

    payload = {
        "season": trophy.season,
    }
    assign_localized_field(payload, trophy, "title")
    assign_localized_field(payload, trophy, "description")
    return payload


def get_match_hub_payload():
    payload = safe_cache_get(MATCH_HUB_CACHE_KEY)
    if payload is None:
        payload = refresh_match_hub()

    def normalize_start(value):
        if isinstance(value, str):
            parsed = parse_datetime(value)
            if parsed:
                value = parsed
        if value is None:
            return None
        return timezone.localtime(value)

    upcoming = []
    for item in payload.get("upcoming", []):
        start_at = normalize_start(item.get("start_at"))
        serialized = {
            "status": item.get("status", ""),
            "status_label": MATCH_STATUS_LABELS.get(item.get("status"), {}).get("ru", ""),
            "status_label_ru": MATCH_STATUS_LABELS.get(item.get("status"), {}).get("ru", ""),
            "status_label_en": MATCH_STATUS_LABELS.get(item.get("status"), {}).get("en", ""),
            "date_label": date_format(start_at, "j E") if start_at else "",
            "time_label": time_format(start_at, "H:i") if start_at else "",
            "kickoff_iso": start_at.isoformat() if start_at else "",
        }
        assign_localized_field(serialized, item, "opponent")
        assign_localized_field(serialized, item, "competition")
        assign_localized_field(serialized, item, "venue")
        assign_localized_field(serialized, item, "city")
        upcoming.append(serialized)

    recent = []
    for item in payload.get("recent", []):
        serialized = {
            "score_for": item.get("score_for"),
            "score_against": item.get("score_against"),
            "result_label": (
                f"{item.get('score_for')}:{item.get('score_against')}"
                if item.get("score_for") is not None and item.get("score_against") is not None
                else "vs"
            ),
        }
        assign_localized_field(serialized, item, "opponent")
        assign_localized_field(serialized, item, "competition")
        recent.append(serialized)

    updated_at = payload.get("updated_at")
    if isinstance(updated_at, str):
        updated_at = parse_datetime(updated_at)
    if updated_at:
        updated_at = timezone.localtime(updated_at)

    return {
        "upcoming": upcoming,
        "recent": recent,
        "updated_at": updated_at.isoformat() if updated_at else "",
        "updated_label": time_format(updated_at, "H:i") if updated_at else "",
    }


def _build_site_payload(request=None):
    return {"club": serialize_profile(get_club_profile())}


def build_site_payload(request=None):
    return build_cached_public_payload("site", request, _build_site_payload)


def _build_home_payload(request=None):
    now = timezone.now()
    profile = get_club_profile()
    featured_players = list(Player.objects.filter(featured=True).order_by("sort_order", "number")[:4])
    if not featured_players:
        featured_players = list(Player.objects.order_by("sort_order", "number")[:4])
    lineup_players = featured_players[:3]
    featured_news = list(NewsPost.objects.filter(featured=True).order_by("-published_at")[:3])
    if not featured_news:
        featured_news = list(NewsPost.objects.order_by("-published_at")[:3])
    gallery_items = list(GalleryItem.objects.all()[:6])
    next_matches = list(Match.objects.filter(start_at__gte=now).order_by("start_at")[:4])
    featured_match = Match.objects.filter(start_at__gte=now).order_by("-featured", "start_at").first()
    latest_result = Match.objects.filter(status=Match.Status.FINISHED).order_by("-start_at").first()

    return {
        "club": serialize_profile(profile),
        "hero": {
            "featured_match": serialize_match(featured_match, request),
            "latest_result": serialize_match(latest_result, request),
            "featured_players": [serialize_player(player, request) for player in featured_players],
            "lineup_players": [serialize_player(player, request) for player in lineup_players],
            "featured_news": [serialize_news(post, request) for post in featured_news],
            "ticker_news": [serialize_news(post, request) for post in NewsPost.objects.order_by("-published_at")[:4]],
            "gallery_items": [serialize_gallery_item(item, request) for item in gallery_items],
            "next_matches": [serialize_match(match, request) for match in next_matches],
            "trophies": [serialize_trophy(trophy) for trophy in Trophy.objects.all()[:4]],
            "match_hub": get_match_hub_payload(),
        },
    }


def build_home_payload(request=None):
    return build_cached_public_payload("home", request, _build_home_payload)


def _build_team_payload(request=None):
    players = list(Player.objects.order_by("sort_order", "number"))
    return {
        "club": serialize_profile(get_club_profile()),
        "captain": serialize_player(Player.objects.filter(captain=True).first(), request),
        "players": [serialize_player(player, request) for player in players],
        "groups": [
            {
                "key": code,
                "label": label,
                "players": [serialize_player(player, request) for player in players if player.position == code],
            }
            for code, label in Player.Position.choices
        ],
    }


def build_team_payload(request=None):
    return build_cached_public_payload("team", request, _build_team_payload)


def _build_matches_payload(request=None):
    now = timezone.now()
    featured_match = Match.objects.filter(start_at__gte=now).order_by("-featured", "start_at").first()
    if not featured_match:
        featured_match = Match.objects.filter(featured=True).order_by("-start_at").first()
    matches = list(Match.objects.order_by("-featured", "-start_at"))
    return {
        "club": serialize_profile(get_club_profile()),
        "featured_match": serialize_match(featured_match, request),
        "matches": [serialize_match(match, request) for match in matches],
        "match_hub": get_match_hub_payload(),
    }


def build_matches_payload(request=None):
    return build_cached_public_payload("matches", request, _build_matches_payload)


def _build_media_payload(request=None):
    news_items = list(NewsPost.objects.all()[:6])
    gallery_items = list(GalleryItem.objects.all())
    return {
        "club": serialize_profile(get_club_profile()),
        "lead_story": serialize_news(news_items[0], request) if news_items else None,
        "news_items": [serialize_news(post, request) for post in news_items],
        "gallery_items": [serialize_gallery_item(item, request) for item in gallery_items],
    }


def build_media_payload(request=None):
    return build_cached_public_payload("media", request, _build_media_payload)


def _build_contacts_payload(request=None):
    profile = get_club_profile()
    recent_matches = list(Match.objects.filter(status=Match.Status.FINISHED).order_by("-start_at")[:3])
    channels = []
    if profile and profile.telegram_url:
        channels.append({"label": "Telegram", "url": profile.telegram_url})
    if profile and profile.vk_url:
        channels.append({"label": "VK", "url": profile.vk_url})
    return {
        "club": serialize_profile(profile),
        "recent_matches": [serialize_match(match, request) for match in recent_matches],
        "channels": channels,
    }


def build_contacts_payload(request=None):
    return build_cached_public_payload("contacts", request, _build_contacts_payload)
