import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { imageDimensions } from "@/lib/image-assets";
import type { Locale } from "@/lib/locales";

// Source line anchors remain unique even when headings repeat.
// Keep this renderer free of client hooks: published articles are rendered at build time.
export function ArticleMarkdown({markdown,locale}:{markdown:string;locale:Locale}) {
  const title={"zh-CN":"文章目录","zh-TW":"文章目錄",en:"On this page",ru:"Содержание",fr:"Sommaire"}[locale];
  const footnoteLabel={"zh-CN":"来源与说明","zh-TW":"來源與說明",en:"Source notes",ru:"Источники",fr:"Notes et sources"}[locale];
  const headings:{text:string;line:number}[]=[];
  let fence="";
  markdown.split("\n").forEach((line,index)=>{
    const marker=line.match(/^ {0,3}(`{3,}|~{3,})/);
    if(marker){if(!fence)fence=marker[1];else if(marker[1][0]===fence[0]&&marker[1].length>=fence.length)fence="";return;}
    const heading=!fence && line.match(/^ {0,3}##\s+(.+?)\s*#*$/);
    if(heading)headings.push({text:heading[1],line:index+1});
  });
  return <>{headings.length>1?<nav aria-label={title} className="mb-8 border-y border-border py-5"><p className="mb-3 font-semibold">{title}</p><ul className="space-y-2">{headings.map(h=><li key={h.line}><a href={`#section-${h.line}`} className="underline underline-offset-4">{h.text}</a></li>)}</ul></nav>:null}<div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} remarkRehypeOptions={{footnoteLabel,footnoteLabelProperties:{className:[]}}} skipHtml components={{img:({node,src,...props})=><img {...props} src={src} {...imageDimensions(typeof src === "string" ? src : "")} loading="lazy" decoding="async"/>,h2:({node,children,...props})=><h2 {...props} id={node?.position?`section-${node.position.start.line}`:props.id} className="scroll-mt-8">{children}</h2>,h3:({node,children,...props})=><h3 {...props} id={node?.position?`section-${node.position.start.line}`:props.id} className="scroll-mt-8">{children}</h3>}}>{markdown}</ReactMarkdown></div></>;
}
