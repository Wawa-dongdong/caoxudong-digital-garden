"use client";
import {useEffect,useRef,useState} from "react";
import Link from "@/components/SiteLink";
import {stories} from "@/data/stories";
const wrap=(n:number)=>((n%stories.length)+stories.length)%stories.length;
export default function PosterStack(){
 const [position,setPosition]=useState(0),[active,setActive]=useState<number|null>(null);
 const [last,setLast]=useState<number|null>(null);
 const target=useRef(0),current=useRef(0),stage=useRef<HTMLDivElement>(null);
 const drag=useRef({down:false,x:0,y:0,start:0,moved:false});
 useEffect(()=>{let frame=0;let disposed=false;const tick=()=>{const delta=target.current-current.current;if(Math.abs(delta)>.001){current.current+=delta*(window.matchMedia("(prefers-reduced-motion: reduce)").matches?1:.14);setPosition(current.current)}if(!disposed)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);
 const el=stage.current;const wheel=(e:WheelEvent)=>{e.preventDefault();setActive(null);setLast(null);target.current+=(Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX)*(e.deltaMode===1?.035:.0035)};
 el?.addEventListener("wheel",wheel,{passive:false});
 return()=>{disposed=true;cancelAnimationFrame(frame);el?.removeEventListener("wheel",wheel)}},[]);
 const move=(delta:number)=>{setActive(null);setLast(null);target.current+=delta};
 const center=Math.round(position),chosen=stories[wrap(active??last??center)];
 return <section className="poster-experience" aria-label="循环动画海报">
 <div className="poster-stage" ref={stage} tabIndex={0} aria-label="滚动或拖动海报；左右方向键切换" onKeyDown={e=>{if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();move(1)}if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();move(-1)}}}
 onPointerDown={e=>{if(e.button!==0)return;drag.current={down:true,x:e.clientX,y:e.clientY,start:target.current,moved:false}}}
 onPointerMove={e=>{const d=drag.current;if(!d.down)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>6){d.moved=true;stage.current?.setPointerCapture(e.pointerId);setActive(null);setLast(null);target.current=d.start+(-dx+dy)/160}}}
 onPointerUp={()=>{drag.current.down=false}} onPointerCancel={()=>{drag.current.down=false}}
 onClickCapture={e=>{if(drag.current.moved){e.preventDefault();e.stopPropagation();drag.current.moved=false}}}>
 {Array.from({length:11},(_,i)=>center+i-5).map(i=>{const film=stories[wrap(i)],d=i-position,selected=active===i;return <Link key={i} href={"/caoxudong-digital-garden/story/"+film.slug} className={"stack-poster"+(selected?" is-pulled":"")} style={{"--distance":d,zIndex:selected?100:Math.round(50-d*2)} as React.CSSProperties} onPointerEnter={()=>{if(!drag.current.down){setActive(i);setLast(i)}}} onPointerLeave={()=>{if(!drag.current.down)setActive(null)}} onFocus={()=>{setActive(i);setLast(i)}} onBlur={()=>setActive(null)} aria-label={"查看 "+film.title}>
 <img src={"/caoxudong-digital-garden/story/"+film.slug+"/poster.webp"} alt={film.title+"海报"} draggable={false}/><span className="poster-inline-name">{film.title} ↗</span></Link>})}
 </div>
 <div className="stack-caption" aria-live="polite"><p>{chosen.year} / {chosen.technique}</p><Link href={"/caoxudong-digital-garden/story/"+chosen.slug}>{chosen.title}<span> ↗</span></Link><small>{chosen.english}</small></div>
 <div className="stack-controls"><p>滚动浏览 · 拖动海报 · 悬停抽取</p><div><button onClick={()=>move(-1)} aria-label="上一张海报">←</button><span>无限循环 / LOOP</span><button onClick={()=>move(1)} aria-label="下一张海报">→</button></div></div>
 </section>
}
