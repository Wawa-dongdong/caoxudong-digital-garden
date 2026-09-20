"use client";
import Link from "@/components/SiteLink";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/site";

export default function Navbar() {
  const pathname = "/caoxudong-digital-garden" + usePathname();
  return <nav aria-label="主导航"><p className="eyebrow nav-caption">TAKE YOUR TIME ↓</p><ul className="nav-list">{navigation.map((item,index)=><li key={item.href} className={"nav-item nav-paper-"+index}><Link href={item.href} aria-current={(pathname===item.href || (item.href!=="/caoxudong-digital-garden/" && pathname.startsWith(item.href+"/")))?"page":undefined}><span className="nav-en">{item.en}</span><span className="nav-zh">{item.zh}</span></Link></li>)}</ul></nav>;
}
