import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "@/components/SiteLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
export const metadata: Metadata = {title:{default:"CAO XUDONG Digital Garden",template:"%s · CAO XUDONG"},description:"曹旭东的个人创作空间"};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="zh-CN"><body><a className="skip-link" href="#main">跳到内容</a><div className="site-shell"><aside className="sidebar"><Link href="/caoxudong-digital-garden/" className="brand">CAO<br/>XUDONG<span>Digital Garden</span></Link><Navbar/></aside><div className="content-shell"><main id="main">{children}</main><Footer/></div></div></body></html>}
