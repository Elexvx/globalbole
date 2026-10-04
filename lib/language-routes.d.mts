type TranslatableStory = { slug: string; translationKey?: string; lang?: string; tags?: string[] };
export function translatedTagSlug(input: {slug:string;locale:string;next:string;stories:TranslatableStory[]}): string | undefined;
export function languageSwitchHref(input: {
  params: Record<string, string | string[] | undefined>;
  pathname: string;
  locale: string;
  next: string;
  stories: TranslatableStory[];
}): string;
