"use client";
import {useEffect,useRef,useState} from 'react';
import Link from "@/components/SiteLink";
import {littleThings as films} from '@/data/littleThings';
export default function LittleCinema(){
 const [hover,setHover]=useState<number|null>(null),[playing,setPlaying]=useState<number|null>(null),[paused,setPaused]=useState(false),[error,setError]=useState(false);
 const screen=useRef<HTMLDivElement>(null);
 const reel=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null),cycle=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);
 const offset=useRef(0),velocity=useRef(0),hold=useRef(false),manualPause=useRef(false),touch=useRef<number|null>(null),dragged=useRef(false);
 const show=(i:number)=>{setPlaying(i);setHover(null);setError(false);if(screen.current)screen.current.scrollTop=0};
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,prev=performance.now();
 const step=(now:number)=>{const dt=Math.min((now-prev)/1000,.05);prev=now;const h=cycle.current?.offsetHeight??0;if(h&&!manualPause.current&&(!hold.current||Math.abs(velocity.current)>1)&&!media.matches){offset.current=((offset.current+((hold.current?0:18)+velocity.current)*dt)%h+h)%h;track.current!.style.transform=`translateY(${-offset.current}px)`;velocity.current*=Math.exp(-dt*4)}raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step);
 const wheel=(e:WheelEvent)=>{e.preventDefault();const delta=e.deltaY||e.deltaX;if(media.matches||manualPause.current){const h=cycle.current?.offsetHeight??1;offset.current=((offset.current+delta)%h+h)%h;track.current!.style.transform=`translateY(${-offset.current}px)`}else velocity.current=Math.max(-950,Math.min(950,velocity.current+delta*3))};const node=reel.current!;node.addEventListener('wheel',wheel,{passive:false});return()=>{cancelAnimationFrame(raf);node.removeEventListener('wheel',wheel)};
 },[]);
 useEffect(()=>{if(playing!==null)video.current?.play().catch(()=>{/* Native controls remain available when autoplay is restricted. */})},[playing]);
 const index=hover??playing,film=index===null?null:films[index],current=playing===null?null:films[playing];
 const preview=playing!==null&&hover!==null&&hover!==playing;
 return <section className="little-cinema">
 <nav className="little-nav" aria-label="页面导航"><Link href="/caoxudong-digital-garden/">← 返回 / BACK</Link><Link href="/caoxudong-digital-garden/">HOME ↗</Link></nav>
 <div className="little-reel" ref={reel} aria-label="小东西们循环胶卷" onPointerEnter={()=>hold.current=true} onPointerLeave={()=>{hold.current=false;setHover(null)}} onPointerDown={e=>{if(e.pointerType==='touch'){touch.current=e.clientY;dragged.current=false}}} onPointerMove={e=>{if(e.pointerType==='touch'&&touch.current!==null){const dy=touch.current-e.clientY;if(Math.abs(dy)>4)dragged.current=true;velocity.current=Math.max(-900,Math.min(900,dy*30));touch.current=e.clientY}}} onPointerUp={()=>touch.current=null} onPointerCancel={()=>touch.current=null}>
  <div className="little-track" ref={track}>{[0,1,2].map(copy=><div className="little-cycle" key={copy} ref={copy===0?cycle:undefined}>{films.map((f,i)=><div className="little-cell" key={f.slug}>
   <div className="little-frame-code" aria-hidden="true">{String(i+1).padStart(2,'0')} / {f.year}<span>{playing===i?'PLAYING':'FRAME'}</span></div>
   <button className={'little-frame'+(playing===i?' is-playing':'')} tabIndex={copy===0?0:-1} aria-label={'播放 '+f.title} aria-pressed={playing===i} onPointerEnter={()=>setHover(i)} onFocus={e=>{hold.current=true;setHover(i);if(e.currentTarget.matches(':focus-visible')){velocity.current=0;offset.current=e.currentTarget.parentElement!.offsetTop;track.current!.style.transform=`translateY(${-offset.current}px)`}}} onBlur={()=>{hold.current=false;setHover(null)}} onClick={()=>{if(dragged.current){dragged.current=false;return}show(i)}}>
   <img src={'/caoxudong-digital-garden/little-things/'+f.slug+'/'+f.still} alt={f.title+'关键帧'} draggable={false}/>
   </button><div className="little-frame-bottom"><span>{f.title}</span><span>{playing===i?'■':'▷'}</span></div>
  </div>)}</div>)}</div>
 </div>
 <div className="little-console">
  <header className="little-heading"><p>CAO XUDONG / SMALL ANIMATIONS</p><h1>Little Things<span>小东西们</span></h1><div className="little-console-status"><span>ARCHIVE_08</span><span>{current?'● NOW PLAYING':'○ READY TO EXPLORE'}</span></div></header>
  <div ref={screen} className={'little-screen-content'+(current?' has-video':'')}>
   {current&&<div className="little-player"><div className="little-player-bar"><span>▶ {current.title}</span><button aria-label="关闭视频，返回作品信息" onClick={()=>{video.current?.pause();setHover(playing);setPlaying(null)}}>关闭 ×</button></div><video ref={video} key={current.slug} controls playsInline preload="metadata" poster={'/caoxudong-digital-garden/little-things/'+current.slug+'/'+current.still} aria-label={current.title+'完整动画'} onError={()=>setError(true)} src={'/caoxudong-digital-garden/little-things/'+current.slug+'/film.mp4'}/>{error&&<p role="alert">视频暂时无法播放。<a href={'/caoxudong-digital-garden/little-things/'+current.slug+'/film.mp4'}>打开原视频 ↗</a></p>}</div>}
   {film?<article className="little-film-info" aria-live="polite"><p className="little-info-index">{preview?'PREVIEW / 点击左侧画面切换播放':'FILE / '+String(index!+1).padStart(2,'0')}</p><h2>{film.title}</h2><p className="little-english">{film.english}</p><dl><div><dt>YEAR / 时间</dt><dd>{film.year}</dd></div><div><dt>TIME / 时长</dt><dd>{film.duration}</dd></div><div><dt>MEDIUM / 媒介</dt><dd>{film.technique}</dd></div></dl><p className="little-credits-label">CREDITS / 制作人员</p><p className="little-credits">{film.credits}</p></article>:null}
  </div>
  <footer className="little-bottom"><button className="little-reel-pause" aria-pressed={paused} onClick={()=>{manualPause.current=!manualPause.current;setPaused(manualPause.current)}}>{paused?'▷ 胶卷继续':'Ⅱ 胶卷暂停'}</button><button className="little-next" onClick={()=>show(((playing??hover??-1)+1)%films.length)}>下一个动画 <span>→</span></button></footer>
 </div>
 </section>
}

