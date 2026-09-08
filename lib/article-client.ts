import { parseArticleResponse } from './article-contract.mjs';

export async function fetchArticles(signal: AbortSignal) {
  const endpoint = process.env.NEXT_PUBLIC_ARTICLES_URL || '/data/v1/articles.json';
  const response = await fetch(endpoint, {signal, cache:'no-cache', credentials:'omit', headers:{Accept:'application/json'}});
  if (!response.ok) throw new Error(`Article API HTTP ${response.status}`);
  return parseArticleResponse(await response.json()).data;
}
