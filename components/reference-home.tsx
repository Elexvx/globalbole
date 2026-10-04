import { categories, type CategorySlug, type Story } from "@/lib/data";
import { categoryPool } from "@/lib/categories.mjs";
import { planHomeEdition } from "@/lib/home-edition.mjs";
import messages from "@/lib/messages.json";
import { positioning } from "@/lib/site-brand";
import { responsiveImageProps, responsiveAvifSourceProps } from "@/lib/image-assets";

type LocaleKey = "zh-CN" | "zh-TW" | "en" | "ru" | "fr";

type HomeCopy = {
  brandName: string;
  language: string;
  wire: string;
  rss: string;
  subscribe: string;
  allNews: string;
  latest: string;
  curated: string;
  editorPicks: string;
  seeAll: string;
  by: string;
  minutes: string;
  techIndex: string;
  techIndexTitle: string;
  businessTitle: string;
  innovation: string;
  innovationTitle: string;
  quickScan: string;
  beats: string;
  beatsTitle: string;
  beatsDescription: string;
  technology: string;
  business: string;
  newsletter: string;
  newsletterTitle: string;
  newsletterDescription: string;
  rssNote: string;
  emptyTitle: string;
  emptyDescription: string;
  archive: string;
  latestStories: string;
  viewAll: string;
  footerDescription: string;
  sections: string;
  about: string;
  resources: string;
  issues: string;
  privacy: string;
  categoryNames: Record<CategorySlug, string>;
  sectionEmpty: string;
};

function localizedCategoryNames(locale: LocaleKey): Record<CategorySlug,string> {
  return Object.fromEntries(categories.map(category => [category.slug,(messages as Record<string,Record<string,string>>)[category.label][locale]])) as Record<CategorySlug,string>;
}

const copy: Record<LocaleKey, HomeCopy> = {
  "zh-CN": {
    brandName: "全球伯乐 News",
    language: "中文",
    wire: "即时资讯",
    rss: "RSS",
    subscribe: "订阅",
    allNews: "全部文章",
    latest: "最新报道",
    curated: "精选",
    editorPicks: "编辑推荐",
    seeAll: "查看全部",
    by: "作者",
    minutes: "分钟",
    techIndex: "科技",
    techIndexTitle: "技术信号",
    businessTitle: "商业与影响",
    innovation: "创新",
    innovationTitle: "创新现场",
    quickScan: "快速浏览",
    beats: "新闻方向",
    beatsTitle: "每个方向，一眼读懂。",
    beatsDescription: positioning["zh-CN"],
    technology: "科技",
    business: "商业",
    newsletter: "每日简报",
    newsletterTitle: "把重要变化送进你的阅读器。",
    newsletterDescription: positioning["zh-CN"],
    rssNote: "免费 RSS · 不收集邮箱",
    emptyTitle: "暂时还没有文章。",
    emptyDescription: "文章会从 Markdown 内容目录自动生成并显示在这里。",
    archive: "档案",
    latestStories: "最新文章",
    viewAll: "查看全部",
    footerDescription: positioning["zh-CN"],
    sections: "文章分类",
    about: "关于",
    resources: "资源",
    issues: "各期目录",
    privacy: "隐私说明",
    categoryNames: localizedCategoryNames("zh-CN"),
    sectionEmpty: "本栏目暂时还没有文章。",
  },
  "zh-TW": {
    brandName: "全球伯樂 News",
    language: "繁中",
    wire: "即時資訊",
    rss: "RSS",
    subscribe: "訂閱",
    allNews: "全部文章",
    latest: "最新報導",
    curated: "精選",
    editorPicks: "編輯推薦",
    seeAll: "查看全部",
    by: "作者",
    minutes: "分鐘",
    techIndex: "科技",
    techIndexTitle: "技術訊號",
    businessTitle: "商業與影響",
    innovation: "創新",
    innovationTitle: "創新現場",
    quickScan: "快速瀏覽",
    beats: "新聞方向",
    beatsTitle: "每個方向，一眼讀懂。",
    beatsDescription: positioning["zh-TW"],
    technology: "科技",
    business: "商業",
    newsletter: "每日簡報",
    newsletterTitle: "把重要變化送進你的閱讀器。",
    newsletterDescription: positioning["zh-TW"],
    rssNote: "免費 RSS · 不收集信箱",
    emptyTitle: "暫時還沒有文章。",
    emptyDescription: "文章會從 Markdown 內容目錄自動生成並顯示在這裡。",
    archive: "檔案",
    latestStories: "最新文章",
    viewAll: "查看全部",
    footerDescription: positioning["zh-TW"],
    sections: "文章分類",
    about: "關於",
    resources: "資源",
    issues: "各期目錄",
    privacy: "隱私說明",
    categoryNames: localizedCategoryNames("zh-TW"),
    sectionEmpty: "本欄目暫時還沒有文章。",
  },
  en: {
    brandName: "Global Bole News",
    language: "English",
    wire: "THE WIRE",
    rss: "RSS",
    subscribe: "SUBSCRIBE",
    allNews: "ALL NEWS",
    latest: "THE LATEST",
    curated: "CURATED",
    editorPicks: "EDITOR'S PICKS",
    seeAll: "SEE ALL",
    by: "By",
    minutes: "MIN",
    techIndex: "TECHNOLOGY",
    techIndexTitle: "TECH SIGNALS",
    businessTitle: "MONEY & INFLUENCE",
    innovation: "INNOVATION",
    innovationTitle: "THE INNOVATION FILE",
    quickScan: "QUICK SCAN",
    beats: "THE BEATS",
    beatsTitle: "EVERY DESK, AT A GLANCE.",
    beatsDescription: positioning["en"],
    technology: "TECHNOLOGY",
    business: "BUSINESS",
    newsletter: "THE DAILY BRIEF",
    newsletterTitle: "The sharpest read in your feed.",
    newsletterDescription: positioning["en"],
    rssNote: "Free RSS feed · No email collection",
    emptyTitle: "No stories have been filed yet.",
    emptyDescription: "Stories added to the Markdown content directory will appear here automatically.",
    archive: "ARCHIVE",
    latestStories: "LATEST STORIES",
    viewAll: "VIEW ALL",
    footerDescription: positioning["en"],
    sections: "SECTIONS",
    about: "ABOUT",
    resources: "RESOURCES",
    issues: "ISSUES",
    privacy: "PRIVACY",
    categoryNames: localizedCategoryNames("en"),
    sectionEmpty: "No stories in this section yet.",
  },
  ru: {
    brandName: "Global Bole News",
    language: "Русский",
    wire: "СРОЧНО",
    rss: "RSS",
    subscribe: "ПОДПИСАТЬСЯ",
    allNews: "ВСЕ СТАТЬИ",
    latest: "ПОСЛЕДНИЕ НОВОСТИ",
    curated: "ПОДБОРКА",
    editorPicks: "ВЫБОР РЕДАКЦИИ",
    seeAll: "СМОТРЕТЬ ВСЕ",
    by: "Автор",
    minutes: "МИН",
    techIndex: "ТЕХНОЛОГИИ",
    techIndexTitle: "ТЕХНОЛОГИЧЕСКИЕ СИГНАЛЫ",
    businessTitle: "ДЕНЬГИ И ВЛИЯНИЕ",
    innovation: "ИННОВАЦИИ",
    innovationTitle: "ПОЛЕ ИННОВАЦИЙ",
    quickScan: "БЫСТРЫЙ ОБЗОР",
    beats: "НАПРАВЛЕНИЯ",
    beatsTitle: "КАЖДОЕ НАПРАВЛЕНИЕ — С ПЕРВОГО ВЗГЛЯДА.",
    beatsDescription: positioning["ru"],
    technology: "ТЕХНОЛОГИИ",
    business: "БИЗНЕС",
    newsletter: "ЕЖЕДНЕВНАЯ СВОДКА",
    newsletterTitle: "Главное — прямо в вашей ленте.",
    newsletterDescription: positioning["ru"],
    rssNote: "Бесплатный RSS · Без сбора адресов",
    emptyTitle: "Статей пока нет.",
    emptyDescription: "Статьи из каталога Markdown будут автоматически появляться здесь.",
    archive: "АРХИВ",
    latestStories: "ПОСЛЕДНИЕ СТАТЬИ",
    viewAll: "СМОТРЕТЬ ВСЕ",
    footerDescription: positioning["ru"],
    sections: "РАЗДЕЛЫ",
    about: "О НАС",
    resources: "РЕСУРСЫ",
    issues: "ВЫПУСКИ",
    privacy: "КОНФИДЕНЦИАЛЬНОСТЬ",
    categoryNames: localizedCategoryNames("ru"),
    sectionEmpty: "В этом разделе пока нет статей.",
  },
  fr: {
    brandName: "Global Bole News",
    language: "Français",
    wire: "À LA UNE",
    rss: "RSS",
    subscribe: "S'ABONNER",
    allNews: "TOUS LES ARTICLES",
    latest: "LES DERNIÈRES INFOS",
    curated: "SÉLECTION",
    editorPicks: "CHOIX DE LA RÉDACTION",
    seeAll: "VOIR TOUT",
    by: "Par",
    minutes: "MIN",
    techIndex: "TECHNOLOGIE",
    techIndexTitle: "SIGNAUX TECH",
    businessTitle: "ARGENT & INFLUENCE",
    innovation: "INNOVATION",
    innovationTitle: "LE CARNET DE L'INNOVATION",
    quickScan: "EN UN COUP D'ŒIL",
    beats: "LES RUBRIQUES",
    beatsTitle: "CHAQUE AXE, EN UN COUP D'ŒIL.",
    beatsDescription: positioning["fr"],
    technology: "TECHNOLOGIE",
    business: "COMMERCE",
    newsletter: "LA BRÈVE DU JOUR",
    newsletterTitle: "Le meilleur de la lecture, dans votre fil.",
    newsletterDescription: positioning["fr"],
    rssNote: "Flux RSS gratuit · Aucun e-mail collecté",
    emptyTitle: "Aucun article pour le moment.",
    emptyDescription: "Les articles ajoutés au dossier Markdown apparaîtront automatiquement ici.",
    archive: "ARCHIVES",
    latestStories: "DERNIERS ARTICLES",
    viewAll: "VOIR TOUT",
    footerDescription: positioning["fr"],
    sections: "RUBRIQUES",
    about: "À PROPOS",
    resources: "RESSOURCES",
    issues: "ÉDITIONS",
    privacy: "CONFIDENTIALITÉ",
    categoryNames: localizedCategoryNames("fr"),
    sectionEmpty: "Aucun article dans cette rubrique pour le moment.",
  },
};

function localeKey(value: string): LocaleKey {
  return value in copy ? (value as LocaleKey) : "en";
}

function withPrefix(prefix: string, path: string) {
  if (path === "/rss.xml") {
    const locale = prefix.replace(/^\//, "") || "zh-CN";
    return `/feeds/${locale}.xml`;
  }
  if (path === "/") return `${prefix}/`;
  return `${prefix}${path}`;
}

function sortStories(items: Story[]) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

function ImageStory({ story, variant = "card", className = "" }: { story: Story; variant?: "card" | "feature" | "thumbnail"; className?: string }) {
  if (!story.image) return null;
  const props = responsiveImageProps(story.image, variant);
  const avif = responsiveAvifSourceProps(story.image, variant);
  return <picture>{avif ? <source {...avif}/> : null}<img {...props} src={props.src} alt={story.imageAlt} loading={variant === "feature" ? "eager" : "lazy"} fetchPriority={variant === "feature" ? "high" : undefined} decoding={variant === "feature" ? "sync" : "async"} className={`story-cover ref-image ${className}`} /></picture>;
}

function Meta({ story, category, copy, compact = false }: { story: Story; category: string; copy: HomeCopy; compact?: boolean }) {
  return <p className="ref-meta"><span className="ref-meta-accent">{category}</span><span>/</span><span>{story.displayDate}</span>{compact ? null : <><span>/</span><span>{story.readTime} {copy.minutes}</span></>}</p>;
}

function CompactStory({ story, copy, prefix }: { story: Story; copy: HomeCopy; prefix: string }) {
  return <a href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-compact-story" data-story-slug={story.slug}>
    <Meta story={story} category={copy.categoryNames[story.category]} copy={copy} compact/>
    <strong>{story.title}</strong>
  </a>;
}

function Newsletter({ text, prefix }: { text: HomeCopy; prefix: string }) {
  return <section className="ref-newsletter layout-wide px-5 lg:px-8" aria-labelledby="newsletter-heading">
    <div className="ref-newsletter-inner"><div><p className="ref-kicker">{text.newsletter}</p><h2 id="newsletter-heading" className="ref-newsletter-title">{text.newsletterTitle}</h2><p>{text.rssNote}</p></div>
    <a href={withPrefix(prefix, "/rss.xml")} className="ref-newsletter-button">{text.subscribe} <span aria-hidden="true">→</span></a></div>
  </section>;
}

export function ReferenceHome({ stories, locale, prefix = "/zh-CN" }: { stories: Story[]; locale: string; prefix?: string }) {
  const language = localeKey(locale);
  const text = copy[language];
  const ordered = sortStories(stories.filter(story => (story.lang || "en") === language));
  const { hero, supporting, latest, remaining } = planHomeEdition(ordered);
  const desks = categories.map(category => ({ ...category, count: categoryPool(ordered, category.slug).length, stories: categoryPool(remaining, category.slug, 3) }));

  if (!hero) return <main className="reference-home">
    <h1 className="sr-only">{text.brandName} — {text.latestStories}</h1>
    <section className="ref-empty layout-wide px-5 pt-8 lg:px-8"><div className="ref-empty-inner"><p className="ref-kicker">{text.archive}</p><h2>{text.emptyTitle}</h2><p className="ref-empty-description">{text.emptyDescription}</p></div></section>
    <Newsletter text={text} prefix={prefix}/>
  </main>;

  return <main className="reference-home">
    <h1 className="sr-only">{text.brandName} — {positioning[language]}</h1>
    <section className="ref-home-hero layout-wide px-5 lg:px-8" aria-label={text.latestStories}>
      <div className="ref-edition-bar"><p className="ref-kicker">{text.latestStories}</p><a className="ref-see-all" href={withPrefix(prefix, "/all-news/")}>{text.allNews} <span aria-hidden="true">→</span></a></div>
      <div className="ref-hero-grid">
        <article className={hero.image ? "ref-hero-story" : "ref-hero-story ref-story-text-only"} data-story-slug={hero.slug}>
          <a href={withPrefix(prefix, `/post/${encodeURIComponent(hero.slug)}/`)} className="ref-hero-link">
            {hero.image ? <div className="ref-hero-image"><ImageStory story={hero} variant="feature"/></div> : null}
            <Meta story={hero} category={text.categoryNames[hero.category]} copy={text}/>
            <h2 className="ref-hero-title">{hero.title}</h2><p className="ref-hero-dek">{hero.dek}</p>
            <p className="ref-byline">{text.by} {hero.author}</p>
          </a>
        </article>
        {supporting.length ? <div className="ref-supporting">{supporting.map(story => <article key={story.slug} data-story-slug={story.slug}>
          <a className="ref-support-story" href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)}>
            {story.image ? <div className="ref-support-image"><ImageStory story={story}/></div> : null}
            <div><Meta story={story} category={text.categoryNames[story.category]} copy={text} compact/><h3 className="ref-card-title">{story.title}</h3></div>
          </a>
        </article>)}</div> : null}
        {latest.length ? <aside className="ref-latest" aria-labelledby="latest-heading">
          <h2 id="latest-heading" className="ref-heading-small">{text.quickScan}</h2>
          {latest.map(story => <CompactStory key={story.slug} story={story} copy={text} prefix={prefix}/>)}
          <a className="ref-see-all ref-rail-link" href={withPrefix(prefix, "/all-news/")}>{text.seeAll} <span aria-hidden="true">→</span></a>
        </aside> : null}
      </div>
    </section>

    <section className="ref-desks layout-wide px-5 lg:px-8" aria-labelledby="desks-heading">
      <div className="ref-section-bar"><h2 id="desks-heading" className="ref-section-title">{text.sections}</h2><a href={withPrefix(prefix, "/all-news/")} className="ref-see-all">{text.viewAll} <span aria-hidden="true">→</span></a></div>
      <nav className="ref-desk-navigation" aria-label={text.sections}>{desks.map(desk => <a key={desk.slug} href={withPrefix(prefix, `/category/${desk.slug}/`)}>{text.categoryNames[desk.slug]} <span className="ref-desk-count">{desk.count}</span><span aria-hidden="true">↗</span></a>)}</nav>
      <div className="ref-desks-grid">{desks.filter(desk => desk.stories.length).map(({ slug, stories: deskStories }) => <section key={slug} className="ref-desk" data-category-section={slug} aria-labelledby={`desk-${slug}`}>
        <div className="ref-desk-heading"><h3 id={`desk-${slug}`}><a href={withPrefix(prefix, `/category/${slug}/`)}>{text.categoryNames[slug]}</a></h3><a href={withPrefix(prefix, `/category/${slug}/`)} className="ref-desk-more" aria-label={`${text.seeAll} · ${text.categoryNames[slug]}`}><span aria-hidden="true">→</span></a></div>
        {deskStories.length ? deskStories.map((story, index) => <a key={story.slug} data-story-slug={story.slug} href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className={`ref-desk-story ${index === 0 ? "ref-desk-lead" : ""}`}>
          {index === 0 && story.image ? <div className="ref-desk-image"><ImageStory story={story} variant="thumbnail"/></div> : null}
          <div><strong>{story.title}</strong><p className="ref-story-date">{story.displayDate} · {story.readTime} {text.minutes}</p></div>
        </a>) : <p className="ref-desk-empty">{text.sectionEmpty}</p>}
      </section>)}</div>
    </section>
    <Newsletter text={text} prefix={prefix}/>
  </main>;
}

export function referenceCopy(locale: string) {
  return copy[localeKey(locale)];
}
