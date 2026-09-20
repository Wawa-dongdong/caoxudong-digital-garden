"use client";

import { useEffect, useState } from "react";

// Coordinates follow the original illustration's 1824 × 1367 display ratio.
// Separate outlines keep nearby objects and all five paper balls independently reachable.
export const objects = [
  { id:"frog", label:"关于我", href:"/caoxudong-digital-garden/about", points:"106,278 154,231 211,195 213,73 263,13 301,17 327,193 469,196 479,231 347,227 394,284 453,292 532,281 558,302 539,331 452,322 464,384 433,410 298,414 231,391 160,418 105,400", x:310,y:160 },
  { id:"notebook", label:"联系方式", href:"/caoxudong-digital-garden/about#contact", points:"229,489 257,436 325,408 438,411 457,324 449,298 486,260 533,234 764,337 747,362 666,404 633,490 648,527 611,538 560,650 318,549 228,509", x:564,y:413 },
  { id:"projector", label:"动画", href:"/caoxudong-digital-garden/story", points:"759,794 820,668 857,590 1184,684 1195,811 1111,996 958,957 761,879", x:906,y:791 },
  { id:"vase", label:"小东西们", href:"/caoxudong-digital-garden/little-things", points:"1041,390 1122,356 1197,276 1208,339 1276,330 1280,350 1355,277 1308,376 1330,424 1397,389 1382,440 1378,463 1418,517 1363,504 1341,591 1294,523 1286,587 1317,665 1300,724 1270,754 1192,751 1186,683 1113,663 1155,560 1100,568 1124,533 1190,498 1153,456 1132,476 1110,402", x:1272,y:611 },
  { id:"coffee", label:"日常", href:"/caoxudong-digital-garden/life", points:"1442,683 1461,650 1503,636 1554,642 1586,669 1591,692 1620,699 1642,727 1633,752 1591,761 1586,786 1547,800 1480,789 1458,772", x:1530,y:677 },
  { id:"paper-1", label:"小垃圾", href:"/caoxudong-digital-garden/observations", points:"290,847 319,821 351,780 391,795 424,833 418,870 398,900 370,916 308,899", x:354,y:819 },
  { id:"paper-2", label:"小垃圾", href:"/caoxudong-digital-garden/observations", points:"969,655 981,624 1008,613 1040,624 1064,652 1077,693 1056,725 1026,733 997,712 978,686", x:1018,y:627 },
  { id:"paper-3", label:"小垃圾", href:"/caoxudong-digital-garden/observations", points:"1075,693 1088,675 1117,688 1149,710 1148,739 1122,754 1104,776 1072,771 1067,752 1027,758 1041,737 1069,720", x:1111,y:707 },
  { id:"paper-4", label:"小垃圾", href:"/caoxudong-digital-garden/observations", points:"207,1048 207,1031 228,1026 267,1034 286,1047 305,1041 310,1055 333,1053 323,1080 301,1108 297,1126 271,1138 224,1121 198,1087", x:274,y:1044 },
  { id:"paper-5", label:"小垃圾", href:"/caoxudong-digital-garden/observations", points:"90,1101 113,1080 148,1076 158,1046 174,1038 211,1050 224,1080 250,1100 231,1138 214,1166 172,1163 143,1150 102,1150 87,1134", x:155,y:1100 },
];



const sprites = [
  {id:"notebook",file:"7708"},{id:"vase",file:"7706"},
  {id:"projector",file:"7704"},{id:"frog",file:"7702"},{id:"coffee",file:"7709"},
];
const names: Record<string,string> = {frog:"青蛙",notebook:"笔记本",projector:"投影仪",vase:"花瓶",coffee:"咖啡杯"};
const origins: Record<string,[number,number]> = {frog:[330,250],notebook:[495,445],projector:[980,795],vase:[1240,515],coffee:[1540,720]};
const bookOutline="228,503 237,458 269,418 327,390 410,374 451,292 486,260 533,234 766,338 762,356 712,381 669,421 646,488 652,514 610,539 560,650 315,548";

export default function RoomScene() {
  const [active,setActive] = useState<string|null>(null);
  const [reducedMotion,setReducedMotion] = useState(false);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>setReducedMotion(media.matches);
    update(); media.addEventListener("change",update);
    return ()=>media.removeEventListener("change",update);
  },[]);
  const selected=objects.find(item=>item.id===active);
  return <div className="room-scene">
    <svg viewBox="0 0 1824 1367" className="room-canvas" aria-label="小房间互动导航">
      <defs><clipPath id="home-mat"><polygon points="0,0 997,0 1297,425 0,955"/></clipPath>
        {objects.map(item=><clipPath id={"clip-"+item.id} key={item.id}><polygon points={item.points} transform={item.id.startsWith("paper-")?`translate(${item.x} ${item.y+30}) scale(1.13) translate(${-item.x} ${-item.y-30})`:undefined}/></clipPath>)}
        <mask id="background-without-book" maskUnits="userSpaceOnUse" x="0" y="0" width="1824" height="1367">
          <rect width="1824" height="1367" fill="white"/>
          <polygon points={bookOutline} fill="black" stroke="black" strokeWidth="9" strokeLinejoin="round"/>
        </mask>
        {/* Reuse a clear section of the supplied mat beneath the notebook only. */}
        <pattern id="mat-under-book" patternUnits="userSpaceOnUse" x="200" y="230" width="580" height="150" viewBox="330 30 580 150">
          <image href="/caoxudong-digital-garden/images/room-background-v2.jpg" width="1824" height="1367"/>
        </pattern>
        <clipPath id="all-papers">{objects.filter(item=>item.id.startsWith("paper-")).map(item=><polygon key={item.id} points={item.points}/>)}</clipPath>
      </defs>
      <image href="/caoxudong-digital-garden/about/grid-background.jpg" width="1824" height="1367" aria-hidden="true"/><g transform="scale(.935)"><polygon points={bookOutline} fill="url(#mat-under-book)" stroke="url(#mat-under-book)" strokeWidth="10"/>
      <g clipPath="url(#home-mat)"><image data-background="clean" href="/caoxudong-digital-garden/images/room-background-v2.jpg" mask="url(#background-without-book)" width="1824" height="1367" aria-hidden="true"/></g>
      {/* Each object has exactly one image: a still OR its animation, never both. */}
      {sprites.map(sprite=>{
        const isActive=active===sprite.id;
        return <g key={sprite.id} data-sprite={sprite.id} data-state={isActive&&!reducedMotion?"animated":"still"} className={isActive?"hover-art":"sprite-art"} style={{transformOrigin:origins[sprite.id].map(v=>v+"px").join(" ")}} aria-hidden="true">
          <image href={isActive&&!reducedMotion?"/caoxudong-digital-garden/images/hover-"+sprite.file+"-v2.gif":"/caoxudong-digital-garden/images/still-"+sprite.file+"-v2.png"} width="1824" height="1367"/>
        </g>;
      })}
      {objects.filter(item=>item.id.startsWith("paper-")).map(item=><g key={item.id} className={active===item.id?"hover-art":"sprite-art"} data-sprite={item.id} style={{transformOrigin:item.x+"px "+(item.y+30)+"px"}} aria-hidden="true">
        <image href="/caoxudong-digital-garden/images/paper-balls.png" clipPath={"url(#clip-"+item.id+")"} width="1824" height="1367"/>
      </g>)}
      {objects.map(item=><a key={item.id} href={item.href} aria-label={item.label+"（"+(names[item.id] || "纸团 "+item.id.split("-")[1])+"）"} className={"room-object "+(active===item.id?"is-active":"")} data-object={item.id} onPointerEnter={()=>setActive(item.id)} onPointerLeave={()=>setActive(null)} onFocus={()=>setActive(item.id)} onBlur={()=>setActive(null)}>
        <polygon className="object-hit" points={item.points}/>
      </a>)}
    </g><image className="room-welcome" href="/caoxudong-digital-garden/images/home-welcome.png" width="1824" height="1367" aria-label="欢迎来到我的电子小屋，点击不同图标可以去往不同空间" pointerEvents="none"/></svg>
    {selected && <span className="object-label" style={{left:selected.x*.935/1824*100+"%",top:selected.y*.935/1367*100+"%"}}>{selected.label}<span aria-hidden="true"> ↗</span></span>}
  </div>;
}

