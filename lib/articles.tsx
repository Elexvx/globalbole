"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { stories, type Story } from './data';
import { useI18n } from './i18n';
import { fetchArticles } from './article-client';
import { isLocale } from './locales';

type ArticleState = {allArticles:Story[]; status:'loading'|'ready'|'fallback'; retry:()=>void};
const ArticleContext = createContext<ArticleState>({allArticles:stories,status:'loading',retry:()=>{}});
const notices = {
  'zh-CN':['暂时无法更新文章，正在显示随站点发布的内容。','重试'],
  'zh-TW':['暫時無法更新文章，目前顯示隨網站發布的內容。','重試'],
  en:['Articles could not be refreshed. Showing the published snapshot.','Retry'],
  ru:['Не удалось обновить статьи. Показана опубликованная копия.','Повторить'],
  fr:['Actualisation impossible. La version publiée reste affichée.','Réessayer'],
};
export function ArticleDataProvider({children}:{children:React.ReactNode}) {
  const {locale}=useI18n();
  const params=useParams();
  const hasLocaleRoute=isLocale(params?.locale);
  const [allArticles,setArticles]=useState(stories);
  const [status,setStatus]=useState<ArticleState['status']>(hasLocaleRoute?'loading':'ready');
  const [attempt,setAttempt]=useState(0);
  const retry=useCallback(()=>setAttempt(n=>n+1),[]);
  useEffect(()=>{
    if(!hasLocaleRoute){
      setStatus('ready');
      return;
    }
    const controller=new AbortController();
    let active=true;
    setStatus('loading');
    const timeout=setTimeout(()=>controller.abort(),10000);
    fetchArticles(controller.signal).then(data=>{
      if(active){setArticles(data);setStatus('ready');}
    }).catch(()=>{if(active)setStatus('fallback');}).finally(()=>clearTimeout(timeout));
    return ()=>{active=false;clearTimeout(timeout);controller.abort();};
  },[attempt,hasLocaleRoute]);
  const value=useMemo(()=>({allArticles,status,retry}),[allArticles,status,retry]);
  return <ArticleContext.Provider value={value}>
    <span hidden data-article-status={status}/>
    {status==='fallback' && <div role="status" className="border-b border-border bg-background-wash px-5 py-3 text-sm">{notices[locale][0]} <button onClick={retry} className="min-h-11 px-3 underline">{notices[locale][1]}</button></div>}
    {children}
  </ArticleContext.Provider>;
}
export function useArticleData(){return useContext(ArticleContext);}
export function useArticles() {
  const {locale,t}=useI18n();
  const {allArticles,status,retry}=useArticleData();
  return {articles:allArticles.filter(story=>(story.lang||'en')===locale).sort((a,b)=>b.date.localeCompare(a.date)).map(story=>({...story,categoryLabel:t(story.categoryLabel)})),allArticles,hydrated:status!=='loading',status,retry};
}
