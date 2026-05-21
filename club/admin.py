from django.contrib import admin
from django.utils.html import format_html

from .models import ClubProfile, GalleryItem, Match, NewsPost, Player, Trophy

admin.site.site_header = "Gazprom FC Admin"
admin.site.site_title = "Gazprom FC"
admin.site.index_title = "Управление клубным сайтом"


@admin.register(ClubProfile)
class ClubProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "stadium", "updated_at")
    fieldsets = (
        (
            "Бренд RU / EN",
            {
                "fields": (
                    ("name_ru", "name_en"),
                    ("short_name_ru", "short_name_en"),
                    ("tagline_ru", "tagline_en"),
                    ("mission_ru", "mission_en"),
                    ("hero_badge_ru", "hero_badge_en"),
                )
            },
        ),
        (
            "Локация RU / EN",
            {
                "fields": (
                    ("city_ru", "city_en"),
                    ("stadium_ru", "stadium_en"),
                    ("address_ru", "address_en"),
                )
            },
        ),
        ("Локация и контакты", {"fields": ("phone", "email", "telegram_url", "vk_url")}),
        ("Цифры", {"fields": ("stats_wins", "stats_goals", "stats_clean_sheets")}),
        (
            "Legacy fields",
            {
                "classes": ("collapse",),
                "fields": ("name", "short_name", "tagline", "mission", "city", "stadium", "address", "hero_badge"),
            },
        ),
    )


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ("photo_preview", "full_name", "number", "position", "citizenship", "matches_for_club", "goals_for_club", "captain", "featured")
    list_filter = ("position", "captain", "featured", "citizenship")
    list_editable = ("featured",)
    search_fields = ("full_name", "full_name_ru", "full_name_en", "hometown", "achievements", "citizenship", "previous_club")
    prepopulated_fields = {"slug": ("full_name",)}
    readonly_fields = ("photo_preview_large",)
    ordering = ("sort_order", "number", "full_name")
    fieldsets = (
        (
            "Карточка",
            {
                "fields": (
                    ("full_name_ru", "full_name_en"),
                    "slug",
                    ("number", "position"),
                    ("captain", "featured", "sort_order"),
                )
            },
        ),
        ("Фото", {"fields": ("photo", "remote_photo_url", "photo_preview_large")}),
        (
            "Профиль RU / EN",
            {
                "fields": (
                    ("bio_ru", "bio_en"),
                    ("achievements_ru", "achievements_en"),
                    ("hometown_ru", "hometown_en"),
                    ("place_of_birth_ru", "place_of_birth_en"),
                    ("citizenship_ru", "citizenship_en"),
                    ("previous_club_ru", "previous_club_en"),
                    ("birth_date", "age"),
                )
            },
        ),
        ("Физика", {"fields": ("height_cm", "weight_kg")}),
        ("Статистика", {"fields": ("matches_for_club", "minutes_for_club", "goals_for_club", "yellow_cards", "red_cards")}),
        ("Визуальные индикаторы", {"classes": ("collapse",), "fields": ("speed", "stamina", "technique")}),
        (
            "Legacy fields",
            {
                "classes": ("collapse",),
                "fields": ("full_name", "bio", "achievements", "hometown", "place_of_birth", "citizenship", "previous_club"),
            },
        ),
    )

    @admin.display(description="Фото")
    def photo_preview(self, obj):
        if obj.photo_url:
            return format_html('<img src="{}" style="width:42px;height:42px;object-fit:cover;border-radius:10px;" alt="{}">', obj.photo_url, obj.full_name)
        return "—"

    @admin.display(description="Превью")
    def photo_preview_large(self, obj):
        if obj.photo_url:
            return format_html('<img src="{}" style="width:180px;height:180px;object-fit:cover;border-radius:18px;" alt="{}">', obj.photo_url, obj.full_name)
        return "Фото не задано"

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ("opponent", "competition", "start_at", "status", "featured")
    list_filter = ("status", "competition", "featured")
    search_fields = ("opponent", "opponent_ru", "opponent_en", "competition", "competition_ru", "competition_en", "city", "venue")
    date_hierarchy = "start_at"
    fieldsets = (
        (
            "Матч RU / EN",
            {
                "fields": (
                    ("opponent_ru", "opponent_en"),
                    ("competition_ru", "competition_en"),
                    ("start_at", "status", "featured"),
                )
            },
        ),
        ("Локация RU / EN", {"fields": (("venue_ru", "venue_en"), ("city_ru", "city_en"), "opponent_logo_url")}),
        ("Счёт и описание RU / EN", {"fields": ("score_for", "score_against", ("summary_ru", "summary_en"))}),
        (
            "Legacy fields",
            {
                "classes": ("collapse",),
                "fields": ("opponent", "competition", "venue", "city", "summary"),
            },
        ),
    )


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = ("cover_preview", "title", "published_at", "featured")
    list_filter = ("featured",)
    search_fields = ("title", "title_ru", "title_en", "excerpt", "body")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("cover_preview_large",)
    fieldsets = (
        ("Публикация", {"fields": (("title_ru", "title_en"), "slug", "published_at", "featured")}),
        ("Контент RU / EN", {"fields": (("excerpt_ru", "excerpt_en"), ("body_ru", "body_en"))}),
        ("Обложка", {"fields": ("cover", "remote_cover_url", "cover_preview_large")}),
        ("Legacy fields", {"classes": ("collapse",), "fields": ("title", "excerpt", "body")}),
    )

    @admin.display(description="Cover")
    def cover_preview(self, obj):
        if obj.cover_url:
            return format_html('<img src="{}" style="width:64px;height:42px;object-fit:cover;border-radius:8px;" alt="{}">', obj.cover_url, obj.title)
        return "—"

    @admin.display(description="Обложка")
    def cover_preview_large(self, obj):
        if obj.cover_url:
            return format_html('<img src="{}" style="width:240px;height:140px;object-fit:cover;border-radius:16px;" alt="{}">', obj.cover_url, obj.title)
        return "Обложка не задана"

@admin.register(Trophy)
class TrophyAdmin(admin.ModelAdmin):
    list_display = ("title", "season", "description")
    search_fields = ("title", "title_ru", "title_en", "season", "description")
    fieldsets = (
        ("Трофей RU / EN", {"fields": (("title_ru", "title_en"), "season", ("description_ru", "description_en"))}),
        ("Legacy fields", {"classes": ("collapse",), "fields": ("title", "description")}),
    )


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ("image_preview", "title", "category", "accent")
    list_filter = ("category",)
    search_fields = ("title", "title_ru", "title_en", "caption", "accent")
    readonly_fields = ("image_preview_large",)
    fieldsets = (
        ("Карточка RU / EN", {"fields": (("title_ru", "title_en"), "category", ("accent_ru", "accent_en"), ("caption_ru", "caption_en"))}),
        ("Изображение", {"fields": ("image", "remote_image_url", "image_preview_large")}),
        ("Legacy fields", {"classes": ("collapse",), "fields": ("title", "caption", "accent")}),
    )

    @admin.display(description="Фото")
    def image_preview(self, obj):
        if obj.image_url:
            return format_html('<img src="{}" style="width:64px;height:42px;object-fit:cover;border-radius:8px;" alt="{}">', obj.image_url, obj.title)
        return "—"

    @admin.display(description="Превью")
    def image_preview_large(self, obj):
        if obj.image_url:
            return format_html('<img src="{}" style="width:240px;height:140px;object-fit:cover;border-radius:16px;" alt="{}">', obj.image_url, obj.title)
        return "Изображение не задано"
