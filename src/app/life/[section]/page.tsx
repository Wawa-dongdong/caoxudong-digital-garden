import MovieRoom from '@/components/MovieRoom';
import Photography from '@/components/Photography';
import Link from "@/components/SiteLink";
import {notFound} from 'next/navigation';
const sections=[{id:'photography',en:'Photography',zh:'摄影'},{id:'drawings',en:'Drawings',zh:'涂鸦'},{id:'movies',en:'Movies',zh:'最近看的一些电影'},{id:'music',en:'Music',zh:'最近常哼的歌'}];
export function generateStaticParams(){return sections.map(s=>({section:s.id}))}
export async function generateMetadata({params}:{params:Promise<{section:string}>}){const {section}=await params;return {title:sections.find(s=>s.id===section)?.zh+' / 日常'}}
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;const item=sections.find(s=>s.id===section);if(!item)notFound();if(section==='photography')return <Photography/>;if(section==='movies')return <MovieRoom/>;return <section className="life-content-desktop"><article className="life-content-window"><header className="mine-titlebar"><span>{item.en} / {item.zh}</span><Link href="/caoxudong-digital-garden/life" aria-label="关闭内容页，返回日常桌面">×</Link></header><nav className="life-content-nav"><Link href="/caoxudong-digital-garden/life">← 返回日常桌面</Link><Link href="/caoxudong-digital-garden/">Home / 返回主页</Link></nav><div className="life-content-empty"><img src={'/caoxudong-digital-garden/life/'+item.id+'.svg'} alt=""/><h1>{item.zh}</h1><p>{item.en}</p><small>内容整理中</small></div></article></section>}
