// Scope descriptions are editorial context, not an indexing score. Keep every
// existing tag route: one article or shared membership is not proof of duplication.
const topics = [
  {
    labels: ['人工智能', '人工智慧', 'Artificial intelligence', 'Искусственный интеллект', 'Intelligence artificielle'],
    copy: {
      'zh-CN': '关注人工智能模型、产品与应用，区分受控测试、实际部署和商业影响。',
      'zh-TW': '關注人工智慧模型、產品與應用，區分受控測試、實際部署和商業影響。',
      en: 'Coverage of AI models, products and applications, distinguishing controlled tests from deployment and business effects.',
      ru: 'Материалы о моделях, продуктах и применении ИИ с разграничением контролируемых испытаний, внедрения и влияния на бизнес.',
      fr: 'Modèles, produits et applications de l’IA, en distinguant les essais contrôlés, le déploiement et les effets économiques.',
    },
  },
  {
    labels: ['储能', '儲能', 'Energy storage', 'Накопление энергии', 'Stockage d’énergie'],
    copy: {
      'zh-CN': '关注储能技术、项目和电力系统作用，区分额定容量、运行表现与经济价值。',
      'zh-TW': '關注儲能技術、專案和電力系統作用，區分額定容量、運行表現與經濟價值。',
      en: 'Energy-storage technology, projects and power-system applications, distinguishing rated capacity, operating performance and economic value.',
      ru: 'Технологии и проекты накопления энергии и их роль в энергосистеме: номинальная мощность, работа и экономическая ценность рассматриваются отдельно.',
      fr: 'Technologies, projets et usages du stockage d’énergie, en distinguant capacité nominale, fonctionnement et valeur économique.',
    },
  },
  {
    labels: ['就业', '就業', 'Employment', 'Занятость', 'Emploi'],
    copy: {
      'zh-CN': '关注就业数据、招聘计划与劳动市场变化，区分宣布的岗位、实际就业和技能需求。',
      'zh-TW': '關注就業數據、招聘計畫與勞動市場變化，區分宣布的職位、實際就業和技能需求。',
      en: 'Employment data, hiring plans and labor-market change, separating announced positions, measured employment and skills needs.',
      ru: 'Данные о занятости, планы найма и изменения рынка труда с разграничением объявленных вакансий, фактической занятости и потребности в навыках.',
      fr: 'Données sur l’emploi, projets de recrutement et marché du travail, en distinguant postes annoncés, emploi mesuré et besoins en compétences.',
    },
  },
  {
    labels: ['供应链', '供應鏈', 'Supply chains', 'Цепочки поставок', 'Chaînes d’approvisionnement'],
    copy: {
      'zh-CN': '关注原材料、制造、采购与物流之间的联系，以及投资、贸易和产能变化的影响。',
      'zh-TW': '關注原材料、製造、採購與物流之間的聯繫，以及投資、貿易和產能變化的影響。',
      en: 'The links between materials, manufacturing, procurement and logistics, including changes in investment, trade and capacity.',
      ru: 'Связи между сырьём, производством, закупками и логистикой, включая изменения инвестиций, торговли и мощностей.',
      fr: 'Liens entre matières premières, production, achats et logistique, notamment les évolutions de l’investissement, du commerce et des capacités.',
    },
  },
];

export function tagDescription(locale, label, articles) {
  const dates = articles.map(article => article.date).sort();
  const count = articles.length;
  const range = count ? dates[0] === dates.at(-1) ? dates[0] : `${dates[0]}–${dates.at(-1)}` : '';
  const scope = topics.find(topic => topic.labels.includes(label))?.copy[locale];
  const inventory = {
    'zh-CN': `“${label}”主题档案收录${count}篇已发布文章${range ? `，发布日期为${range}` : ''}。每篇文章保留其资料来源与适用背景。`,
    'zh-TW': `「${label}」主題檔案收錄${count}篇已發布文章${range ? `，發布日期為${range}` : ''}。每篇文章保留其資料來源與適用背景。`,
    en: `The “${label}” archive contains ${count} published ${count === 1 ? 'article' : 'articles'}${range ? `, dated ${range}` : ''}. Each article retains its sources and context.`,
    ru: `Архив «${label}»: опубликованных материалов — ${count}${range ? `; даты публикации: ${range}` : ''}. Источники и контекст приведены в каждом материале.`,
    fr: `Archives « ${label} » : ${count} ${count === 1 ? 'article publié' : 'articles publiés'}${range ? `, dates de publication : ${range}` : ''}. Chaque article conserve ses sources et son contexte.`,
  };
  return [scope, inventory[locale] || inventory.en].filter(Boolean).join(' ');
}
