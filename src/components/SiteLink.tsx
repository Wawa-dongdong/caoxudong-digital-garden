"use client";
import Link from 'next/link';
import type { ComponentProps } from 'react';
const base = '/caoxudong-digital-garden';
/** Next adds basePath to links; asset and native-anchor URLs already include it. */
export default function SiteLink({href,...props}:ComponentProps<typeof Link>){
 const path = typeof href === 'string' && (href === base || href.startsWith(base+'/')) ? href.slice(base.length) || '/' : href;
 return <Link {...props} href={path}/>;
}
