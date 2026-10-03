import { categories, type CategorySlug, type Story } from "@/lib/data";
import { categoryPool } from "@/lib/categories.mjs";
import messages from "@/lib/messages.json";
import { positioning } from "@/lib/site-brand";
import { responsiveImageProps } from "@/lib/image-assets";

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
  const props = responsiveImageProps(story.image, variant);
  return <img {...props} src={props.src} alt={story.imageAlt} loading={variant === "feature" ? "eager" : "lazy"} fetchPriority={variant === "feature" ? "high" : undefined} decoding={variant === "feature" ? "sync" : "async"} className={`story-cover ref-image ${className}`} />;
}

function Meta({ story, category, copy, compact = false }: { story: Story; category: string; copy: HomeCopy; compact?: boolean }) {
  return <p className="ref-meta"><span className="ref-meta-accent">{category}</span><span>/</span><span>{story.displayDate}</span>{compact ? null : <><span>/</span><span>{story.readTime} {copy.minutes}</span></>}</p>;
}

function SectionBar({ eyebrow, title, href, copy, prefix }: { eyebrow?: string; title: string; href?: string; copy: HomeCopy; prefix: string }) {
  return <div className="ref-section-bar"><div>{eyebrow ? <p className="ref-kicker">{eyebrow}</p> : null}<h2 className="ref-section-title">{title}</h2></div>{href ? <a href={withPrefix(prefix, href)} className="ref-see-all">{copy.seeAll} <span aria-hidden="true">→</span></a> : null}</div>;
}

function CompactStory({ story, copy, prefix, category }: { story: Story; copy: HomeCopy; prefix: string; category: string }) {
  return <a href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-compact-story"><span className="ref-bullet"/><span className="ref-compact-body"><strong>{story.title}</strong><Meta story={story} category={category} copy={copy} compact/></span></a>;
}

function CardStory({ story, copy, prefix, category, square = false }: { story: Story; copy: HomeCopy; prefix: string; category: string; square?: boolean }) {
  return <a href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-card-story"><div className={`ref-card-image ${square ? "ref-card-image-square" : ""}`}><ImageStory story={story}/></div><Meta story={story} category={category} copy={copy} compact/><h3 className="ref-card-title">{story.title}</h3><p className="ref-card-dek">{story.dek}</p></a>;
}

function ArchiveCard({ story, copy, prefix }: { story: Story; copy: HomeCopy; prefix: string }) {
  return <a href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-archive-card"><div className="ref-archive-image"><ImageStory story={story}/></div><Meta story={story} category={copy.categoryNames[story.category]} copy={copy} compact/><h3 className="ref-archive-title">{story.title}</h3><p className="ref-archive-time">{story.displayDate} / {story.readTime} {copy.minutes}</p></a>;
}

function takeRemaining(ordered: Story[], used: Set<string>, count: number, category?: CategorySlug) {
  const selected = ordered.filter((story) => (!category || story.category === category) && !used.has(story.slug)).slice(0, count);
  selected.forEach((story) => used.add(story.slug));
  return selected;
}

export function ReferenceHome({ stories, locale, prefix = "/zh-CN" }: { stories: Story[]; locale: string; prefix?: string }) {
  const language = localeKey(locale);
  const text = copy[language];
  const ordered = sortStories(stories);
  const hero = ordered[0];
  if (!hero) return <main className="reference-home">
    <h1 className="sr-only">{text.brandName} — {text.latestStories}</h1>
    <section className="ref-empty layout-wide px-5 pt-8 lg:px-8">
      <div className="ref-empty-inner">
        <p className="ref-kicker">{text.archive}</p>
        <h2 className="ref-feature-title">{text.emptyTitle}</h2>
        <p className="ref-empty-description">{text.emptyDescription}</p>
      </div>
    </section>
    <section className="ref-newsletter layout-wide px-5 pt-[var(--space-section)] lg:px-8" aria-labelledby="newsletter-heading"><div className="ref-newsletter-inner"><div><p className="ref-kicker">{text.newsletter}</p><h2 id="newsletter-heading" className="ref-newsletter-title">{text.newsletterTitle}</h2></div><div className="ref-newsletter-action"><p>{text.newsletterDescription}</p><a href={withPrefix(prefix, "/rss.xml")} className="ref-newsletter-button">{text.subscribe} <span aria-hidden="true">→</span></a><small>{text.rssNote}</small></div></div></section>
  </main>;

  const used = new Set<string>([hero.slug]);
  const latest = takeRemaining(ordered, used, 6);
  const picks = categories.flatMap(category => takeRemaining(ordered, used, 1, category.slug)).slice(0,4);
  const techIndex = categoryPool(ordered, "technology", 5);
  const businessStories = categoryPool(ordered, "business", 4);
  const innovationStories = categoryPool(ordered, "innovation", 5);
  const deep = innovationStories[0];
  const techDetails = categoryPool(ordered, "technology", 8);
  const beatColumns = categories.map(category => ({category:category.slug,title:text.categoryNames[category.slug],stories:categoryPool(ordered,category.slug,3)}));
  const additionalDesks = beatColumns.filter(({category}) => ["work-life","current-affairs","energy"].includes(category));

  return <main className="reference-home">
    <h1 className="sr-only">{text.brandName} — {positioning[language]}</h1>

    <section className="ref-home-hero layout-wide px-5 pt-8 lg:px-8" aria-labelledby="latest-heading">
      <div className="ref-hero-grid">
        <aside className="ref-latest" aria-labelledby="latest-heading">
          <h2 id="latest-heading" className="ref-kicker ref-heading-small">{text.latest}</h2>
          <div className="ref-rule" />
          {latest.map((story) => <CompactStory key={story.slug} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]}/>)}
        </aside>

        <article className="ref-hero-story">
          <a href={withPrefix(prefix, `/post/${encodeURIComponent(hero.slug)}/`)} className="ref-hero-link">
            <div className="ref-hero-image"><ImageStory story={hero} variant="feature"/></div>
            <Meta story={hero} category={text.categoryNames[hero.category]} copy={text}/>
            <h2 className="ref-hero-title">{hero.title}</h2>
            <p className="ref-hero-dek">{hero.dek}</p>
            <p className="ref-byline"><strong>{text.by} {hero.author}</strong><span>/</span><span>{hero.displayDate}</span><span>/</span><span>{hero.readTime} {text.minutes}</span></p>
          </a>
        </article>

        <aside className="ref-picks" aria-labelledby="picks-heading">
          <p className="ref-kicker">{text.curated}</p>
          <h2 id="picks-heading" className="ref-heading-small">{text.editorPicks}</h2>
          <div className="ref-rule" />
          {picks.map((story) => <a key={story.slug} href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-pick-story"><div className="ref-pick-image"><ImageStory story={story} variant="thumbnail"/></div><span className="ref-pick-body"><Meta story={story} category={text.categoryNames[story.category]} copy={text} compact/><strong>{story.title}</strong><span className="ref-pick-time">{story.displayDate} / {story.readTime} {text.minutes}</span></span></a>)}
        </aside>
      </div>

      <div className="ref-four-up">
        {[...innovationStories.slice(0, 1), ...techIndex.slice(0, 1), ...businessStories.slice(0, 1), ...picks.slice(0, 1)].map((story) => <CardStory key={`top-${story.slug}`} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]} square/>) }
      </div>
    </section>

    {techIndex.length || businessStories.length ? <section className="ref-section layout-wide px-5 lg:px-8" aria-labelledby={techIndex.length ? "tech-index-heading" : "business-heading"}>
      <div className="ref-two-column">
        {techIndex.length ? <div data-category-section="technology">
          <SectionBar eyebrow={text.techIndex} title={text.techIndexTitle} href="/category/technology/" copy={text} prefix={prefix}/>
          <div className="ref-rank-list" id="tech-index-heading">{techIndex.map((story, index) => <a key={`rank-${story.slug}`} href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-rank-story"><span className="ref-rank-number">{String(index + 1).padStart(2, "0")}</span><span><Meta story={story} category={text.categoryNames[story.category]} copy={text} compact/><strong>{story.title}</strong><small>{story.displayDate} / {story.readTime} {text.minutes}</small></span></a>)}</div>
        </div> : null}
        {businessStories.length ? <div id="business-heading" data-category-section="business">
          <SectionBar eyebrow={text.business} title={text.businessTitle} href="/category/business/" copy={text} prefix={prefix}/>
          <div className="ref-business-grid">{businessStories.map((story) => <CardStory key={`business-${story.slug}`} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]}/>)}</div>
        </div> : null}
      </div>
    </section> : null}

    {deep ? <section className="ref-section layout-wide px-5 lg:px-8" aria-labelledby="innovation-heading" data-category-section="innovation">
      <SectionBar eyebrow={text.innovation} title={text.innovationTitle} href="/category/innovation/" copy={text} prefix={prefix}/>
      <div className="ref-innovation-grid">
        <article className="ref-innovation-feature"><a href={withPrefix(prefix, `/post/${encodeURIComponent(deep.slug)}/`)}><div className="ref-innovation-image"><ImageStory story={deep} variant="feature"/></div><Meta story={deep} category={text.categoryNames[deep.category]} copy={text}/><h3 id="innovation-heading" className="ref-feature-title">{deep.title}</h3><p className="ref-feature-dek">{deep.dek}</p></a></article>
        <aside className="ref-quick-scan"><p className="ref-kicker">{text.quickScan}</p><div className="ref-rule"/>{innovationStories.slice(1, 5).map((story) => <a key={`scan-${story.slug}`} href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-scan-story"><div className="ref-scan-image"><ImageStory story={story} variant="thumbnail"/></div><span><Meta story={story} category={text.categoryNames[story.category]} copy={text} compact/><strong>{story.title}</strong><small>{story.displayDate} / {story.readTime} {text.minutes}</small></span></a>)}</aside>
      </div>
    </section> : null}

    {additionalDesks.filter(desk => desk.stories.length).map(({category,title,stories:categoryStories}) => <section key={category} className="ref-section layout-wide px-5 lg:px-8" aria-label={title} data-category-section={category}>
      <SectionBar eyebrow={text.beats} title={title} href={`/category/${category}/`} copy={text} prefix={prefix}/>
      <div className="ref-archive-grid">{categoryStories.map(story => <CardStory key={story.slug} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]}/>)}</div>
    </section>)}

    <section className="ref-section ref-beats layout-wide px-5 lg:px-8" aria-labelledby="beats-heading">
      <p className="ref-kicker">{text.beats}</p><h2 id="beats-heading" className="ref-feature-title ref-beats-title">{text.beatsTitle}</h2><p className="ref-beats-description">{text.beatsDescription}</p>
      <div className="ref-beats-grid">{beatColumns.map(({ category, title, stories: categoryStories }) => <div key={category} className="ref-beat-column" data-category-section={category}><h3 className="ref-kicker"><a href={withPrefix(prefix, `/category/${category}/`)}>{title}</a></h3>{categoryStories.length ? categoryStories.map((story) => <a key={story.slug} href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-beat-story"><strong>{story.title}</strong><small>{story.displayDate} / {story.readTime} {text.minutes}</small></a>) : <p className="mt-3 text-sm leading-6 text-muted-foreground">{text.sectionEmpty}</p>}</div>)}</div>
    </section>

    {techDetails.length > 1 ? <section className="ref-section layout-wide px-5 lg:px-8" aria-label={text.techIndexTitle} data-category-section="technology">
      <SectionBar eyebrow={text.techIndex} title={text.techIndexTitle} href="/category/technology/" copy={text} prefix={prefix}/>
      <div className="ref-tech-feature-grid">{techDetails.slice(0, 2).map((story) => <article key={`tech-feature-${story.slug}`} className="ref-tech-feature"><a href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)}><div className="ref-tech-feature-image"><ImageStory story={story} variant="feature"/></div><Meta story={story} category={text.categoryNames[story.category]} copy={text}/><h3 className="ref-feature-title">{story.title}</h3><p className="ref-feature-dek">{story.dek}</p><p className="ref-byline"><strong>{text.by} {story.author}</strong><span>{story.displayDate} / {story.readTime} {text.minutes}</span></p></a></article>)}<aside className="ref-tech-side">{techDetails.slice(2, 4).map((story) => <CardStory key={`tech-side-${story.slug}`} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]}/>)}</aside></div>
      <div className="ref-five-up">{techDetails.slice(4, 9).map((story) => <CardStory key={`tech-grid-${story.slug}`} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]}/>)}</div>
    </section> : null}

    <section className="ref-newsletter layout-wide px-5 pt-[var(--space-section)] lg:px-8" aria-labelledby="newsletter-heading"><div className="ref-newsletter-inner"><div><p className="ref-kicker">{text.newsletter}</p><h2 id="newsletter-heading" className="ref-newsletter-title">{text.newsletterTitle}</h2></div><div className="ref-newsletter-action"><p>{text.newsletterDescription}</p><a href={withPrefix(prefix, "/rss.xml")} className="ref-newsletter-button">{text.subscribe} <span aria-hidden="true">→</span></a><small>{text.rssNote}</small></div></div></section>

    <section className="ref-section ref-archive layout-wide px-5 lg:px-8" aria-labelledby="archive-heading"><SectionBar eyebrow={text.archive} title={text.latestStories} href="/all-news/" copy={text} prefix={prefix}/><div className="ref-archive-grid" id="archive-heading">{ordered.slice(0, 12).map((story) => <ArchiveCard key={story.slug} story={story} copy={text} prefix={prefix}/>)}</div></section>
  </main>;
}

export function referenceCopy(locale: string) {
  return copy[localeKey(locale)];
}
