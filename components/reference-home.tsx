import type { CategorySlug, Story } from "@/lib/data";
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
  beatLabels: [string, string, string, string, string, string];
};

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
    beats: "三大方向",
    beatsTitle: "每个方向，一眼读懂。",
    beatsDescription: "从技术底座、创新方法到商业现场，快速找到今天值得读的变化。",
    technology: "科技",
    business: "商业",
    newsletter: "每日简报",
    newsletterTitle: "把重要变化送进你的阅读器。",
    newsletterDescription: "科技、创新、商业，三个方向读懂变化。",
    rssNote: "免费 RSS · 不收集邮箱",
    archive: "档案",
    latestStories: "最新文章",
    viewAll: "查看全部",
    footerDescription: "专注科技、创新、商业领域。",
    sections: "文章分类",
    about: "关于",
    resources: "资源",
    issues: "各期目录",
    privacy: "隐私说明",
    categoryNames: { technology: "科技", innovation: "创新", business: "商业" },
    beatLabels: ["基础设施", "产品与数据", "社区与协作", "方法与文化", "运营与成本", "市场与供应链"],
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
    beats: "三大方向",
    beatsTitle: "每個方向，一眼讀懂。",
    beatsDescription: "從技術底座、創新方法到商業現場，快速找到今天值得讀的變化。",
    technology: "科技",
    business: "商業",
    newsletter: "每日簡報",
    newsletterTitle: "把重要變化送進你的閱讀器。",
    newsletterDescription: "科技、創新、商業，三個方向讀懂變化。",
    rssNote: "免費 RSS · 不收集信箱",
    archive: "檔案",
    latestStories: "最新文章",
    viewAll: "查看全部",
    footerDescription: "專注科技、創新、商業領域。",
    sections: "文章分類",
    about: "關於",
    resources: "資源",
    issues: "各期目錄",
    privacy: "隱私說明",
    categoryNames: { technology: "科技", innovation: "創新", business: "商業" },
    beatLabels: ["基礎設施", "產品與數據", "社區與協作", "方法與文化", "營運與成本", "市場與供應鏈"],
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
    beatsDescription: "Fast routes through technology, innovation, business, and the decisions behind the headlines.",
    technology: "TECHNOLOGY",
    business: "BUSINESS",
    newsletter: "THE DAILY BRIEF",
    newsletterTitle: "The sharpest read in your feed.",
    newsletterDescription: "Three perspectives: technology, innovation, and business.",
    rssNote: "Free RSS feed · No email collection",
    archive: "ARCHIVE",
    latestStories: "LATEST STORIES",
    viewAll: "VIEW ALL",
    footerDescription: "Technology, innovation, and business reporting for people who move ideas forward.",
    sections: "SECTIONS",
    about: "ABOUT",
    resources: "RESOURCES",
    issues: "ISSUES",
    privacy: "PRIVACY",
    categoryNames: { technology: "TECHNOLOGY", innovation: "INNOVATION", business: "BUSINESS" },
    beatLabels: ["INFRASTRUCTURE", "PRODUCT & DATA", "COMMUNITY & COLLABORATION", "METHOD & CULTURE", "OPERATIONS & COSTS", "MARKETS & SUPPLY CHAINS"],
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
    beats: "ТРИ НАПРАВЛЕНИЯ",
    beatsTitle: "КАЖДОЕ НАПРАВЛЕНИЕ — С ПЕРВОГО ВЗГЛЯДА.",
    beatsDescription: "Быстрый маршрут через технологии, инновации и бизнес, чтобы видеть главное за заголовками.",
    technology: "ТЕХНОЛОГИИ",
    business: "БИЗНЕС",
    newsletter: "ЕЖЕДНЕВНАЯ СВОДКА",
    newsletterTitle: "Главное — прямо в вашей ленте.",
    newsletterDescription: "Три перспективы: технологии, инновации и бизнес.",
    rssNote: "Бесплатный RSS · Без сбора адресов",
    archive: "АРХИВ",
    latestStories: "ПОСЛЕДНИЕ СТАТЬИ",
    viewAll: "СМОТРЕТЬ ВСЕ",
    footerDescription: "Новости технологий, инноваций и бизнеса для тех, кто двигает идеи вперёд.",
    sections: "РАЗДЕЛЫ",
    about: "О НАС",
    resources: "РЕСУРСЫ",
    issues: "ВЫПУСКИ",
    privacy: "КОНФИДЕНЦИАЛЬНОСТЬ",
    categoryNames: { technology: "ТЕХНОЛОГИИ", innovation: "ИННОВАЦИИ", business: "БИЗНЕС" },
    beatLabels: ["ИНФРАСТРУКТУРА", "ПРОДУКТ И ДАННЫЕ", "СООБЩЕСТВА И СОТРУДНИЧЕСТВО", "МЕТОД И КУЛЬТУРА", "ОПЕРАЦИИ И ЗАТРАТЫ", "РЫНКИ И ЦЕПОЧКИ ПОСТАВОК"],
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
    beats: "LES TROIS AXES",
    beatsTitle: "CHAQUE AXE, EN UN COUP D'ŒIL.",
    beatsDescription: "Un parcours rapide à travers la technologie, l'innovation et le commerce pour voir ce qui change.",
    technology: "TECHNOLOGIE",
    business: "COMMERCE",
    newsletter: "LA BRÈVE DU JOUR",
    newsletterTitle: "Le meilleur de la lecture, dans votre fil.",
    newsletterDescription: "Trois regards : technologie, innovation et commerce.",
    rssNote: "Flux RSS gratuit · Aucun e-mail collecté",
    archive: "ARCHIVES",
    latestStories: "DERNIERS ARTICLES",
    viewAll: "VOIR TOUT",
    footerDescription: "L'actualité de la technologie, de l'innovation et du commerce pour faire avancer les idées.",
    sections: "RUBRIQUES",
    about: "À PROPOS",
    resources: "RESSOURCES",
    issues: "ÉDITIONS",
    privacy: "CONFIDENTIALITÉ",
    categoryNames: { technology: "TECHNOLOGIE", innovation: "INNOVATION", business: "COMMERCE" },
    beatLabels: ["INFRASTRUCTURES", "PRODUIT & DONNÉES", "COMMUNAUTÉ & COLLABORATION", "MÉTHODE & CULTURE", "OPÉRATIONS & COÛTS", "MARCHÉS & CHAÎNES D’APPROVISIONNEMENT"],
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

function ImageStory({ story, variant = "card", className = "" }: { story: Story; variant?: "card" | "feature"; className?: string }) {
  const props = responsiveImageProps(story.image, variant === "feature" ? "feature" : "card");
  return <img {...props} src={props.src} alt={story.imageAlt} loading={variant === "feature" ? "eager" : "lazy"} fetchPriority={variant === "feature" ? "high" : undefined} decoding={variant === "feature" ? "sync" : "async"} className={`ref-image ${className}`} />;
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

function categoryPool(ordered: Story[], category: CategorySlug, count: number) {
  return ordered.filter((story) => story.category === category).slice(0, count);
}

export function ReferenceHome({ stories, locale, prefix = "/zh-CN" }: { stories: Story[]; locale: string; prefix?: string }) {
  const language = localeKey(locale);
  const text = copy[language];
  const ordered = sortStories(stories);
  const hero = ordered[0];
  if (!hero) return null;

  const used = new Set<string>([hero.slug]);
  const latest = takeRemaining(ordered, used, 6);
  const picks = [
    ...takeRemaining(ordered, used, 1, "innovation"),
    ...takeRemaining(ordered, used, 1, "technology"),
    ...takeRemaining(ordered, used, 1, "business"),
    ...takeRemaining(ordered, used, 1),
  ];
  const techIndex = takeRemaining(ordered, used, 5, "technology");
  const businessStories = takeRemaining(ordered, used, 4, "business");
  const innovationStories = takeRemaining(ordered, used, 5, "innovation");
  const deep = takeRemaining(ordered, used, 1)[0] || ordered.find((story) => story.slug !== hero.slug) || hero;
  const techDetails = categoryPool(ordered, "technology", 8);
  const beatColumns = [
    { category: "technology" as CategorySlug, title: `${text.technology} · ${text.beatLabels[0]}`, stories: categoryPool(ordered, "technology", 3) },
    { category: "technology" as CategorySlug, title: `${text.technology} · ${text.beatLabels[1]}`, stories: categoryPool(ordered, "technology", 6).slice(3, 6) },
    { category: "innovation" as CategorySlug, title: `${text.innovation} · ${text.beatLabels[2]}`, stories: categoryPool(ordered, "innovation", 3) },
    { category: "innovation" as CategorySlug, title: `${text.innovation} · ${text.beatLabels[3]}`, stories: categoryPool(ordered, "innovation", 6).slice(3, 6) },
    { category: "business" as CategorySlug, title: `${text.business} · ${text.beatLabels[4]}`, stories: categoryPool(ordered, "business", 3) },
    { category: "business" as CategorySlug, title: `${text.business} · ${text.beatLabels[5]}`, stories: categoryPool(ordered, "business", 6).slice(3, 6) },
  ];

  return <main className="reference-home">
    <h1 className="sr-only">{text.brandName} — {text.technology}, {text.innovation}, {text.business}</h1>

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
          {picks.map((story) => <a key={story.slug} href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-pick-story"><div className="ref-pick-image"><ImageStory story={story}/></div><span className="ref-pick-body"><Meta story={story} category={text.categoryNames[story.category]} copy={text} compact/><strong>{story.title}</strong><span className="ref-pick-time">{story.displayDate} / {story.readTime} {text.minutes}</span></span></a>)}
        </aside>
      </div>

      <div className="ref-four-up">
        {[...innovationStories.slice(0, 1), ...techIndex.slice(0, 1), ...businessStories.slice(0, 1), ...picks.slice(0, 1)].map((story) => <CardStory key={`top-${story.slug}`} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]} square/>) }
      </div>
    </section>

    <section className="ref-section layout-wide px-5 lg:px-8" aria-labelledby="tech-index-heading">
      <div className="ref-two-column">
        <div>
          <SectionBar eyebrow={text.techIndex} title={text.techIndexTitle} href="/category/technology/" copy={text} prefix={prefix}/>
          <div className="ref-rank-list" id="tech-index-heading">{[...techIndex, ...categoryPool(ordered, "technology", 5)].slice(0, 5).map((story, index) => <a key={`rank-${story.slug}`} href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-rank-story"><span className="ref-rank-number">{String(index + 1).padStart(2, "0")}</span><span><Meta story={story} category={text.categoryNames[story.category]} copy={text} compact/><strong>{story.title}</strong><small>{story.displayDate} / {story.readTime} {text.minutes}</small></span></a>)}</div>
        </div>
        <div>
          <SectionBar eyebrow={text.business} title={text.businessTitle} href="/category/business/" copy={text} prefix={prefix}/>
          <div className="ref-business-grid">{[...businessStories, ...categoryPool(ordered, "business", 4)].slice(0, 4).map((story) => <CardStory key={`business-${story.slug}`} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]}/>)}</div>
        </div>
      </div>
    </section>

    <section className="ref-section layout-wide px-5 lg:px-8" aria-labelledby="innovation-heading">
      <SectionBar eyebrow={text.innovation} title={text.innovationTitle} href="/category/innovation/" copy={text} prefix={prefix}/>
      <div className="ref-innovation-grid">
        <article className="ref-innovation-feature"><a href={withPrefix(prefix, `/post/${encodeURIComponent(deep.slug)}/`)}><div className="ref-innovation-image"><ImageStory story={deep} variant="feature"/></div><Meta story={deep} category={text.categoryNames[deep.category]} copy={text}/><h3 id="innovation-heading" className="ref-feature-title">{deep.title}</h3><p className="ref-feature-dek">{deep.dek}</p></a></article>
        <aside className="ref-quick-scan"><p className="ref-kicker">{text.quickScan}</p><div className="ref-rule"/>{[...innovationStories, ...categoryPool(ordered, "innovation", 5)].slice(0, 4).map((story) => <a key={`scan-${story.slug}`} href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-scan-story"><div className="ref-scan-image"><ImageStory story={story}/></div><span><Meta story={story} category={text.categoryNames[story.category]} copy={text} compact/><strong>{story.title}</strong><small>{story.displayDate} / {story.readTime} {text.minutes}</small></span></a>)}</aside>
      </div>
    </section>

    <section className="ref-section ref-beats layout-wide px-5 lg:px-8" aria-labelledby="beats-heading">
      <p className="ref-kicker">{text.beats}</p><h2 id="beats-heading" className="ref-feature-title ref-beats-title">{text.beatsTitle}</h2><p className="ref-beats-description">{text.beatsDescription}</p>
      <div className="ref-beats-grid">{beatColumns.map(({ category, title, stories: categoryStories }, index) => <div key={`${category}-${index}`} className="ref-beat-column"><h3 className="ref-kicker">{title}</h3>{categoryStories.map((story) => <a key={`${index}-${story.slug}`} href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)} className="ref-beat-story"><strong>{story.title}</strong><small>{story.displayDate} / {story.readTime} {text.minutes}</small></a>)}</div>)}</div>
    </section>

    <section className="ref-section layout-wide px-5 lg:px-8" aria-labelledby="technology-heading">
      <SectionBar eyebrow={text.techIndex} title={text.techIndexTitle} href="/category/technology/" copy={text} prefix={prefix}/>
      <div className="ref-tech-feature-grid">{techDetails.slice(0, 2).map((story) => <article key={`tech-feature-${story.slug}`} className="ref-tech-feature"><a href={withPrefix(prefix, `/post/${encodeURIComponent(story.slug)}/`)}><div className="ref-tech-feature-image"><ImageStory story={story} variant="feature"/></div><Meta story={story} category={text.categoryNames[story.category]} copy={text}/><h3 className="ref-feature-title">{story.title}</h3><p className="ref-feature-dek">{story.dek}</p><p className="ref-byline"><strong>{text.by} {story.author}</strong><span>{story.displayDate} / {story.readTime} {text.minutes}</span></p></a></article>)}<aside className="ref-tech-side">{techDetails.slice(2, 4).map((story) => <CardStory key={`tech-side-${story.slug}`} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]}/>)}</aside></div>
      <div className="ref-five-up">{techDetails.slice(4, 9).map((story) => <CardStory key={`tech-grid-${story.slug}`} story={story} copy={text} prefix={prefix} category={text.categoryNames[story.category]}/>)}</div>
    </section>

    <section className="ref-newsletter layout-wide px-5 pt-[var(--space-section)] lg:px-8" aria-labelledby="newsletter-heading"><div className="ref-newsletter-inner"><div><p className="ref-kicker">{text.newsletter}</p><h2 id="newsletter-heading" className="ref-newsletter-title">{text.newsletterTitle}</h2></div><div className="ref-newsletter-action"><p>{text.newsletterDescription}</p><a href={withPrefix(prefix, "/rss.xml")} className="ref-newsletter-button">{text.subscribe} <span aria-hidden="true">→</span></a><small>{text.rssNote}</small></div></div></section>

    <section className="ref-section ref-archive layout-wide px-5 lg:px-8" aria-labelledby="archive-heading"><SectionBar eyebrow={text.archive} title={text.latestStories} href="/all-news/" copy={text} prefix={prefix}/><div className="ref-archive-grid" id="archive-heading">{ordered.slice(0, 12).map((story) => <ArchiveCard key={story.slug} story={story} copy={text} prefix={prefix}/>)}</div></section>
  </main>;
}

export function referenceCopy(locale: string) {
  return copy[localeKey(locale)];
}
