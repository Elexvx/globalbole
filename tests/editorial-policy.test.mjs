import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

const source = readFileSync('lib/editorial-policy.ts', 'utf8');
const compiled = stripTypeScriptTypes(source.replace(/^import type .*;\n/m, '').replace(/\bexport /g, ''));
const { editorialPages, PUBLIC_CONTACT_EMAIL } = Function(compiled + '\nreturn { editorialPages, PUBLIC_CONTACT_EMAIL };')();
const locales = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
const privacyBefore = {
  "zh-CN": "本网站没有编辑后台、账号系统或邮件收集表单。浏览器保存视觉主题和语言偏好；带语言的网址优先，返回首页时可恢复上次选择。文章公开托管，阅读时托管平台可能记录基本访问日志。",
  "zh-TW": "本網站沒有編輯後台、帳號系統或信箱收集表單。瀏覽器儲存視覺主題與語言偏好；帶語言的網址優先，返回首頁時可恢復上次選擇。文章公開託管，閱讀時託管平台可能記錄基本存取日誌。",
  "en": "There is no editor, account system or email collection form. The browser stores visual theme and language preferences. An explicit language URL takes priority; returning to the homepage restores the last selected language. The hosting provider may retain basic access logs when serving public articles.",
  "ru": "На сайте нет редактора, учётных записей и форм сбора почты. Браузер сохраняет тему оформления и выбранный язык. Язык в адресе страницы имеет приоритет; при возвращении на главную восстанавливается последний выбор. Хостинг может хранить базовые журналы доступа к открытым статьям.",
  "fr": "Le site ne comporte ni éditeur, ni comptes, ni collecte d’adresses e-mail. Le navigateur conserve le thème visuel et la langue choisie. La langue indiquée dans l’URL est prioritaire ; le retour à l’accueil rétablit le dernier choix. L’hébergeur peut conserver des journaux d’accès élémentaires aux articles publics."
};

test('editorial pages supply substantive localized copy and metadata for exactly five locales', () => {
  assert.deepEqual(Object.keys(editorialPages), locales);
  for (const locale of locales) {
    const pages = editorialPages[locale];
    assert.deepEqual(Object.keys(pages), ['about', 'authors', 'contact', 'privacy']);
    for (const name of ['about', 'authors', 'contact']) {
      const page = pages[name];
      assert.ok(page.title.length > 1);
      assert.ok(page.description.length > 20);
      assert.ok(page.intro.length > 30);
      assert.ok(page.sections.length >= 3);
      assert.equal(new Set(page.sections.map(section => section.id)).size, page.sections.length);
      for (const section of page.sections) {
        assert.match(section.id, /^[a-z-]+$/);
        assert.ok(section.title.length > 1);
        assert.ok(section.paragraphs.every(paragraph => paragraph.length > 30));
      }
      assert.ok(page.relatedPages.every(related => pages[related] && related !== name));
    }
    assert.deepEqual(pages.about.sections.map(section => section.id), ['sources', 'analysis', 'images', 'corrections']);
    assert.deepEqual(pages.authors.sections.map(section => section.id), ['byline', 'preparation', 'accountability']);
    assert.deepEqual(pages.contact.sections.map(section => section.id), ['corrections', 'rights', 'tips']);
    assert.match(pages.authors.sections.find(section => section.id === 'preparation').title, /AI|ИИ|IA/);
  }
});

test('the authorized public mailbox is available on contact and correction paths', () => {
  assert.equal(PUBLIC_CONTACT_EMAIL, 'globalbole@globalbole.com');
  for (const locale of locales) {
    const pages = editorialPages[locale];
    assert.equal(pages.contact.contact, true);
    assert.ok(pages.contact.description.includes(PUBLIC_CONTACT_EMAIL));
    assert.equal(pages.about.sections.find(section => section.id === 'corrections').contact, true);
    assert.equal(pages.authors.sections.find(section => section.id === 'accountability').contact, true);
  }
  const component = readFileSync('components/info-view.tsx', 'utf8');
  assert.ok(component.includes('href={`mailto:${PUBLIC_CONTACT_EMAIL}`}'));
  assert.ok(component.includes('href={`/${locale}/${relatedPage}/`}'));
  assert.match(component, /<h1[^>]*>\{content.title\}<\/h1>/);
  assert.match(component, /<h2[^>]*>\{section.title\}<\/h2>/);
  assert.ok(component.includes('aria-labelledby={`${section.id}-title`}'));
  assert.doesNotMatch(component, /<form|<input|<textarea/);
  assert.doesNotMatch(source, /No public contact mailbox|尚未配置公开联系邮箱|尚未設定公開聯絡信箱|Публичный контактный адрес пока|Aucune adresse publique de contact/);
});

test('privacy wording and scope remain unchanged', () => {
  for (const locale of locales) {
    assert.equal(editorialPages[locale].privacy.intro, privacyBefore[locale]);
    assert.deepEqual(editorialPages[locale].privacy.sections, []);
    assert.equal(editorialPages[locale].privacy.contact, undefined);
  }
});

test('all twenty information pages render crawlable localized headings, sections and links', async () => {
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const babel = require('next/dist/compiled/babel/core');
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const component = babel.transformSync(readFileSync('components/info-view.tsx', 'utf8'), {
    filename: 'components/info-view.tsx',
    presets: [[require('next/babel'), { 'transform-runtime': { moduleName: 'next/dist/compiled/@babel/runtime' } }]],
    babelrc: false,
    configFile: false,
  }).code;
  for (const locale of locales) {
    const exports = {};
    const localRequire = name => name === '@/lib/i18n'
      ? { useI18n: () => ({ locale }), Text: ({ value }) => value }
      : name === '@/lib/editorial-policy' ? { editorialPages, PUBLIC_CONTACT_EMAIL } : require(name);
    Function('require', 'exports', component)(localRequire, exports);
    for (const name of ['about', 'authors', 'contact', 'privacy']) {
      const html = renderToStaticMarkup(React.createElement(exports.default, { page: name }));
      assert.equal((html.match(/<h1\b/g) || []).length, 1);
      assert.ok(html.includes(editorialPages[locale][name].title));
      for (const section of editorialPages[locale][name].sections) {
        assert.ok(html.includes(`id="${section.id}"`));
        assert.ok(html.includes(`aria-labelledby="${section.id}-title"`));
      }
      if (name !== 'privacy') {
        assert.ok(html.includes(`href="mailto:${PUBLIC_CONTACT_EMAIL}"`));
        for (const related of editorialPages[locale][name].relatedPages) assert.ok(html.includes(`href="/${locale}/${related}/"`));
      }
      assert.doesNotMatch(html, /<form\b|<input\b/);
    }
  }
});
