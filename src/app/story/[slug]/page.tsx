import Link from "@/components/SiteLink";
import { notFound } from "next/navigation";
import { stories } from "@/data/stories";
import FilmPlayer from "@/components/FilmPlayer";
export function generateStaticParams(){return stories.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const film=stories.find(item=>item.slug===slug);return {title:film?.title||"作品"}}
export default async function FilmPage({params}:{params:Promise<{slug:string}>}){
const {slug}=await params;const index=stories.findIndex(item=>item.slug===slug);const film=stories[index];if(!film)notFound();
const next=stories[(index+1)%stories.length];const base="/caoxudong-digital-garden/story/"+film.slug;
return <article className="film-detail">
<Link href="/caoxudong-digital-garden/story" className="film-back">← 返回动画 / All films</Link>
<Link href="/caoxudong-digital-garden/" className="film-home-link">Home ↗</Link><FilmPlayer slug={film.slug} title={film.title}/>
<div className="film-info"><header><p className="eyebrow">0{index+1} / SHORT FILM</p><h1>{film.title}</h1><p className="film-english">{film.english}</p></header><div className="film-description"><p>{film.description}</p><dl className="film-facts"><div><dt>创作时间</dt><dd>{film.year}</dd></div><div><dt>时长</dt><dd>{film.duration}</dd></div><div><dt>制作方式</dt><dd>{film.technique}</dd></div>{film.credits.map(([role,name])=><div key={role}><dt>{role}</dt><dd>{name}</dd></div>)}</dl></div></div>
<section className="film-stills"><h2 className="film-section-heading">Stills <span>关键帧</span></h2><div className="film-still-grid">{[1,2,3,4].map(n=><figure key={n}><a href={base+"/still-"+n+".webp"} target="_blank" rel="noreferrer" aria-label={film.title+"关键帧 "+n+"，查看大图"}><img src={base+"/still-"+n+".webp"} alt={film.title+"关键帧 "+n} loading="lazy"/></a><figcaption>0{n}</figcaption></figure>)}</div></section>
<div className="film-production-pair"><section className="film-process"><h2 className="film-section-heading">Behind the scenes <span>制作过程</span></h2><a href={base+"/process.webp"} target="_blank" rel="noreferrer" aria-label="查看完整制作过程图"><img className="process-image" src={base+"/process.webp"} alt={film.title+"制作过程"} loading="lazy"/></a></section>
<section className="film-poster-section"><h2 className="film-section-heading">Poster <span>海报</span></h2><a href={base+"/poster.webp"} target="_blank" rel="noreferrer" aria-label="查看完整海报"><img src={base+"/poster.webp"} alt={film.title+"海报"} loading="lazy"/></a></section>
</div><nav className="film-bottom-nav" aria-label="作品翻页"><Link href="/caoxudong-digital-garden/story">← 全部动画</Link><Link href={"/caoxudong-digital-garden/story/"+next.slug}><span>下一部 / Next film</span>{next.title} ↗</Link></nav>
</article>}

