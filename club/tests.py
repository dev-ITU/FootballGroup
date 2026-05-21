from django.core.cache import caches
from django.db import connection
from django.test import TestCase, override_settings
from django.test.utils import CaptureQueriesContext

from .payloads import build_site_payload
from .models import ClubProfile, Player


TEST_CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "club-tests",
    }
}


def create_club_profile(**overrides):
    payload = {
        "name": "Газпром Футбол",
        "name_ru": "Газпром Футбол",
        "name_en": "Gazprom Football",
        "short_name": "Газпром Футбол",
        "short_name_ru": "Газпром Футбол",
        "short_name_en": "Gazprom Football",
        "tagline": "Арена и матч-дэй",
        "tagline_ru": "Арена и матч-дэй",
        "tagline_en": "Arena and matchday",
        "mission": "Описание",
        "mission_ru": "Описание",
        "mission_en": "Description",
        "city": "Санкт-Петербург",
        "city_ru": "Санкт-Петербург",
        "city_en": "Saint Petersburg",
        "stadium": "Газпром Арена",
        "stadium_ru": "Газпром Арена",
        "stadium_en": "Gazprom Arena",
        "address": "Санкт-Петербург",
        "address_ru": "Санкт-Петербург",
        "address_en": "Saint Petersburg",
        "phone": "+7 (800) 000-00-00",
        "email": "team@example.com",
        "hero_badge": "Газпром футбольная программа",
        "hero_badge_ru": "Газпром футбольная программа",
        "hero_badge_en": "Gazprom football program",
    }
    payload.update(overrides)
    return ClubProfile.objects.create(**payload)


class PublicSiteTests(TestCase):
    def test_home_page_contains_server_rendered_navigation(self):
        response = self.client.get("/", HTTP_HOST="127.0.0.1")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Главная")
        self.assertContains(response, "Команда")
        self.assertContains(response, "Контакты")

    def test_robots_txt_served_from_root(self):
        response = self.client.get("/robots.txt", HTTP_HOST="127.0.0.1")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "text/plain; charset=utf-8")
        self.assertContains(response, "User-agent: *")

    def test_site_api_exposes_bilingual_club_fields(self):
        create_club_profile()

        response = self.client.get("/api/site/", HTTP_HOST="127.0.0.1")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["club"]["name_ru"], "Газпром Футбол")
        self.assertEqual(payload["club"]["name_en"], "Gazprom Football")
        self.assertEqual(payload["club"]["hero_badge_en"], "Gazprom football program")

    def test_team_api_exposes_bilingual_player_fields(self):
        Player.objects.create(
            full_name="Douglas Santos",
            full_name_ru="Дуглас Сантос",
            full_name_en="Douglas Santos",
            number=3,
            position=Player.Position.DEFENDER,
            bio="Douglas Santos is a defender for the team.",
            bio_ru="Дуглас Сантос — защитник команды.",
            bio_en="Douglas Santos is a defender for the team.",
            achievements="18 matches · 1 goals · 2 YC",
            achievements_ru="18 матчей · 1 голов · 2 ЖК",
            achievements_en="18 matches · 1 goals · 2 YC",
            hometown="Joao Pessoa",
            hometown_ru="Жуан-Песоа",
            hometown_en="Joao Pessoa",
            place_of_birth="Joao Pessoa",
            place_of_birth_ru="Жуан-Песоа",
            place_of_birth_en="Joao Pessoa",
            citizenship="Brazil",
            citizenship_ru="Бразилия",
            citizenship_en="Brazil",
            previous_club="Hamburg",
            previous_club_ru="Гамбург",
            previous_club_en="Hamburg",
        )

        response = self.client.get("/api/team/", HTTP_HOST="127.0.0.1")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        player = payload["players"][0]
        self.assertEqual(player["full_name_ru"], "Дуглас Сантос")
        self.assertEqual(player["full_name_en"], "Douglas Santos")
        self.assertEqual(player["citizenship_ru"], "Бразилия")

    @override_settings(CACHES=TEST_CACHES)
    def test_site_payload_is_cached_and_invalidated_on_content_save(self):
        profile = create_club_profile()
        caches["default"].clear()

        with CaptureQueriesContext(connection) as first_queries:
            first_payload = build_site_payload()
        with CaptureQueriesContext(connection) as second_queries:
            second_payload = build_site_payload()

        self.assertEqual(first_payload, second_payload)
        self.assertGreater(len(first_queries), 0)
        self.assertEqual(len(second_queries), 0)

        profile.name_ru = "Газпром Новый"
        profile.name_en = "Gazprom New"
        profile.save()

        refreshed_payload = build_site_payload()
        self.assertEqual(refreshed_payload["club"]["name_ru"], "Газпром Новый")
        self.assertEqual(refreshed_payload["club"]["name_en"], "Gazprom New")
