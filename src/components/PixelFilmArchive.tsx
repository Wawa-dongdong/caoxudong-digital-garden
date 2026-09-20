"use client";
import {useEffect,useRef,useState} from "react";
import Link from "@/components/SiteLink";
import {stories} from "@/data/stories";
import StoryWater from "./StoryWater";

export default function PixelFilmArchive(){
 const [active,setActive]=useState<number|null>(null),[paused,setPaused]=useState(false);
 const reel=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null),cycle=useRef<HTMLDivElement>(null);
 const speed=useRef(0),offset=useRef(0),selected=useRef<number|null>(null),pause=useRef(false),keyboard=useRef(false);
 const pointer=useRef<{x:number;y:number}|null>(null),touchY=useRef<number|null>(null),touchWasActive=useRef(false);
 const select=(i:number|null)=>{selected.current=i;setActive(i)};
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,previous=performance.now(),check=0;
  const draw=(now:number)=>{const dt=Math.min((now-previous)/1000,.05);previous=now;const h=cycle.current?.offsetHeight??0;
   if(h&&!pause.current&&!keyboard.current&&!media.matches){const base=pointer.current===null?25:8;offset.current=((offset.current+(base+speed.current)*dt)%h+h)%h;track.current!.style.transform=`translate3d(0,${-offset.current}px,0)`;speed.current*=Math.exp(-dt*2.5)}
   if(pointer.current&&!keyboard.current&&now-check>100){const el=document.elementFromPoint(pointer.current.x,pointer.current.y)?.closest<HTMLElement>('[data-film]');const value=el?Number(el.dataset.film):null;if(value!==selected.current)select(value);check=now}
   raf=requestAnimationFrame(draw);
  };raf=requestAnimationFrame(draw);
  const wheel=(e:WheelEvent)=>{e.preventDefault();if(media.matches){const h=cycle.current?.offsetHeight??1;offset.current=((offset.current+e.deltaY)%h+h)%h;track.current!.style.transform=`translate3d(0,${-offset.current}px,0)`}else speed.current=Math.max(-900,Math.min(900,speed.current+e.deltaY*2.6))};
  const node=reel.current!.parentElement!;node.addEventListener('wheel',wheel,{passive:false});
  return()=>{cancelAnimationFrame(raf);node.removeEventListener('wheel',wheel)};
 },[]);
 const film=active===null?null:stories[active];
 return <section className="pixel-archive">
  <StoryWater/>
  <nav className="pixel-nav" aria-label="页面导航"><Link href="/caoxudong-digital-garden/">← 返回 / BACK</Link><Link href="/caoxudong-digital-garden/">HOME ↗</Link></nav>
  <div className="pixel-reel" ref={reel} aria-label="循环动画胶片" onPointerMove={e=>{if(e.pointerType==='touch'){if(touchY.current!==null){speed.current=Math.max(-900,Math.min(900,(touchY.current-e.clientY)*30));touchY.current=e.clientY}return}if(pointer.current){const d=Math.abs(e.clientY-pointer.current.y);speed.current=Math.min(240,speed.current+d*1.1)}pointer.current={x:e.clientX,y:e.clientY}}} onPointerLeave={()=>{pointer.current=null}} onPointerUp={()=>touchY.current=null}>
   <div className="pixel-track" ref={track}>
    {[0,1,2].map(copy=><div className="pixel-cycle" key={copy} ref={copy===0?cycle:undefined}>
     {stories.map((s,i)=><div className="pixel-cell" key={s.slug}>
      <span className="pixel-edge-number" aria-hidden="true">0{i+1} · {s.year}</span>
      <Link href={'/caoxudong-digital-garden/story/'+s.slug} data-film={i} tabIndex={copy===0?0:-1} aria-label={s.title+'，查看动画详情'} className={'pixel-frame'+(active===i?' is-selected':'')} onPointerEnter={e=>{if(e.pointerType!=='touch')select(i)}} onPointerDown={e=>{keyboard.current=false;if(e.pointerType==='touch'){touchY.current=e.clientY;touchWasActive.current=selected.current===i}}} onClick={e=>{if(matchMedia('(hover: none)').matches&&!touchWasActive.current){e.preventDefault();select(i)}}} onFocus={e=>{if(e.currentTarget.matches(':focus-visible')){keyboard.current=true;pointer.current=null;const item=e.currentTarget.parentElement!;offset.current=item.offsetTop;track.current!.style.transform=`translate3d(0,${-offset.current}px,0)`}select(i)}} onBlur={()=>{keyboard.current=false;select(null)}}>
       <img src={'/caoxudong-digital-garden/story/'+s.slug+'/still-1.webp'} alt={s.title+' · 第一张关键帧'} draggable={false}/>
       <span className="pixel-frame-caption">{s.title}<span>↗</span></span>
      </Link>
      <span className="pixel-cell-code" aria-hidden="true">CX / 0{i+1} ───────────────── 35</span>
     </div>)}
    </div>)}
   </div>
  </div>
  <div className="pixel-right">
   <header className="pixel-archive-heading"><p>CAO XUDONG / MOVING IMAGES</p><h1>Story<span>动画</span></h1><span className="pixel-rule"/></header>
   <div className="pixel-information" aria-live="polite">
    {film?<article className="pixel-film-info" key={film.slug}><p className="pixel-index">0{active!+1} / 05</p><div className="pixel-info-layout"><div><h2><Link href={'/caoxudong-digital-garden/story/'+film.slug}>{film.title}</Link></h2><p className="pixel-english">{film.english}</p><dl><div><dt>年份 / YEAR</dt><dd>{film.year}</dd></div><div><dt>时长 / TIME</dt><dd>{film.duration}</dd></div><div><dt>媒介 / MEDIUM</dt><dd>{film.technique}</dd></div></dl><Link className="pixel-enter" href={'/caoxudong-digital-garden/story/'+film.slug}>进入故事 ↗</Link></div><Link href={'/caoxudong-digital-garden/story/'+film.slug} tabIndex={-1} aria-label={'打开'+film.title}><img className="pixel-small-poster" src={'/caoxudong-digital-garden/story/'+film.slug+'/poster.webp'} alt={film.title+'海报'}/></Link></div></article>:<div className="pixel-idle"><span className="pixel-cross">+</span><p>让记忆，慢慢显影。</p><small>把鼠标停在一格画面上<br/>找到一个故事的入口。</small></div>}
   </div>
   <footer className="pixel-archive-footer"><p>滚动加速 · 悬停预览 · 点击观看<span>SCROLL THROUGH THE STORIES</span></p><button type="button" aria-pressed={paused} onClick={()=>{pause.current=!pause.current;setPaused(pause.current)}}>{paused?'▷ 播放':'Ⅱ 暂停'}</button></footer>
  </div>
 </section>
}


