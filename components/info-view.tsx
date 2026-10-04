"use client";
import { Text, useI18n } from "@/lib/i18n";
const content={
  "zh-CN": {
    about: "全球伯乐 News 按期整理科技、财经、就业与城市生活、国内外要闻、能源产业及创新实践，提供五种语言的阅读界面。文章注明日期、栏目与资料来源；已发布译文通过共同标识关联，尚无译文时保留原文。",
    authors: "文章由署名作者或资料整理团队编写。每篇文章列出作者、日期和所属栏目，文末来源说明可用于查阅原始资料。",
    contact: "本站尚未配置公开联系邮箱。经过确认的编辑部联系方式将在此公布。",
    "privacy": "本网站没有编辑后台、账号系统或邮件收集表单。浏览器保存视觉主题和语言偏好；带语言的网址优先，返回首页时可恢复上次选择。文章公开托管，阅读时托管平台可能记录基本访问日志。"
  },
  "zh-TW": {
    about: "全球伯樂 News 按期整理科技、財經、就業與城市生活、國內外要聞、能源產業及創新實踐，提供五種語言的閱讀介面。文章註明日期、欄目與資料來源；已發布譯文透過共同識別碼關聯，尚無譯文時保留原文。",
    authors: "文章由署名作者或資料整理團隊編寫。每篇文章列出作者、日期和所屬欄目，文末來源說明可用於查閱原始資料。",
    contact: "本站尚未設定公開聯絡信箱。經過確認的編輯部聯絡方式將在此公布。",
    "privacy": "本網站沒有編輯後台、帳號系統或信箱收集表單。瀏覽器儲存視覺主題與語言偏好；帶語言的網址優先，返回首頁時可恢復上次選擇。文章公開託管，閱讀時託管平台可能記錄基本存取日誌。"
  },
  "en": {
    about: "Global Bole News organizes coverage of technology, finance, work and city life, current affairs, energy and industry, and practical innovation by issue. The reading interface supports five languages. Articles identify their date, section and sources. Available translations are linked; otherwise the original remains available.",
    authors: "Articles credit their author or research desk and identify their date and section. Source notes at the end of each article link to the original materials.",
    contact: "No public contact mailbox is currently configured. Verified editorial contact details will be published here.",
    "privacy": "There is no editor, account system or email collection form. The browser stores visual theme and language preferences. An explicit language URL takes priority; returning to the homepage restores the last selected language. The hosting provider may retain basic access logs when serving public articles."
  },
  "ru": {
    about: "Global Bole News объединяет по выпускам материалы о технологиях, экономике, работе и городской жизни, главных новостях, энергетике, промышленности и практических инновациях. Интерфейс доступен на пяти языках. У статей указаны дата, раздел и источники. Доступные переводы связаны между собой; при отсутствии перевода остаётся оригинал.",
    authors: "В статьях указаны автор или группа подготовки материалов, дата и раздел. Примечания в конце статьи ведут к первоисточникам.",
    contact: "Публичный контактный адрес пока не указан. Проверенные контакты редакции будут опубликованы здесь.",
    "privacy": "На сайте нет редактора, учётных записей и форм сбора почты. Браузер сохраняет тему оформления и выбранный язык. Язык в адресе страницы имеет приоритет; при возвращении на главную восстанавливается последний выбор. Хостинг может хранить базовые журналы доступа к открытым статьям."
  },
  "fr": {
    about: "Global Bole News rassemble par édition des articles sur la technologie, la finance, l’emploi et la vie urbaine, l’actualité, l’énergie, l’industrie et l’innovation pratique. L’interface est disponible en cinq langues. Les articles indiquent leur date, leur rubrique et leurs sources. Les traductions disponibles sont reliées entre elles ; sinon, le texte original reste accessible.",
    authors: "Les articles indiquent leur auteur ou leur équipe de recherche, leur date et leur rubrique. Les notes de sources en fin d’article renvoient aux documents originaux.",
    contact: "Aucune adresse publique de contact n’est actuellement renseignée. Les coordonnées vérifiées de la rédaction seront publiées ici.",
    "privacy": "Le site ne comporte ni éditeur, ni comptes, ni collecte d’adresses e-mail. Le navigateur conserve le thème visuel et la langue choisie. La langue indiquée dans l’URL est prioritaire ; le retour à l’accueil rétablit le dernier choix. L’hébergeur peut conserver des journaux d’accès élémentaires aux articles publics."
  }
};
export default function Info({page}:{page:"about"|"authors"|"contact"|"privacy"}) {
  const {locale,t}=useI18n();
  const titles={about:"About 全球伯乐 News",authors:"Authors",contact:"Contact",privacy:"Privacy"};
  return <main className="layout-wide min-h-[45vh] px-5 py-14 lg:px-8"><p className="kicker"><Text value="全球伯乐 News"/></p><h1 className="headline my-7 font-black">{t(titles[page])}</h1><p className="max-w-3xl type-body">{content[locale][page]}</p></main>;
}
