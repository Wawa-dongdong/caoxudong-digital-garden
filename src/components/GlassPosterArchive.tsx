"use client";
import {CSSProperties,useEffect,useRef,useState} from 'react';
import Link from "@/components/SiteLink";
import {stories} from '@/data/stories';
import StoryWater from './StoryWater';
const wrap=(i:number)=>(i%stories.length+stories.length)%stories.length;

export default function GlassPosterArchive(){
 const [position,setPosition]=useState(0),[active,setActive]=useState<number|null>(null),[entering,setEntering]=useState(true);
 const stage=useRef<HTMLDivElement>(null),target=useRef(0),current=useRef(0),activeRef=useRef<number|null>(null);
 const drag=useRef({down:false,x:0,y:0,start:0,moved:false});
 const overSequence=useRef(false),pointer=useRef<{x:number;y:number}|null>(null);
 const touchSelected=useRef(false),lastPointer=useRef({x:-1,y:-1});
 const select=(i:number|null)=>{activeRef.current=i;setActive(i)};
 const move=(n:number)=>{select(null);target.current+=n};
 useEffect(()=>{
  let raf=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const entrance=setTimeout(()=>setEntering(false),1100);
  let previous=performance.now();
  const tick=(now:number)=>{const dt=Math.min((now-previous)/1000,.05);previous=now;if(pointer.current){const el=document.elementFromPoint(pointer.current.x,pointer.current.y);overSequence.current=!!el?.closest('[data-poster]')}if(overSequence.current&&!drag.current.down&&!reduced.matches&&!document.hidden&&!stage.current?.querySelector(':focus-visible'))target.current+=dt*.045;const delta=target.current-current.current;if(Math.abs(delta)>.0001){current.current+=delta*(reduced.matches?1:1-Math.exp(-dt*7));setPosition(current.current)}raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);
  const wheel=(e:WheelEvent)=>{e.preventDefault();select(null);const value=Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX;target.current+=Math.max(-.4,Math.min(.4,value*(e.deltaMode===1?.012:.0012)))};
  const el=stage.current!.parentElement!;el.addEventListener('wheel',wheel,{passive:false});
  return()=>{clearTimeout(entrance);cancelAnimationFrame(raf);el.removeEventListener('wheel',wheel)};
 },[]);
 const center=Math.round(position),chosen=active===null?null:stories[wrap(active)];
 return <section className={'glass-archive'+(entering?' is-entering':'')}>
  <StoryWater/><div className="glass-atmosphere" aria-hidden="true"/>
  <nav className="glass-navigation" aria-label="页面导航"><Link href="/caoxudong-digital-garden/">← 返回 / BACK</Link><Link href="/caoxudong-digital-garden/">HOME ↗</Link></nav>
  <header className="glass-heading"><h1>Story <span>动画</span></h1></header>
  <div className="glass-stage" ref={stage} tabIndex={0} aria-label="循环海报，滚轮或拖动浏览，方向键切换" onKeyDown={e=>{if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();move(1)}if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();move(-1)}if(e.key==='Escape')select(null)}}
   onPointerDown={e=>{if(e.button!==0)return;drag.current={down:true,x:e.clientX,y:e.clientY,start:target.current,moved:false};if(e.pointerType==='touch'){const el=(e.target as Element).closest<HTMLElement>('[data-poster]');touchSelected.current=el?activeRef.current===Number(el.dataset.poster):false}}}
   onPointerMove={e=>{const d=drag.current;if(d.down){const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>7){d.moved=true;stage.current?.setPointerCapture(e.pointerId);select(null);target.current=d.start+(-dx+dy)/360}return}if(e.pointerType==='touch')return;pointer.current={x:e.clientX,y:e.clientY};if(Math.hypot(e.clientX-lastPointer.current.x,e.clientY-lastPointer.current.y)<2)return;lastPointer.current={x:e.clientX,y:e.clientY};const el=(e.target as Element).closest<HTMLElement>('[data-poster]');if(el){const i=Number(el.dataset.poster);if(activeRef.current!==i){select(i)}}else select(null)}}
   onPointerLeave={()=>{pointer.current=null;overSequence.current=false;select(null)}} onPointerUp={e=>{drag.current.down=false;if(stage.current?.hasPointerCapture(e.pointerId))stage.current.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{drag.current.down=false;drag.current.moved=true}}
   onClickCapture={e=>{if(drag.current.moved){e.preventDefault();e.stopPropagation();drag.current.moved=false}}}>
   {Array.from({length:15},(_,n)=>center+n-7).map(i=>{const film=stories[wrap(i)],d=i-position,pulled=active===i;return <div key={i} data-poster={i} className={'glass-slot'+(pulled?' is-extracted':'')} style={{'--d':d,'--depth':Math.max(.72,Math.min(1.18,1-d*.035)),'--entry-delay':`${Math.max(0,i-center+5)*38}ms`,zIndex:Math.round(50-d*2)} as CSSProperties}>
    {pulled&&<Link className="glass-source-hit" tabIndex={-1} aria-hidden="true" href={'/caoxudong-digital-garden/story/'+film.slug}/>}
    <div className="glass-entrance"><Link className="glass-card" href={'/caoxudong-digital-garden/story/'+film.slug} tabIndex={Math.abs(i-center)<=2?0:-1} aria-label={'查看 '+film.title} onFocus={e=>{if(e.currentTarget.matches(':focus-visible')){select(i);target.current=i}}} onClick={e=>{if(matchMedia('(hover: none)').matches&&!touchSelected.current){e.preventDefault();select(i)}}}>
     <img src={'/caoxudong-digital-garden/story/'+film.slug+'/poster.webp'} alt={film.title+'海报'} draggable={false}/><span className="glass-card-shine" aria-hidden="true"/><span className="glass-card-id" aria-hidden="true">0{wrap(i)+1} / {film.year}</span>
    </Link></div>
    {pulled&&<Link className="glass-side-title" href={'/caoxudong-digital-garden/story/'+film.slug}><span>{film.title} ↗</span><small>{film.english}</small></Link>}
   </div>})}
  </div>
  {chosen?<aside className="glass-caption" aria-live="polite"><p className="glass-caption-index">STORY / 0{wrap(active!)+1}</p><h2>{chosen.title}</h2><p className="glass-caption-en">{chosen.english}</p><dl><div><dt>作者</dt><dd>{chosen.credits.find(([role])=>role==='导演')?.[1]??'曹旭东'}</dd></div><div><dt>创作时间</dt><dd>{chosen.year}</dd></div><div><dt>媒介</dt><dd>{chosen.technique}</dd></div></dl></aside>:null}
  <footer className="glass-controls"><div><button onClick={()=>move(-1)} aria-label="上一张海报">←</button><span>BROWSE</span><button onClick={()=>move(1)} aria-label="下一张海报">→</button></div></footer>
 </section>
}
