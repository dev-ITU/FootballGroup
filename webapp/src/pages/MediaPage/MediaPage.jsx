import { Camera, ImageOff, Newspaper, Quote } from "lucide-react";

import { cn } from "@/shared/lib/cn.js";
import usePageData from "@/features/page-data/usePageData.js";
import { translateGalleryCategory, useI18n } from "@/shared/i18n/index.jsx";
import {
  localizeGalleryItem,
  localizeStory,
} from "@/shared/lib/contentLocalization.js";
import Reveal from "@/shared/ui/Reveal/Reveal.jsx";
import Surface from "@/shared/ui/Surface/Surface.jsx";

function SectionIntro({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-2", className)}>
      <p
        className={cn(
          "m-0 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0d4ea5]",
        )}
      >
        {eyebrow}
      </p>

      <h2
        className={cn(
          "m-0 max-w-[14ch] font-[var(--font-display)] text-[clamp(1.95rem,3.2vw,3.35rem)] leading-[0.96] tracking-[-0.04em] text-[#081f3d]",
          titleClassName,
        )}
      >
        {title}
      </h2>

      {description ? (
        <p className={cn("m-0 max-w-[64ch] text-[15px] leading-7 text-[#5c7599]")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function InfoStat({ label, value, className, labelClassName, valueClassName }) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[22px] border border-[#d7e6f4] bg-white/92 px-4 py-4 shadow-[0_12px_26px_rgba(8,31,61,.05)] backdrop-blur-md",
        className,
      )}
    >
      <div
        className={cn(
          "truncate whitespace-nowrap text-[11px] font-semibold leading-none tracking-[0.01em] text-[#7690ad]",
          labelClassName,
        )}
        title={label}
      >
        {label}
      </div>

      <div
        className={cn(
          "mt-3 font-[var(--font-display)] text-[clamp(1.7rem,2.5vw,2.35rem)] leading-none tracking-[-0.05em] text-[#0b2344]",
          valueClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}

function EmptyStateCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  className,
  dark = false,
}) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-[30px] border p-6",
        dark
          ? "border-white/12 bg-[linear-gradient(180deg,rgba(11,39,82,.98),rgba(8,28,60,.98))] text-white shadow-[0_24px_54px_rgba(8,31,61,.20)]"
          : "border-[#dce8f4] bg-[linear-gradient(180deg,rgba(255,255,255,.96),rgba(238,246,253,.96))] text-[#0b2344] shadow-[0_16px_38px_rgba(8,31,61,.07)]",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute right-[-28px] top-[-28px] h-32 w-32 rounded-full blur-2xl",
          dark ? "bg-cyan-300/10" : "bg-[#8fdcff]/20",
        )}
      />

      <div className={cn("relative z-[1]")}>
        <div
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-[16px] border",
            dark
              ? "border-white/12 bg-white/10 text-white"
              : "border-[#d8e7f5] bg-white text-[#0d4ea5]",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>

        <div
          className={cn(
            "mt-4 text-[10px] font-extrabold uppercase tracking-[0.18em]",
            dark ? "text-white/56" : "text-[#6d86a6]",
          )}
        >
          {eyebrow}
        </div>

        <h3
          className={cn(
            "mt-2 max-w-[14ch] font-[var(--font-display)] text-[clamp(1.55rem,2.1vw,2rem)] leading-[0.94] tracking-[-0.04em]",
            dark ? "text-white" : "text-[#112a4c]",
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "mt-3 max-w-[38ch] text-[14px] leading-6",
            dark ? "text-white/72" : "text-[#6180a3]",
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function HeroFeatureCard({ story, className }) {
  const { t } = useI18n();
  if (!story) return null;

  const hasImage = Boolean(story.cover_url);
  const title = story.title || t("media.storyLeadDefault");
  const excerpt = story.excerpt || t("media.storyLeadExcerpt");
  const publishedLabel = story.published_label || t("media.storyLeadLabel");
  return (
    <article
      className={cn(
        "group relative min-h-[430px] overflow-hidden rounded-[34px] border border-white/12 bg-[linear-gradient(180deg,#1557ad_0%,#0e3f80_35%,#0a2f63_68%,#082349_100%)] shadow-[0_28px_72px_rgba(8,31,61,.20)] md:min-h-[520px]",
        className,
      )}
    >
      {hasImage ? (
        <img
          src={story.cover_url}
          alt={title}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]",
          )}
        />
      ) : null}

      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(143,220,255,.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.08),transparent_24%),linear-gradient(180deg,rgba(7,24,50,.08)_0%,rgba(7,24,50,.18)_28%,rgba(7,24,50,.82)_100%)]",
        )}
      />

      <div
        className={cn(
          "pointer-events-none absolute left-5 top-5 h-28 w-28 rounded-full bg-cyan-200/12 blur-2xl",
        )}
      />

      <div className={cn("relative z-[1] flex h-full flex-col p-6 md:p-7")}>
        <div
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/78 backdrop-blur-md",
          )}
        >
          <Quote className="h-3.5 w-3.5" strokeWidth={1.9} />
          {publishedLabel}
        </div>

        <h3
          className={cn(
            "mt-5 max-w-[11ch] font-[var(--font-display)] text-[clamp(2.25rem,3.9vw,4rem)] leading-[0.93] tracking-[-0.055em] text-white [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [-webkit-line-clamp:4]",
          )}
        >
          {title}
        </h3>

        <div
          className={cn(
            "mt-auto rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.06))] p-4 shadow-[0_16px_40px_rgba(3,16,38,.18)] backdrop-blur-xl md:p-5",
          )}
        >
          <p
            className={cn(
              "text-[15px] leading-7 text-white/76 [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [-webkit-line-clamp:2]",
            )}
          >
            {excerpt}
          </p>
        </div>
      </div>
    </article>
  );
}

function HeroMiniCard({ story, className }) {
  const { t } = useI18n();
  if (!story) return null;

  const hasImage = Boolean(story.cover_url);
  const title = story.title || t("media.sideMaterial");
  const publishedLabel = story.published_label || t("media.story");
  return (
    <article
      className={cn(
        "group relative min-h-[248px] overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,#1557ad_0%,#0e3f80_35%,#0a2f63_68%,#082349_100%)] shadow-[0_24px_58px_rgba(8,31,61,.18)]",
        className,
      )}
    >
      {hasImage ? (
        <img
          src={story.cover_url}
          alt={title}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]",
          )}
        />
      ) : null}

      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(143,220,255,.18),transparent_32%),linear-gradient(180deg,rgba(7,24,50,.08)_0%,rgba(7,24,50,.22)_38%,rgba(7,24,50,.88)_100%)]",
        )}
      />

      <div className={cn("relative z-[1] flex h-full flex-col p-6")}>
        <div
          className={cn(
            "text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70",
          )}
        >
          {publishedLabel}
        </div>

        <h3
          className={cn(
            "mt-4 max-w-[10ch] font-[var(--font-display)] text-[clamp(1.65rem,2.2vw,2.2rem)] leading-[0.95] tracking-[-0.045em] text-white [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [-webkit-line-clamp:3]",
          )}
        >
          {title}
        </h3>
      </div>
    </article>
  );
}

function NewsCardVisual({ story }) {
  const { t } = useI18n();
  const hasImage = Boolean(story?.cover_url);
  const chipLabel = t("media.newsChipDefault");

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-t-[30px] border-b border-[#e5eff8] bg-[linear-gradient(180deg,#dceaf6_0%,#eef5fb_100%)]",
        "h-[220px] md:h-[236px]",
      )}
    >
      {hasImage ? (
        <>
          <img
            src={story.cover_url}
            alt={story.title || t("media.newsFallbackTitle")}
            className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.02),rgba(7,31,67,.10))]" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,210,255,.20),transparent_34%),linear-gradient(180deg,#dceaf6_0%,#eef5fb_100%)]" />
          <div className="pointer-events-none absolute right-[-24px] top-[-24px] h-28 w-28 rounded-full bg-[#8fdcff]/18 blur-2xl" />
        </>
      )}

      <div className="absolute left-5 top-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#d8e7f5] bg-white/88 px-3 py-2 text-[12px] font-semibold text-[#285489] shadow-[0_8px_20px_rgba(8,31,61,.04)] backdrop-blur-md">
          <Newspaper className="h-4 w-4" strokeWidth={1.8} />
          {chipLabel}
        </div>
      </div>
    </div>
  );
}

function NewsCard({ story }) {
  const { t } = useI18n();
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/88 shadow-[0_18px_46px_rgba(8,31,61,.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5",
      )}
    >
      <NewsCardVisual story={story} />

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#6f87a8]">
          {story?.published_label || t("media.newsFallbackLabel")}
        </div>

        <h3 className="mt-3 min-h-[5.4rem] font-[var(--font-display)] text-[clamp(1.45rem,1.9vw,1.95rem)] leading-[0.95] tracking-[-0.04em] text-[#122c4f] [display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {story?.title || t("media.newsFallbackTitle")}
        </h3>

        <p className="mt-3 min-h-[4.9rem] text-[15px] leading-7 text-[#617fa2] [display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {story?.excerpt || t("media.newsFallbackExcerpt")}
        </p>
      </div>
    </article>
  );
}

function GalleryCard({ item, featured = false }) {
  const { language, t } = useI18n();
  const hasImage = Boolean(item?.image_url);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,#154b93_0%,#0d356c_55%,#082349_100%)] shadow-[0_24px_60px_rgba(8,31,61,.18)]",
        featured
          ? "min-h-[320px] md:min-h-[620px]"
          : "min-h-[280px] md:min-h-[300px]",
      )}
    >
      {hasImage ? (
        <img
          src={item.image_url}
          alt={item.title || t("common.gallery")}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]",
          )}
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(143,220,255,.24),transparent_30%),linear-gradient(180deg,#1557ad_0%,#0d3f80_34%,#0a2f63_68%,#082349_100%)]",
          )}
        />
      )}

      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,50,.04)_0%,rgba(7,24,50,.18)_40%,rgba(7,24,50,.86)_100%)]",
        )}
      />

      <div className={cn("absolute inset-x-0 bottom-0 z-[1] p-5 md:p-6")}>
        <div
          className={cn(
            "text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/68",
          )}
        >
          {item?.accent || translateGalleryCategory(language, item?.category, item?.category_label) || t("common.gallery")}
        </div>

        <h3
          className={cn(
            "mt-2 font-[var(--font-display)] leading-[0.94] tracking-[-0.04em] text-white",
            featured
              ? "max-w-[12ch] text-[clamp(1.9rem,2.7vw,3rem)]"
              : "max-w-[14ch] text-[clamp(1.3rem,1.9vw,1.85rem)]",
          )}
        >
          {item?.title || t("media.galleryFallbackTitle")}
        </h3>

        {item?.caption ? (
          <p
            className={cn(
              "mt-3 max-w-[48ch] text-[14px] leading-6 text-white/74 [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden",
              featured ? "[-webkit-line-clamp:3]" : "[-webkit-line-clamp:2]",
            )}
          >
            {item.caption}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function MediaPage() {
  const { data } = usePageData();
  const { language, t } = useI18n();

  const leadStory = data?.lead_story ? localizeStory(data.lead_story, language) : null;
  const newsItems = Array.isArray(data?.news_items)
    ? data.news_items.map((story) => localizeStory(story, language))
    : [];
  const galleryItems = Array.isArray(data?.gallery_items)
    ? data.gallery_items.map((item) => localizeGalleryItem(item, language))
    : [];

  const sideStories = newsItems.slice(1, 3);

  return (
    <>
      <Reveal y={18} duration={0.45}>
        <section className={cn("mt-3")}>
          <Surface
            padding="none"
            radius="2xl"
            className={cn(
              "overflow-hidden border-[#d9e7f4] bg-[linear-gradient(180deg,rgba(249,252,255,.96)_0%,rgba(237,245,253,.98)_100%)] shadow-[0_24px_62px_rgba(56,99,146,.12)]",
            )}
          >
            <div className={cn("grid gap-5 p-4 md:p-5 xl:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] xl:p-6")}>
              <div
                className={cn(
                  "relative overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,.92),rgba(243,249,255,.9))] p-6 shadow-[0_18px_42px_rgba(8,31,61,.05)] md:p-8",
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(108,197,255,.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.76),transparent_30%)]",
                  )}
                />

                <div
                  className={cn(
                    "pointer-events-none absolute right-[12%] top-[8%] h-[220px] w-[220px] rounded-full border border-[#0d4ea5]/[0.04]",
                  )}
                />
                <div
                  className={cn(
                    "pointer-events-none absolute right-[17%] top-[13%] h-[150px] w-[150px] rounded-full border border-[#0d4ea5]/[0.03]",
                  )}
                />

                <div className={cn("relative z-[1]")}>
                  <div
                    className={cn(
                      "inline-flex min-h-10 items-center rounded-full border border-white/80 bg-white/90 px-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0d4ea5] shadow-[0_10px_24px_rgba(8,31,61,.04)] backdrop-blur-md",
                    )}
                  >
                    {t("media.badge")}
                  </div>

                  <h1
                    className={cn(
                      "mt-5 max-w-[6ch] font-[var(--font-display)] text-[clamp(3rem,5.2vw,5.4rem)] leading-[0.84] tracking-[-0.07em] text-[#0b2344]",
                    )}
                  >
                    {t("media.heroTitle")}
                  </h1>

                  <p
                    className={cn(
                      "mt-5 max-w-[44ch] text-[16px] leading-8 text-[#5f7899]",
                    )}
                  >
                    {t("media.heroDescription")}
                  </p>

                  <div className={cn("mt-8 grid gap-3 sm:grid-cols-3")}>
                    <InfoStat
                      label={t("common.mainFeature")}
                      value={leadStory ? "01" : "—"}
                    />
                    <InfoStat
                      label={t("common.publications")}
                      value={String(newsItems.length)}
                    />
                    <InfoStat
                      label={t("common.photoStories")}
                      value={String(galleryItems.length)}
                    />
                  </div>
                </div>
              </div>

              <div className={cn("grid gap-4 xl:grid-cols-[minmax(0,1fr)_308px]")}>
                {leadStory ? (
                  <HeroFeatureCard story={leadStory} />
                ) : (
                  <EmptyStateCard
                    icon={Newspaper}
                    eyebrow={t("media.emptyLeadEyebrow")}
                    title={t("media.emptyLeadTitle")}
                    description={t("media.emptyLeadDescription")}
                    className={cn("min-h-[430px] md:min-h-[520px]")}
                    dark
                  />
                )}

                <div className={cn("grid gap-4 auto-rows-fr")}>
                  {sideStories.length ? (
                    sideStories.map((story) => (
                      <HeroMiniCard key={story.id} story={story} />
                    ))
                  ) : (
                    <>
                      <EmptyStateCard
                        icon={Newspaper}
                        eyebrow={t("media.emptyStreamEyebrow")}
                        title={t("media.emptyStreamTitle")}
                        description={t("media.emptyStreamDescription")}
                        dark
                      />
                      <EmptyStateCard
                        icon={Camera}
                        eyebrow={t("media.emptyUpdateEyebrow")}
                        title={t("media.emptyUpdateTitle")}
                        description={t("media.emptyUpdateDescription")}
                        dark
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </Surface>
        </section>
      </Reveal>

      <Reveal y={22} duration={0.5}>
        <section className={cn("mt-8")}>
          <Surface
            variant="transparent"
            padding="lg"
            radius="xl"
            className={cn(
              "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(255,255,255,.22),transparent_28%)]",
            )}
          >
            <SectionIntro
              eyebrow={t("media.newsEyebrow")}
              title={t("media.newsTitle")}
            />

            {newsItems.length ? (
              <div className={cn("grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3")}>
                {newsItems.map((story) => (
                  <NewsCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <EmptyStateCard
                icon={Newspaper}
                eyebrow={t("media.newsEmptyEyebrow")}
                title={t("media.newsEmptyTitle")}
                description={t("media.newsEmptyDescription")}
                className={cn("min-h-[280px]")}
              />
            )}
          </Surface>
        </section>
      </Reveal>

      <Reveal y={22} duration={0.52}>
        <section className={cn("mt-8")}>
          <Surface
            variant="transparent"
            padding="lg"
            radius="xl"
            className={cn(
              "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(255,255,255,.22),transparent_28%)]",
            )}
          >
            <SectionIntro
              eyebrow={t("media.galleryEyebrow")}
              title={t("media.galleryTitle")}
            />

            {galleryItems.length ? (
              <div className={cn("grid gap-5 md:grid-cols-2 xl:grid-cols-3")}>
                {galleryItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(index === 0 && "md:col-span-2 md:row-span-2")}
                  >
                    <GalleryCard item={item} featured={index === 0} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyStateCard
                icon={ImageOff}
                eyebrow={t("media.galleryEmptyEyebrow")}
                title={t("media.galleryEmptyTitle")}
                description={t("media.galleryEmptyDescription")}
                className={cn("min-h-[280px]")}
              />
            )}
          </Surface>
        </section>
      </Reveal>
    </>
  );
}
