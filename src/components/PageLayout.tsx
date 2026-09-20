import type { ReactNode } from "react";
export default function PageLayout({en,zh,children}:{en:string;zh:string;children:ReactNode}){return <><header className="page-heading"><p className="eyebrow">{en.toUpperCase()}</p><h1>{zh}</h1></header>{children}</>}
