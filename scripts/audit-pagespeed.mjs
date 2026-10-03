import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

// Official PSI API only. A failed/quota-limited audit must never look like a pass.
const origin = (process.env.AUDIT_SITE_URL || 'https://www.globalbole.com').replace(/\/$/, '');
const articles = JSON.parse(readFileSync('content/generated/articles.json', 'utf8'));
const firstArticle = articles.find(article=>article.lang==='zh-CN');
const routes = process.argv.slice(2);
if (!routes.length) routes.push('/', '/zh-CN/all-news/', ...(firstArticle ? [`/zh-CN/post/${firstArticle.slug}/`] : []));
const directory = path.resolve(process.env.AUDIT_OUTPUT_DIR || 'qa-evidence/pagespeed', new Date().toISOString().replace(/[:.]/g, '-'));
mkdirSync(directory, {recursive:true});
const summary=[];
for(const [routeIndex, route] of routes.entries()) {
  const target = new URL(route, origin).href;
  for(const strategy of ['mobile','desktop']) {
    const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    endpoint.searchParams.set('url',target);
    endpoint.searchParams.set('strategy',strategy);
    for(const category of ['performance','accessibility','best-practices','seo']) endpoint.searchParams.append('category',category);
    if (process.env.PAGESPEED_API_KEY) endpoint.searchParams.set('key',process.env.PAGESPEED_API_KEY);
    const response = await fetch(endpoint, {signal:AbortSignal.timeout(180000)});
    const report = await response.json();
    if(!response.ok || report.lighthouseResult?.runtimeError || !report.lighthouseResult?.categories || Object.values(report.lighthouseResult.categories).some(category=>typeof category.score !== 'number')) {
      const error=report.error?.message || report.lighthouseResult?.runtimeError?.message || `HTTP ${response.status}: missing or incomplete Lighthouse result`;
      writeFileSync(path.join(directory,`${routeIndex}-${strategy}-error.json`),JSON.stringify({url:target,strategy,error},null,2));
      throw new Error(`PageSpeed ${strategy} audit failed for ${target}: ${error}`);
    }
    writeFileSync(path.join(directory,`${routeIndex}-${strategy}.json`),JSON.stringify(report,null,2));
    const lighthouse=report.lighthouseResult;
    const row={url:target,strategy,fetchTime:lighthouse.fetchTime,lighthouseVersion:lighthouse.lighthouseVersion,environment:lighthouse.environment,configSettings:lighthouse.configSettings,scores:Object.fromEntries(Object.entries(lighthouse.categories).map(([key,value])=>[key,Math.round(value.score*100)])),fieldData:report.loadingExperience?.overall_category || 'insufficient data'};
    summary.push(row);
    writeFileSync(path.join(directory,'summary.json'),JSON.stringify(summary,null,2));
    console.log(JSON.stringify(row));
  }
}
console.log(`Saved ${summary.length} official PageSpeed reports to ${directory}`);
