"use client";
import {useEffect,useRef} from "react";

// Distort the supplied photograph itself; CSS supplies the same image as a fallback.
export default function StoryWater(){
 const water=useRef<HTMLCanvasElement>(null),dust=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const c=water.current!,p=dust.current!,ctx=p.getContext("2d")!;
  const gl=c.getContext("webgl",{alpha:true,antialias:false});
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  let raf=0,ready=false,disposed=false,last=0,lastDust=0;
  const waves:{x:number;y:number;t:number}[]=[];
  const pixels:{x:number;y:number;t:number;dx:number;dy:number;size:number}[]=[];
  let program:WebGLProgram|null=null,texture:WebGLTexture|null=null,buffer:WebGLBuffer|null=null;
  const shaders:WebGLShader[]=[];
  const image=new Image();
  if(gl){
   const compile=(type:number,source:string)=>{const s=gl.createShader(type)!;shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);return s};
   program=gl.createProgram()!;
   gl.attachShader(program,compile(gl.VERTEX_SHADER,'attribute vec2 a; varying vec2 uv; void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}'));
   gl.attachShader(program,compile(gl.FRAGMENT_SHADER,`precision mediump float;
    varying vec2 uv; uniform sampler2D photo; uniform vec2 screen; uniform vec2 imgSize; uniform float time; uniform vec3 waves[8];
    void main(){vec2 pos=vec2(uv.x,1.-uv.y)*screen;vec2 shift=vec2(0.);float light=0.;
     for(int i=0;i<8;i++){float age=time-waves[i].z;if(age>=0.&&age<2.4){vec2 delta=pos-waves[i].xy;float d=length(delta);float ring=d-age*105.;float envelope=exp(-ring*ring/1700.)*(1.-age/2.4);float wave=sin(ring*.13)*envelope;shift+=delta/max(d,1.)*wave*12.;light+=cos(ring*.13)*envelope*.055;}}
     vec2 st=(pos+shift)/screen;float s=max(screen.x/imgSize.x,screen.y/imgSize.y);vec2 extent=imgSize*s;st=(st*screen+(extent-screen)*.5)/extent;
     vec3 color=texture2D(photo,st).rgb;gl_FragColor=vec4(color+light,1.);
    }`));
   gl.linkProgram(program);
   if(gl.getProgramParameter(program,gl.LINK_STATUS)){
    gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const attr=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
    texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    image.onload=()=>{if(disposed)return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);ready=true};image.src='/caoxudong-digital-garden/images/story-water.jpg';
   }
  }
  const resize=()=>{const ratio=Math.min(devicePixelRatio,1.5);c.width=innerWidth*ratio;c.height=innerHeight*ratio;p.width=innerWidth*ratio;p.height=innerHeight*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);gl?.viewport(0,0,c.width,c.height)};resize();window.addEventListener('resize',resize);
  const move=(e:PointerEvent)=>{if(media.matches||e.pointerType==='touch')return;const t=performance.now()/1000;
   if(!(e.target as Element).closest('.pixel-reel,nav,.pixel-film-info,.glass-slot,.glass-caption,.glass-controls')&&t-last>.11){waves.push({x:e.clientX,y:e.clientY,t});if(waves.length>8)waves.shift();last=t}
   if(t-lastDust>.025){for(let n=0;n<2;n++)pixels.push({x:e.clientX+(Math.random()-.5)*12,y:e.clientY+(Math.random()-.5)*12,t,dx:(Math.random()-.5)*20,dy:10+Math.random()*20,size:Math.random()>.65?4:2});lastDust=t}
  };
  window.addEventListener('pointermove',move);
  const draw=()=>{const t=performance.now()/1000;ctx.clearRect(0,0,innerWidth,innerHeight);
   if(media.matches){waves.length=0;pixels.length=0}
   if(ready&&gl&&program){gl.useProgram(program);gl.uniform2f(gl.getUniformLocation(program,'screen'),innerWidth,innerHeight);gl.uniform2f(gl.getUniformLocation(program,'imgSize'),image.width,image.height);gl.uniform1f(gl.getUniformLocation(program,'time'),t);const values=new Float32Array(24);for(let i=0;i<8;i++){const w=waves[i];values[i*3]=w?.x??0;values[i*3+1]=w?.y??0;values[i*3+2]=w?.t??-10000}gl.uniform3fv(gl.getUniformLocation(program,'waves[0]'),values);gl.drawArrays(gl.TRIANGLES,0,6)}
   for(const w of waves){const age=t-w.t;if(age<0||age>2.4)continue;const fade=1-age/2.4,r=age*105;ctx.beginPath();ctx.ellipse(w.x,w.y,r,r*.7,0,0,Math.PI*2);ctx.strokeStyle=`rgba(88,149,212,${fade*.16})`;ctx.lineWidth=1.2;ctx.stroke();for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ctx.fillStyle=`rgba(39,111,222,${fade*.35})`;ctx.fillRect(Math.round((w.x+Math.cos(a)*r)/3)*3,Math.round((w.y+Math.sin(a)*r*.7)/3)*3,2,2)}}
   for(let i=pixels.length-1;i>=0;i--){const v=pixels[i],age=t-v.t;if(age>0.8){pixels.splice(i,1);continue}ctx.fillStyle=`rgba(35,108,235,${(1-age/.8)*.85})`;ctx.fillRect(Math.round((v.x+age*v.dx)/2)*2,Math.round((v.y+age*v.dy)/2)*2,v.size,v.size)}
   raf=requestAnimationFrame(draw);
  };draw();
  return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);if(gl){shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);gl.deleteTexture(texture);gl.deleteBuffer(buffer)}};
 },[]);
 return <><canvas ref={water} className="story-water" aria-hidden="true"/><canvas ref={dust} className="story-pixel-dust" aria-hidden="true"/></>;
}
