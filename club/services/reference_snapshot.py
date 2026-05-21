from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import json
from pathlib import Path

from django.utils.text import slugify

from club.cache_utils import invalidate_public_payload_cache
from club.localized_content import (
    localize_competition as translate_competition,
    localize_country,
    localize_opponent as translate_opponent,
    localize_place,
    localize_player_name,
    localize_previous_club,
    localize_story_body,
    localize_story_excerpt,
    localize_story_title,
    localize_trophy_description,
    localize_trophy_title,
    localize_venue as translate_venue,
)
from club.models import ClubProfile, GalleryItem, Match, NewsPost, Player, Trophy


SNAPSHOT_PATH = Path(__file__).resolve().parents[2] / "data" / "reference_snapshot.json"


@dataclass
class ImportSummary:
    players: int = 0
    matches: int = 0
    news: int = 0
    gallery_items: int = 0


def load_snapshot():
    if not SNAPSHOT_PATH.exists():
        raise FileNotFoundError(f"Reference snapshot not found: {SNAPSHOT_PATH}")
    return json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))


def first_text(*values):
    for value in values:
        if value is None:
            continue
        if isinstance(value, str):
            value = value.strip()
        if value != "":
            return value
    return ""


def ensure_localized_field(payload: dict, field_name: str, ru_builder=None, en_builder=None, legacy_language: str = "ru"):
    legacy = first_text(payload.get(field_name))
    value_ru = first_text(payload.get(f"{field_name}_ru"))
    value_en = first_text(payload.get(f"{field_name}_en"))
    seed = first_text(legacy, value_en, value_ru)

    if not value_ru and ru_builder and seed:
        value_ru = ru_builder(seed)
    value_ru = first_text(value_ru, legacy, value_en)

    if not value_en and en_builder and seed:
        value_en = en_builder(seed)
    value_en = first_text(value_en, legacy, value_ru)

    if legacy_language == "en":
        payload[field_name] = first_text(legacy, value_en, value_ru)
    else:
        payload[field_name] = first_text(legacy, value_ru, value_en)

    payload[f"{field_name}_ru"] = value_ru
    payload[f"{field_name}_en"] = value_en
    return payload


def ensure_player_localization(item: dict) -> dict:
    payload = item.copy()
    ensure_localized_field(
        payload,
        "full_name",
        lambda value: localize_player_name(value, "ru"),
        lambda value: localize_player_name(value, "en"),
        legacy_language="en",
    )
    ensure_localized_field(payload, "hometown", lambda value: localize_place(value, "ru"), lambda value: localize_place(value, "en"), legacy_language="en")
    ensure_localized_field(payload, "place_of_birth", lambda value: localize_place(value, "ru"), lambda value: localize_place(value, "en"), legacy_language="en")
    ensure_localized_field(payload, "citizenship", lambda value: localize_country(value, "ru"), lambda value: localize_country(value, "en"), legacy_language="en")
    ensure_localized_field(payload, "previous_club", lambda value: localize_previous_club(value, "ru"), lambda value: localize_previous_club(value, "en"), legacy_language="en")
    ensure_localized_field(payload, "bio", legacy_language="en")
    ensure_localized_field(payload, "achievements", legacy_language="en")
    return payload


def ensure_news_localization(item: dict) -> dict:
    payload = item.copy()
    ensure_localized_field(payload, "title", lambda value: localize_story_title(value, "ru"), lambda value: localize_story_title(value, "en"), legacy_language="en")
    ensure_localized_field(payload, "excerpt", lambda value: localize_story_excerpt(value, "ru"), lambda value: localize_story_excerpt(value, "en"), legacy_language="en")
    ensure_localized_field(payload, "body", lambda value: localize_story_body(value, "ru"), lambda value: localize_story_body(value, "en"), legacy_language="en")
    return payload


def ensure_match_localization(item: dict) -> dict:
    payload = item.copy()
    ensure_localized_field(payload, "opponent", lambda value: translate_opponent(value, "ru"), lambda value: translate_opponent(value, "en"))
    ensure_localized_field(payload, "competition", lambda value: translate_competition(value, "ru"), lambda value: translate_competition(value, "en"))
    ensure_localized_field(payload, "venue", lambda value: translate_venue(value, "ru"), lambda value: translate_venue(value, "en"))
    ensure_localized_field(payload, "city", lambda value: localize_place(value, "ru"), lambda value: localize_place(value, "en"))
    ensure_localized_field(payload, "summary", legacy_language="ru")
    return payload


def ensure_gallery_localization(item: dict) -> dict:
    payload = item.copy()
    ensure_localized_field(payload, "title", lambda value: localize_story_title(value, "ru"), lambda value: localize_story_title(value, "en"))
    ensure_localized_field(payload, "caption", lambda value: localize_story_excerpt(value, "ru"), lambda value: localize_story_excerpt(value, "en"))
    ensure_localized_field(payload, "accent", legacy_language="ru")
    return payload


def ensure_trophy_localization(item: dict) -> dict:
    payload = item.copy()
    ensure_localized_field(payload, "title", lambda value: localize_trophy_title(value, "ru"), lambda value: localize_trophy_title(value, "en"))
    ensure_localized_field(payload, "description", lambda value: localize_trophy_description(value, "ru"), lambda value: localize_trophy_description(value, "en"))
    return payload


def ensure_club_profile_localization(item: dict) -> dict:
    payload = item.copy()
    ensure_localized_field(payload, "name", legacy_language="ru")
    ensure_localized_field(payload, "short_name", legacy_language="ru")
    ensure_localized_field(payload, "tagline", legacy_language="ru")
    ensure_localized_field(payload, "mission", legacy_language="ru")
    ensure_localized_field(payload, "city", lambda value: localize_place(value, "ru"), lambda value: localize_place(value, "en"), legacy_language="ru")
    ensure_localized_field(payload, "stadium", lambda value: translate_venue(value, "ru"), lambda value: translate_venue(value, "en"), legacy_language="ru")
    ensure_localized_field(payload, "address", legacy_language="ru")
    ensure_localized_field(payload, "hero_badge", legacy_language="ru")
    return payload


def build_player_slug(payload: dict) -> str:
    base = slugify(first_text(payload.get("full_name_en"), payload.get("full_name"), payload.get("full_name_ru")), allow_unicode=True)
    return base or f"player-{payload.get('number') or payload.get('sort_order') or 'x'}"


def build_news_slug(payload: dict) -> str:
    base = slugify(first_text(payload.get("title_en"), payload.get("title"), payload.get("title_ru")), allow_unicode=True)
    published_at = payload.get("published_at")
    suffix = ""
    if published_at:
        suffix = f"-{str(published_at)[:10]}"
    return f"{base or 'news'}{suffix}"


def sync_reference_data(replace: bool = True) -> ImportSummary:
    summary = ImportSummary()
    snapshot = load_snapshot()

    if replace:
        Player.objects.all().delete()
        Match.objects.all().delete()
        NewsPost.objects.all().delete()
        GalleryItem.objects.all().delete()
        Trophy.objects.all().delete()

    for player_stub in snapshot["players"]:
        payload = ensure_player_localization(player_stub)
        if payload.get("birth_date"):
            payload["birth_date"] = datetime.fromisoformat(payload["birth_date"]).date()
        payload["slug"] = payload.get("slug") or build_player_slug(payload)
        player_slug = payload["slug"]
        Player.objects.update_or_create(slug=player_slug, defaults=payload)
        summary.players += 1

    for item in snapshot["news"]:
        payload = ensure_news_localization(item)
        payload["published_at"] = datetime.fromisoformat(payload["published_at"])
        payload["slug"] = payload.get("slug") or build_news_slug(payload)
        news_slug = payload["slug"]
        NewsPost.objects.update_or_create(slug=news_slug, defaults=payload)
        summary.news += 1

    for item in snapshot["gallery_items"]:
        payload = ensure_gallery_localization(item)
        gallery_title = first_text(payload.get("title_en"), payload.get("title"), payload.get("title_ru"))
        gallery_category = payload.get("category", GalleryItem.Category.MATCHDAY)
        GalleryItem.objects.update_or_create(
            title_en=gallery_title,
            category=gallery_category,
            defaults=payload,
        )
        summary.gallery_items += 1

    matches = snapshot["matches"]
    wins = goals = clean_sheets = 0
    for item in matches:
        payload = ensure_match_localization(item)
        payload["start_at"] = datetime.fromisoformat(payload["start_at"])
        match_lookup = {
            "start_at": payload["start_at"],
            "opponent_en": first_text(payload.get("opponent_en"), payload.get("opponent"), payload.get("opponent_ru")),
            "competition_en": first_text(payload.get("competition_en"), payload.get("competition"), payload.get("competition_ru")),
        }
        defaults = payload.copy()
        defaults.pop("start_at", None)
        defaults.pop("opponent_en", None)
        defaults.pop("competition_en", None)
        Match.objects.update_or_create(**match_lookup, defaults=defaults)
        summary.matches += 1
        if item["score_for"] is not None and item["score_against"] is not None:
            goals += item["score_for"]
            if item["score_for"] > item["score_against"]:
                wins += 1
            if item["score_against"] == 0:
                clean_sheets += 1

    for trophy in snapshot["trophies"]:
        payload = ensure_trophy_localization(trophy)
        Trophy.objects.update_or_create(title=payload["title"], season=payload["season"], defaults=payload)

    ClubProfile.objects.update_or_create(
        id=1,
        defaults={
            **ensure_club_profile_localization(snapshot["club_profile"]),
            "stats_wins": wins,
            "stats_goals": goals,
            "stats_clean_sheets": clean_sheets,
        },
    )

    invalidate_public_payload_cache()
    return summary
