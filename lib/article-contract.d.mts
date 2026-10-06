import type { Story } from './data';
export type ArticleResponse = { schemaVersion: 1; total: number; data: (Story & { seoTitle: string; seoDescription: string })[] };
export const articleLanguages: string[];
export const articleCategories: string[];
export function parseArticleResponse(value: unknown): ArticleResponse;
export function createArticleResponse(articles: unknown[]): ArticleResponse;
