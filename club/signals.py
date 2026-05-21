from django.db.models.signals import post_delete, post_save

from .cache_utils import invalidate_public_payload_cache
from .models import ClubProfile, GalleryItem, Match, NewsPost, Player, Trophy


PUBLIC_CONTENT_MODELS = (ClubProfile, GalleryItem, Match, NewsPost, Player, Trophy)


def invalidate_public_content_cache(**_kwargs):
    invalidate_public_payload_cache()


for model in PUBLIC_CONTENT_MODELS:
    post_save.connect(
        invalidate_public_content_cache,
        sender=model,
        dispatch_uid=f"club.invalidate_public_payload.{model.__name__}.save",
    )
    post_delete.connect(
        invalidate_public_content_cache,
        sender=model,
        dispatch_uid=f"club.invalidate_public_payload.{model.__name__}.delete",
    )
