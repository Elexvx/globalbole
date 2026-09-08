"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useI18n } from "@/lib/i18n";

// Source line anchors remain unique even when headings repeat.
export function ArticleMarkdown({markdown}:{markdown:string}) {
  const {locale}=useI18n();
  const title={"zh-CN":"文章目录","zh-TW":"文章目錄",en:"On this page",ru:"Содержание",fr:"Sommaire"}[locale];
  const headings:{text:string;line:number}[]=[];
  let fence="";
  markdown.split("\n").forEach((line,index)=>{
    const marker=line.match(/^ {0,3}(`{3,}|~{3,})/);
    if(marker){if(!fence)fence=marker[1];else if(marker[1][0]===fence[0]&&marker[1].length>=fence.length)fence="";return;}
    const heading=!fence && line.match(/^ {0,3}##\s+(.+?)\s*#*$/);
    if(heading)headings.push({text:heading[1],line:index+1});
  });
  return <>{headings.length>1?<nav aria-label={title} className="mb-8 border-y border-border py-5"><p className="mb-3 font-semibold">{title}</p><ul className="space-y-2">{headings.map(h=><li key={h.line}><a href={`#section-${h.line}`} className="underline underline-offset-4">{h.text}</a></li>)}</ul></nav>:null}<div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{h2:({node,children,...props})=><h2 {...props} id={`section-${node?.position?.start.line}`} className="scroll-mt-8">{children}</h2>,h3:({node,children,...props})=><h3 {...props} id={`section-${node?.position?.start.line}`} className="scroll-mt-8">{children}</h3>}}>{markdown}</ReactMarkdown></div></>;
}
