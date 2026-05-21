from __future__ import annotations

import logging

from django.core.cache import cache
from django.utils import timezone


logger = logging.getLogger(__name__)

MATCH_HUB_CACHE_KEY = "club:match_hub"
PUBLIC_PAYLOAD_CACHE_KEY_PREFIX = "club:public_payload"
PUBLIC_PAYLOAD_CACHE_TIMEOUT = 60 * 5
PUBLIC_PAYLOAD_CACHE_VERSION_KEY = "club:public_payload:version"
PUBLIC_PAYLOAD_CACHE_DEFAULT_VERSION = "1"


def safe_cache_get(key, default=None):
    try:
        return cache.get(key, default)
    except Exception:
        logger.debug("Cache get failed for key %s", key, exc_info=True)
        return default


def safe_cache_set(key, value, timeout=None):
    try:
        return cache.set(key, value, timeout=timeout)
    except Exception:
        logger.debug("Cache set failed for key %s", key, exc_info=True)
        return False


def safe_cache_delete(key):
    try:
        return cache.delete(key)
    except Exception:
        logger.debug("Cache delete failed for key %s", key, exc_info=True)
        return False


def get_public_payload_cache_version():
    return str(
        safe_cache_get(
            PUBLIC_PAYLOAD_CACHE_VERSION_KEY,
            PUBLIC_PAYLOAD_CACHE_DEFAULT_VERSION,
        )
        or PUBLIC_PAYLOAD_CACHE_DEFAULT_VERSION
    )


def invalidate_public_payload_cache():
    version = str(timezone.now().timestamp())
    safe_cache_set(PUBLIC_PAYLOAD_CACHE_VERSION_KEY, version, timeout=None)
    safe_cache_delete(MATCH_HUB_CACHE_KEY)
    return version
