"use client";
import {useEffect,useRef,useState} from "react";
import Link from "@/components/SiteLink";
import {stories} from "@/data/stories";

export default function FilmCollage(){
 const [active,setActive]=useState<number|null>(null);
 const canvas=useRef<HTMLCanvasElement>(null);
 const touchWasActive=useRef(false);
 const waves=useRef<{x:number;y:number;born:number}[]>([]);
 const blocked=useRef(false),lastWave=useRef(0),reduce=useRef(false);
 useEffect(()=>{
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  const sync=()=>{reduce.current=media.matches;if(media.matches)waves.current=[]};sync();media.addEventListener("change",sync);
  const c=canvas.current!;const ctx=c.getContext("2d")!;let raf=0;
  const resize=()=>{const dpr=Math.min(devicePixelRatio,2);c.width=innerWidth*dpr;c.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
  resize();window.addEventListener("resize",resize);
  const draw=()=>{ctx.clearRect(0,0,innerWidth,innerHeight);const now=performance.now();waves.current=waves.current.filter(w=>now-w.born<1700);
   if(!blocked.current&&!reduce.current){for(const w of waves.current){const t=(now-w.born)/1700;for(let n=0;n<3;n++){const r=t*115+n*13;ctx.beginPath();ctx.ellipse(w.x,w.y,r,r*.66,0,0,Math.PI*2);ctx.strokeStyle="rgba(168,108,134,"+((1-t)*.16)+")";ctx.lineWidth=1.2;ctx.stroke();ctx.beginPath();ctx.ellipse(w.x+1,w.y+2,r+3,r*.66+2,0,0,Math.PI*2);ctx.strokeStyle="rgba(255,255,227,"+((1-t)*.5)+")";ctx.lineWidth=2;ctx.stroke()}}}
   raf=requestAnimationFrame(draw)};draw();
  return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);media.removeEventListener("change",sync)}
 },[]);
 const select=(i:number|null)=>{setActive(i);blocked.current=i!==null;if(i!==null){waves.current=[];const c=canvas.current;if(c)c.getContext("2d")?.clearRect(0,0,c.width,c.height)}};
 const film=active===null?null:stories[active];
 return <div className="film-collage" data-active-film={active??"none"} onPointerMove={e=>{
  if((e.target as Element).closest(".celluloid-link,nav,.collage-info"))return;
  select(null);const now=performance.now();if(e.pointerType!=="touch"&&!reduce.current&&now-lastWave.current>85){lastWave.current=now;waves.current.push({x:e.clientX,y:e.clientY,born:now});if(waves.current.length>14)waves.current.shift()}
 }} onPointerLeave={()=>{waves.current=[];select(null)}}>
 <div className="collage-background" aria-hidden="true"><svg className="ferris-ghost" viewBox="0 0 1000 1000"><g fill="none" stroke="currentColor"><circle cx="500" cy="500" r="390"/><circle cx="500" cy="500" r="373"/><circle cx="500" cy="500" r="65"/>{Array.from({length:24},(_,i)=><g key={i} transform={"rotate("+i*15+" 500 500)"}><path d="M500 500L500 110M500 500L600 124"/><rect x="482" y="91" width="36" height="47" rx="5"/></g>)}<path d="M475 500L280 1000M525 500L720 1000" strokeWidth="12"/></g></svg></div>
 <canvas ref={canvas} className="ripple-canvas" aria-hidden="true"/>
 <nav className="collage-nav" aria-label="页面导航"><Link href="/caoxudong-digital-garden/">← 返回 / Back</Link><Link href="/caoxudong-digital-garden/">Home ↗</Link></nav>
 <header className="collage-heading"><p>MOVING IMAGES / CAO XUDONG</p><h1>Story<span>动画</span></h1><small>一些故事，留在光里。</small></header>
 <div className="film-board">
 {stories.map((item,i)=><article className={"celluloid celluloid-"+i+(active===i?" is-running":"")} key={item.slug}>
 <Link className="celluloid-link" href={"/caoxudong-digital-garden/story/"+item.slug} onPointerDown={e=>{if(e.pointerType==="touch")touchWasActive.current=active===i}} onPointerEnter={e=>{if(e.pointerType!=="touch")select(i)}} onFocus={()=>select(i)} onBlur={()=>select(null)} onClick={e=>{if(matchMedia("(hover: none)").matches&&!touchWasActive.current){e.preventDefault();select(i)}}} aria-label={item.title+"，查看完整动画"}>
 <div className="film-rail"><span>CAO XUDONG · {item.year}</span><span>0{i+1} ▷</span></div>
 <div className="film-window"><div className="frame-flow">{[0,1].map(copy=><div className="frame-cycle" aria-hidden={copy===1} key={copy}>{[1,2,3,4].map(n=><img key={n} src={"/caoxudong-digital-garden/story/"+item.slug+"/still-"+n+".webp"} alt={copy===0?item.title+"关键帧 "+n:""} draggable={false}/>)}</div>)}</div></div>
 <div className="film-rail rail-bottom"><span>35 MM / STORY</span><span>{item.duration} · 0{i+1}A</span></div>
 </Link><h2><span>0{i+1}</span> {item.title}</h2>
 </article>)}
 
 </div>
 <p className="collage-instruction">悬停，让画面流动。点击，进入故事。<span>手机轻点预览，再次轻点打开。</span></p>
 {film&&<aside className="collage-info" aria-label={film.title+"简介"} aria-live="polite"><div className="info-system-line"><span>☺ STORY / 0{active!+1}</span><span>NOW SHOWING</span></div><div className="info-body"><div><h2>{film.title}</h2><p className="info-en">{film.english}</p><p className="info-facts">{film.year} · {film.duration} · {film.technique}</p><p className="info-description">{film.description}</p></div><img src={"/caoxudong-digital-garden/story/"+film.slug+"/poster.webp"} alt={film.title+"海报"}/></div></aside>}
 </div>
}

