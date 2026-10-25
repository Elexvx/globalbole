"use client";
import { Text, useI18n } from "@/lib/i18n";
import { editorialPages, PUBLIC_CONTACT_EMAIL, type InfoPage } from "@/lib/editorial-policy";

const linkClass = "underline underline-offset-4 decoration-border-strong hover:text-accent break-words";

function ContactAddress() {
  return <address className="not-italic type-body"><a className={linkClass} href={`mailto:${PUBLIC_CONTACT_EMAIL}`}>{PUBLIC_CONTACT_EMAIL}</a></address>;
}

export default function Info({ page }: { page: InfoPage }) {
  const { locale } = useI18n();
  const content = editorialPages[locale][page];
  return (
    <main className="layout-wide min-h-[45vh] px-5 py-14 lg:px-8">
      <p className="kicker"><Text value="全球伯乐 News" /></p>
      <h1 className="headline my-7 font-black">{content.title}</h1>
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <p className="type-body">{content.intro}</p>
          {content.contact && <ContactAddress />}
        </div>
        {content.sections.map(section => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="border-t border-border pt-7">
            <h2 id={`${section.id}-title`} className="mb-4 font-bold">{section.title}</h2>
            <div className="space-y-4 type-body">
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {section.contact && <ContactAddress />}
            </div>
          </section>
        ))}
        {content.relatedPages && <nav className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-7 type-body">
          {content.relatedPages.map(relatedPage => <a key={relatedPage} className={linkClass} href={`/${locale}/${relatedPage}/`}>{editorialPages[locale][relatedPage].title}</a>)}
        </nav>}
      </div>
    </main>
  );
}
