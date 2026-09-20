"use client";
import {useEffect,useRef} from 'react';
type Point={x:number;y:number};
export default function PaperUnfold({origin,onReveal,onDone}:{origin:Point;onReveal:()=>void;onDone:()=>void}){const ref=useRef<HTMLCanvasElement>(null);useEffect(()=>{let frame=0,cancel=false;const paper=new Image(),ball=new Image();paper.src='/caoxudong-digital-garden/scraps/paper.jpg';ball.src='/caoxudong-digital-garden/scraps/crumple.jpg';Promise.all([paper.decode(),ball.decode()]).then(()=>{if(cancel)return;const canvas=ref.current!,ctx=canvas.getContext('2d')!,width=innerWidth,height=innerHeight,dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.scale(dpr,dpr);const cutout=document.createElement('canvas');cutout.width=ball.width;cutout.height=ball.height;const bc=cutout.getContext('2d')!;bc.drawImage(ball,0,0);const pixels=bc.getImageData(0,0,ball.width,ball.height);for(let i=0;i<pixels.data.length;i+=4){const light=Math.max(pixels.data[i],pixels.data[i+1],pixels.data[i+2]);pixels.data[i+3]=Math.min(255,Math.max(0,(light-12)*15))}bc.putImageData(pixels,0,0);const start=performance.now(),W=Math.min(width*.86,height*.7055,722.5),H=Math.min(height*.83,850);const texture=document.createElement('canvas');texture.width=534;texture.height=696;texture.getContext('2d')!.drawImage(paper,106,24,534,696,0,0,534,696);
function triangle(a:Point,b:Point,c:Point,ta:Point,tb:Point,tc:Point,shade:number){ctx.save();ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.clip();const det=ta.x*(tb.y-tc.y)+tb.x*(tc.y-ta.y)+tc.x*(ta.y-tb.y);const A=(a.x*(tb.y-tc.y)+b.x*(tc.y-ta.y)+c.x*(ta.y-tb.y))/det,B=(a.y*(tb.y-tc.y)+b.y*(tc.y-ta.y)+c.y*(ta.y-tb.y))/det,C=(a.x*(tc.x-tb.x)+b.x*(ta.x-tc.x)+c.x*(tb.x-ta.x))/det,D=(a.y*(tc.x-tb.x)+b.y*(ta.x-tc.x)+c.y*(tb.x-ta.x))/det,E=(a.x*(tb.x*tc.y-tc.x*tb.y)+b.x*(tc.x*ta.y-ta.x*tc.y)+c.x*(ta.x*tb.y-tb.x*ta.y))/det,F=(a.y*(tb.x*tc.y-tc.x*tb.y)+b.y*(tc.x*ta.y-ta.x*tc.y)+c.y*(ta.x*tb.y-tb.x*ta.y))/det;ctx.transform(A,B,C,D,E,F);ctx.drawImage(texture,0,0);ctx.fillStyle=`rgba(13,26,42,${shade})`;ctx.fillRect(0,0,534,696);ctx.restore()}
let revealed=false;
const smooth=(v:number)=>{const n=Math.max(0,Math.min(1,v));return n*n*(3-2*n)};
const tick=(now:number)=>{
 const t=Math.min(1,(now-start)/2400),p=Math.max(0,(t-.13)/.87);
 // Separate the pull, corner release and damped settling; folds relax at different times.
 const spring=(v:number)=>1-Math.exp(-9*v)*(Math.cos(7*v)+(9/7)*Math.sin(7*v));
 const settle=smooth((p-.72)/.28),ease=spring(p)*(1-settle)+settle;
 const travel=smooth(t/.52),cx=origin.x+(width/2-origin.x)*travel,cy=origin.y+(height/2-origin.y)*travel-Math.sin(travel*Math.PI)*36;
 ctx.clearRect(0,0,width,height);
 if(t<.28){ctx.save();ctx.globalAlpha=1-smooth((t-.15)/.13);const size=130+85*smooth(t/.28);ctx.translate(cx,cy);ctx.rotate(-.12*(1-travel));ctx.drawImage(cutout,-size/2,-size*.62,size,size*1.25);ctx.restore()}
 if(t>.13){const N=18,vertices:Point[][]=[];
 for(let y=0;y<=N;y++){vertices[y]=[];for(let x=0;x<=N;x++){
 const u=x/N-.5,v=y/N-.5,delay=.065*(Math.sin(u*5+v*3)+1),local=smooth((p-delay)/(.84-delay)),fold=Math.pow(1-local,1.6);
 const ridge=Math.sin(u*15+v*5)*Math.cos(v*11-u*3),z=ridge*105*fold,scaleX=.19+.81*ease,scaleY=.19+.81*(spring(Math.max(0,p-.035))*(1-settle)+settle);
 const curl=Math.sin((u+.5)*Math.PI)*Math.sin((v+.5)*Math.PI);
 vertices[y][x]={x:cx+(u*W*scaleX+Math.sin(v*10+u*7)*38*fold)*(850/(850-z)),y:cy+(v*H*scaleY+Math.sin(u*12-v*8)*52*fold+curl*18*Math.sin(p*15)*Math.exp(-p*4))*(850/(850-z))};
 }}
 ctx.globalAlpha=smooth((t-.13)/.12)*(1-smooth((t-.79)/.21));
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
 const a=vertices[y][x],b=vertices[y][x+1],c=vertices[y+1][x],d=vertices[y+1][x+1],ta={x:x/N*534,y:y/N*696},tb={x:(x+1)/N*534,y:y/N*696},tc={x:x/N*534,y:(y+1)/N*696},td={x:(x+1)/N*534,y:(y+1)/N*696};
 const shade=(.05+.24*Math.abs(Math.sin(x*.7+y*.4)))*Math.pow(1-smooth(p/.88),1.5);
 triangle(a,b,c,ta,tb,tc,shade);triangle(b,d,c,tb,td,tc,shade*.8);
 }ctx.globalAlpha=1;
 }
 if(t>=.79&&!revealed){revealed=true;onReveal()}
 if(t<1)frame=requestAnimationFrame(tick);else onDone()
};frame=requestAnimationFrame(tick)}).catch(()=>{if(!cancel){onReveal();onDone()}});return()=>{cancel=true;cancelAnimationFrame(frame)}},[origin,onReveal,onDone]);return <canvas ref={ref} className="scrap-unfold" aria-hidden="true"/>}
