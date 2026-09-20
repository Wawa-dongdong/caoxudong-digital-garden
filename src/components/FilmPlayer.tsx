"use client";
import { useState } from "react";
export default function FilmPlayer({slug,title}:{slug:string;title:string}){
const [error,setError]=useState(false);
return <div className="film-player"><video controls playsInline preload="none" poster={"/caoxudong-digital-garden/story/"+slug+"/still-1.webp"} aria-label={title+"完整动画"} onError={()=>setError(true)}><source src={"/caoxudong-digital-garden/story/"+slug+"/film.mp4"} type="video/mp4"/>你的浏览器不支持视频播放。</video>{error&&<p role="alert">视频暂时无法播放。可以<a href={"/caoxudong-digital-garden/story/"+slug+"/film.mp4"}>打开原视频</a>。</p>}</div>
}
