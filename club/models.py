from django.db import models
from django.utils.text import slugify


def first_text(*values):
    for value in values:
        if value is None:
            continue
        if isinstance(value, str):
            value = value.strip()
        if value != "":
            return value
    return ""


def sync_bilingual_fields(instance, *field_names):
    for field_name in field_names:
        legacy = first_text(getattr(instance, field_name, ""))
        ru_value = first_text(getattr(instance, f"{field_name}_ru", ""))
        en_value = first_text(getattr(instance, f"{field_name}_en", ""))

        resolved_ru = first_text(ru_value, legacy, en_value)
        resolved_en = first_text(en_value, legacy, ru_value)
        resolved_legacy = first_text(legacy, resolved_ru, resolved_en)

        setattr(instance, field_name, resolved_legacy)
        setattr(instance, f"{field_name}_ru", resolved_ru)
        setattr(instance, f"{field_name}_en", resolved_en)


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class LocalizedFieldsMixin(models.Model):
    localized_fields: tuple[str, ...] = ()

    class Meta:
        abstract = True

    def sync_localized_fields(self):
        sync_bilingual_fields(self, *self.localized_fields)


class ClubProfile(LocalizedFieldsMixin, TimestampedModel):
    localized_fields = (
        "name",
        "short_name",
        "tagline",
        "mission",
        "city",
        "stadium",
        "address",
        "hero_badge",
        "source_name",
    )

    name = models.CharField("Название клуба", max_length=200)
    name_ru = models.CharField("Название клуба (RU)", max_length=200, blank=True, default="")
    name_en = models.CharField("Название клуба (EN)", max_length=200, blank=True, default="")
    short_name = models.CharField("Короткое имя", max_length=80, default="Газпром Футбол")
    short_name_ru = models.CharField("Короткое имя (RU)", max_length=80, blank=True, default="")
    short_name_en = models.CharField("Короткое имя (EN)", max_length=80, blank=True, default="")
    tagline = models.CharField("Слоган", max_length=255)
    tagline_ru = models.CharField("Слоган (RU)", max_length=255, blank=True, default="")
    tagline_en = models.CharField("Слоган (EN)", max_length=255, blank=True, default="")
    mission = models.TextField("Описание клуба")
    mission_ru = models.TextField("Описание клуба (RU)", blank=True, default="")
    mission_en = models.TextField("Описание клуба (EN)", blank=True, default="")
    city = models.CharField("Город", max_length=120)
    city_ru = models.CharField("Город (RU)", max_length=120, blank=True, default="")
    city_en = models.CharField("Город (EN)", max_length=120, blank=True, default="")
    stadium = models.CharField("Стадион", max_length=120)
    stadium_ru = models.CharField("Стадион (RU)", max_length=120, blank=True, default="")
    stadium_en = models.CharField("Стадион (EN)", max_length=120, blank=True, default="")
    address = models.CharField("Адрес", max_length=255)
    address_ru = models.CharField("Адрес (RU)", max_length=255, blank=True, default="")
    address_en = models.CharField("Адрес (EN)", max_length=255, blank=True, default="")
    phone = models.CharField("Телефон", max_length=50)
    email = models.EmailField("Email")
    telegram_url = models.URLField("Telegram", blank=True)
    vk_url = models.URLField("VK", blank=True)
    ticket_url = models.URLField("Билеты", blank=True)
    membership_url = models.URLField("Абонементы", blank=True)
    shop_url = models.URLField("Магазин", blank=True)
    hospitality_url = models.URLField("Hospitality", blank=True)
    video_url = models.URLField("Видео", blank=True)
    hero_badge = models.CharField("Подпись hero", max_length=120, default="Газпром футбольная программа")
    hero_badge_ru = models.CharField("Подпись hero (RU)", max_length=120, blank=True, default="")
    hero_badge_en = models.CharField("Подпись hero (EN)", max_length=120, blank=True, default="")
    stats_wins = models.PositiveIntegerField("Победы за сезон", default=18)
    stats_goals = models.PositiveIntegerField("Голы", default=52)
    stats_clean_sheets = models.PositiveIntegerField("Матчи на ноль", default=9)
    source_name = models.CharField("Источник данных", max_length=120, blank=True)
    source_name_ru = models.CharField("Источник данных (RU)", max_length=120, blank=True, default="")
    source_name_en = models.CharField("Источник данных (EN)", max_length=120, blank=True, default="")
    source_url = models.URLField("URL источника", blank=True)

    class Meta:
        verbose_name = "Профиль клуба"
        verbose_name_plural = "Профиль клуба"

    def save(self, *args, **kwargs):
        self.sync_localized_fields()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Player(LocalizedFieldsMixin, TimestampedModel):
    localized_fields = (
        "full_name",
        "hometown",
        "bio",
        "achievements",
        "place_of_birth",
        "citizenship",
        "previous_club",
    )

    class Position(models.TextChoices):
        GOALKEEPER = "GK", "Вратарь"
        DEFENDER = "DF", "Защитник"
        MIDFIELDER = "MF", "Полузащитник"
        FORWARD = "FW", "Нападающий"

    full_name = models.CharField("Имя", max_length=160)
    full_name_ru = models.CharField("Имя (RU)", max_length=160, blank=True, default="")
    full_name_en = models.CharField("Имя (EN)", max_length=160, blank=True, default="")
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    number = models.PositiveIntegerField("Номер")
    position = models.CharField("Позиция", max_length=2, choices=Position.choices)
    captain = models.BooleanField("Капитан", default=False)
    hometown = models.CharField("Город", max_length=120, blank=True)
    hometown_ru = models.CharField("Город (RU)", max_length=120, blank=True, default="")
    hometown_en = models.CharField("Город (EN)", max_length=120, blank=True, default="")
    bio = models.TextField("Профиль игрока", blank=True)
    bio_ru = models.TextField("Профиль игрока (RU)", blank=True, default="")
    bio_en = models.TextField("Профиль игрока (EN)", blank=True, default="")
    achievements = models.CharField("Достижения", max_length=255, blank=True)
    achievements_ru = models.CharField("Достижения (RU)", max_length=255, blank=True, default="")
    achievements_en = models.CharField("Достижения (EN)", max_length=255, blank=True, default="")
    photo = models.ImageField("Фото", upload_to="players/", blank=True)
    remote_photo_url = models.URLField("Внешнее фото", blank=True)
    source_url = models.URLField("Источник игрока", blank=True)
    birth_date = models.DateField("Дата рождения", blank=True, null=True)
    age = models.PositiveIntegerField("Возраст", blank=True, null=True)
    place_of_birth = models.CharField("Место рождения", max_length=160, blank=True)
    place_of_birth_ru = models.CharField("Место рождения (RU)", max_length=160, blank=True, default="")
    place_of_birth_en = models.CharField("Место рождения (EN)", max_length=160, blank=True, default="")
    citizenship = models.CharField("Гражданство", max_length=120, blank=True)
    citizenship_ru = models.CharField("Гражданство (RU)", max_length=120, blank=True, default="")
    citizenship_en = models.CharField("Гражданство (EN)", max_length=120, blank=True, default="")
    height_cm = models.PositiveIntegerField("Рост (см)", blank=True, null=True)
    weight_kg = models.PositiveIntegerField("Вес (кг)", blank=True, null=True)
    previous_club = models.CharField("Предыдущий клуб", max_length=160, blank=True)
    previous_club_ru = models.CharField("Предыдущий клуб (RU)", max_length=160, blank=True, default="")
    previous_club_en = models.CharField("Предыдущий клуб (EN)", max_length=160, blank=True, default="")
    matches_for_club = models.PositiveIntegerField("Матчи за клуб", default=0)
    minutes_for_club = models.PositiveIntegerField("Минуты за клуб", default=0)
    goals_for_club = models.PositiveIntegerField("Голы за клуб", default=0)
    yellow_cards = models.PositiveIntegerField("Жёлтые карточки", default=0)
    red_cards = models.PositiveIntegerField("Красные карточки", default=0)
    speed = models.PositiveIntegerField(default=80)
    stamina = models.PositiveIntegerField(default=80)
    technique = models.PositiveIntegerField(default=80)
    featured = models.BooleanField("Показывать на главной", default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "number", "full_name"]
        verbose_name = "Игрок"
        verbose_name_plural = "Игроки"

    def save(self, *args, **kwargs):
        self.sync_localized_fields()
        if not self.slug:
            self.slug = slugify(self.full_name, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"#{self.number} {self.full_name}"

    @property
    def initials(self) -> str:
        parts = self.full_name.split()
        return "".join(part[0] for part in parts[:2]).upper()

    @property
    def photo_url(self) -> str:
        if self.photo:
            return self.photo.url
        return self.remote_photo_url

    @property
    def compact_profile(self) -> str:
        bits = [self.citizenship]
        if self.height_cm:
            bits.append(f"{self.height_cm} см")
        if self.weight_kg:
            bits.append(f"{self.weight_kg} кг")
        return " · ".join(bit for bit in bits if bit)


class Match(LocalizedFieldsMixin, TimestampedModel):
    localized_fields = (
        "opponent",
        "competition",
        "venue",
        "city",
        "summary",
    )

    class Status(models.TextChoices):
        UPCOMING = "upcoming", "Скоро"
        LIVE = "live", "В эфире"
        FINISHED = "finished", "Завершен"

    opponent = models.CharField("Соперник", max_length=160)
    opponent_ru = models.CharField("Соперник (RU)", max_length=160, blank=True, default="")
    opponent_en = models.CharField("Соперник (EN)", max_length=160, blank=True, default="")
    competition = models.CharField("Турнир", max_length=160)
    competition_ru = models.CharField("Турнир (RU)", max_length=160, blank=True, default="")
    competition_en = models.CharField("Турнир (EN)", max_length=160, blank=True, default="")
    start_at = models.DateTimeField("Дата матча")
    venue = models.CharField("Площадка", max_length=160)
    venue_ru = models.CharField("Площадка (RU)", max_length=160, blank=True, default="")
    venue_en = models.CharField("Площадка (EN)", max_length=160, blank=True, default="")
    city = models.CharField("Город", max_length=120, blank=True)
    city_ru = models.CharField("Город (RU)", max_length=120, blank=True, default="")
    city_en = models.CharField("Город (EN)", max_length=120, blank=True, default="")
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.UPCOMING)
    score_for = models.PositiveIntegerField("Голы команды", blank=True, null=True)
    score_against = models.PositiveIntegerField("Голы соперника", blank=True, null=True)
    summary = models.TextField("Краткий обзор", blank=True)
    summary_ru = models.TextField("Краткий обзор (RU)", blank=True, default="")
    summary_en = models.TextField("Краткий обзор (EN)", blank=True, default="")
    featured = models.BooleanField("Выделить", default=False)
    source_url = models.URLField("Источник матча", blank=True)
    opponent_logo_url = models.URLField("Лого соперника", blank=True)

    class Meta:
        ordering = ["start_at"]
        verbose_name = "Матч"
        verbose_name_plural = "Матчи"

    def save(self, *args, **kwargs):
        self.sync_localized_fields()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Матч против {self.opponent}"

    @property
    def result_label(self) -> str:
        if self.score_for is None or self.score_against is None:
            return "vs"
        return f"{self.score_for}:{self.score_against}"


class NewsPost(LocalizedFieldsMixin, TimestampedModel):
    localized_fields = (
        "title",
        "excerpt",
        "body",
        "source_name",
    )

    title = models.CharField("Заголовок", max_length=200)
    title_ru = models.CharField("Заголовок (RU)", max_length=200, blank=True, default="")
    title_en = models.CharField("Заголовок (EN)", max_length=200, blank=True, default="")
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    excerpt = models.CharField("Краткое описание", max_length=255)
    excerpt_ru = models.CharField("Краткое описание (RU)", max_length=255, blank=True, default="")
    excerpt_en = models.CharField("Краткое описание (EN)", max_length=255, blank=True, default="")
    body = models.TextField("Текст", blank=True)
    body_ru = models.TextField("Текст (RU)", blank=True, default="")
    body_en = models.TextField("Текст (EN)", blank=True, default="")
    cover = models.ImageField("Обложка", upload_to="news/", blank=True)
    remote_cover_url = models.URLField("Внешняя обложка", blank=True)
    published_at = models.DateTimeField("Дата публикации")
    featured = models.BooleanField("Показывать на главной", default=False)
    source_name = models.CharField("Источник", max_length=120, blank=True)
    source_name_ru = models.CharField("Источник (RU)", max_length=120, blank=True, default="")
    source_name_en = models.CharField("Источник (EN)", max_length=120, blank=True, default="")
    source_url = models.URLField("URL источника", blank=True)

    class Meta:
        ordering = ["-published_at"]
        verbose_name = "Новость"
        verbose_name_plural = "Новости"

    def save(self, *args, **kwargs):
        self.sync_localized_fields()
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title

    @property
    def cover_url(self) -> str:
        if self.cover:
            return self.cover.url
        return self.remote_cover_url


class Trophy(LocalizedFieldsMixin, TimestampedModel):
    localized_fields = ("title", "description")

    title = models.CharField("Трофей", max_length=160)
    title_ru = models.CharField("Трофей (RU)", max_length=160, blank=True, default="")
    title_en = models.CharField("Трофей (EN)", max_length=160, blank=True, default="")
    season = models.CharField("Сезон", max_length=50)
    description = models.CharField("Описание", max_length=255)
    description_ru = models.CharField("Описание (RU)", max_length=255, blank=True, default="")
    description_en = models.CharField("Описание (EN)", max_length=255, blank=True, default="")

    class Meta:
        ordering = ["-season", "title"]
        verbose_name = "Трофей"
        verbose_name_plural = "Трофеи"

    def save(self, *args, **kwargs):
        self.sync_localized_fields()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.title} {self.season}"


class GalleryItem(LocalizedFieldsMixin, TimestampedModel):
    localized_fields = ("title", "caption", "accent", "source_name")

    class Category(models.TextChoices):
        MATCHDAY = "matchday", "Матч-дэй"
        TRAINING = "training", "Тренировка"
        COMMUNITY = "community", "Сообщество"

    title = models.CharField("Название", max_length=160)
    title_ru = models.CharField("Название (RU)", max_length=160, blank=True, default="")
    title_en = models.CharField("Название (EN)", max_length=160, blank=True, default="")
    category = models.CharField(max_length=20, choices=Category.choices)
    caption = models.CharField("Подпись", max_length=255)
    caption_ru = models.CharField("Подпись (RU)", max_length=255, blank=True, default="")
    caption_en = models.CharField("Подпись (EN)", max_length=255, blank=True, default="")
    image = models.ImageField("Изображение", upload_to="gallery/", blank=True)
    remote_image_url = models.URLField("Внешнее изображение", blank=True)
    accent = models.CharField("Акцентный текст", max_length=80, blank=True)
    accent_ru = models.CharField("Акцентный текст (RU)", max_length=80, blank=True, default="")
    accent_en = models.CharField("Акцентный текст (EN)", max_length=80, blank=True, default="")
    source_name = models.CharField("Источник", max_length=120, blank=True)
    source_name_ru = models.CharField("Источник (RU)", max_length=120, blank=True, default="")
    source_name_en = models.CharField("Источник (EN)", max_length=120, blank=True, default="")
    source_url = models.URLField("URL источника", blank=True)

    class Meta:
        verbose_name = "Медиа-элемент"
        verbose_name_plural = "Медиа-элементы"

    def save(self, *args, **kwargs):
        self.sync_localized_fields()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title

    @property
    def image_url(self) -> str:
        if self.image:
            return self.image.url
        return self.remote_image_url
