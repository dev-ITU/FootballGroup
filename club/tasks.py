from django.utils import timezone

from celery import shared_task

from .cache_utils import MATCH_HUB_CACHE_KEY, safe_cache_set
from .models import Match


@shared_task
def refresh_match_hub():
    now = timezone.now()
    upcoming = list(
        Match.objects.filter(start_at__gte=now)
        .order_by("start_at")
        .values(
            "opponent",
            "opponent_ru",
            "opponent_en",
            "competition",
            "competition_ru",
            "competition_en",
            "start_at",
            "venue",
            "venue_ru",
            "venue_en",
            "city",
            "city_ru",
            "city_en",
            "status",
        )[:3]
    )
    recent = list(
        Match.objects.filter(status=Match.Status.FINISHED)
        .order_by("-start_at")
        .values(
            "opponent",
            "opponent_ru",
            "opponent_en",
            "score_for",
            "score_against",
            "competition",
            "competition_ru",
            "competition_en",
        )[:3]
    )
    payload = {
        "upcoming": upcoming,
        "recent": recent,
        "updated_at": now.isoformat(),
    }
    safe_cache_set(MATCH_HUB_CACHE_KEY, payload, timeout=60 * 15)
    return payload
