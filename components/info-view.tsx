"use client";
import { Text, useI18n } from "@/lib/i18n";
const content={
  "zh-CN": {
    "about": "全球伯乐 News 专注科技、创新、商业领域，是一个按期整理的多语言阅读站。文章来自项目内的 Markdown 文件，分类、标签和目录在构建时自动生成。当前内容为功能测试示例，并非实时新闻。",
    "authors": "示例编辑部负责本次测试文章。每篇文章均在开头列出作者、日期和所属栏目；五种语言通过统一的文章标识关联。",
    "contact": "这是演示站点，尚未配置公开联系邮箱。正式上线时，请在项目内容中填写经过确认的编辑部联系方式。",
    "privacy": "本网站没有编辑后台、账号系统或邮件收集表单。浏览器只保存视觉主题偏好；语言由网址决定。文章公开托管，阅读时托管平台可能记录基本访问日志。"
  },
  "zh-TW": {
    "about": "全球伯樂 News 專注科技、創新、商業領域，是一個按期整理的多語言閱讀站。文章來自專案內的 Markdown 檔案，分類、標籤和目錄在建置時自動產生。目前內容為功能測試範例，並非即時新聞。",
    "authors": "範例編輯部負責本次測試文章。每篇文章均在開頭列出作者、日期和所屬欄目；五種語言透過統一的文章識別碼關聯。",
    "contact": "這是展示網站，尚未設定公開聯絡信箱。正式上線時，請在專案內容中填寫經過確認的編輯部聯絡方式。",
    "privacy": "本網站沒有編輯後台、帳號系統或信箱收集表單。瀏覽器只儲存視覺主題偏好；語言由網址決定。文章公開託管，閱讀時託管平台可能記錄基本存取日誌。"
  },
  "en": {
    "about": "Global Bole News focuses on technology, innovation and business. A multilingual reading site organized by issue. Markdown files in the project generate categories, tags and archives at build time. The current issues contain testing examples, not live news.",
    "authors": "The sample editorial desk prepared these test articles. Each article lists its author, date and section. A shared translation key connects the five language versions.",
    "contact": "This demonstration has no public contact mailbox configured. Before launch, add verified editorial contact details to the project.",
    "privacy": "There is no editor, account system or email collection form. The browser stores only visual theme preferences; the URL determines the language. The hosting provider may retain basic access logs when serving public articles."
  },
  "ru": {
    "about": "Global Bole News — технологии, инновации и бизнес. Многоязычный сайт для чтения, организованный по выпускам. Файлы Markdown формируют разделы, метки и архивы при сборке. Текущие выпуски содержат тестовые примеры, а не актуальные новости.",
    "authors": "Тестовая редакция подготовила эти материалы. У каждой статьи указаны автор, дата и раздел. Общий ключ связывает версии на пяти языках.",
    "contact": "У демонстрационного сайта пока нет публичного контактного адреса. Перед запуском добавьте проверенные контакты редакции в проект.",
    "privacy": "На сайте нет редактора, учётных записей и форм сбора почты. Браузер сохраняет только тему оформления; язык определяется адресом страницы. Хостинг может хранить базовые журналы доступа к открытым статьям."
  },
  "fr": {
    "about": "Global Bole News : technologie, innovation et économie. Un site de lecture multilingue organisé par édition. Les fichiers Markdown génèrent les rubriques, les étiquettes et les archives lors de la compilation. Les éditions actuelles sont des exemples de test, pas des actualités.",
    "authors": "La rédaction de démonstration a préparé ces articles. Chaque texte indique son auteur, sa date et sa rubrique. Une clé commune relie les versions dans les cinq langues.",
    "contact": "Aucune adresse publique de contact n’est configurée pour cette démonstration. Avant la mise en ligne, ajoutez les coordonnées vérifiées de la rédaction.",
    "privacy": "Le site ne comporte ni éditeur, ni comptes, ni collecte d’adresses e-mail. Le navigateur conserve seulement le thème visuel ; l’URL détermine la langue. L’hébergeur peut conserver des journaux d’accès élémentaires aux articles publics."
  }
};
export default function Info({page}:{page:"about"|"authors"|"contact"|"privacy"}) {
  const {locale,t}=useI18n();
  const titles={about:"About 全球伯乐 News",authors:"Authors",contact:"Contact",privacy:"Privacy"};
  return <main className="layout-wide min-h-[45vh] px-5 py-14 lg:px-8"><p className="kicker"><Text value="全球伯乐 News"/></p><h1 className="headline my-7 text-5xl font-black">{t(titles[page])}</h1><p className="max-w-3xl text-lg leading-9">{content[locale][page]}</p></main>;
}
