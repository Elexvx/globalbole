export function languageSwitchHref(input: {
  params: Record<string, string | string[] | undefined>;
  pathname: string;
  locale: string;
  next: string;
  stories: { slug: string; translationKey?: string; lang?: string }[];
}): string;
