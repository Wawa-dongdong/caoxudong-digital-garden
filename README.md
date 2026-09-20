# caoxudong Digital Garden

曹旭东的个人作品网站。Next.js 静态导出，部署到 GitHub Pages。

## 本地开发与发布

需要 Node.js 22 和 pnpm 10。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

开发访问 `/caoxudong-digital-garden/`。生产静态文件输出到 `out/`。
推送 `main` 分支后，GitHub Actions 自动构建并发布。
仓库名称与 `next.config.mjs` 的 `basePath`、源码中的资源前缀保持一致。
`SiteLink` 在 Next.js 链接处理前移除已有前缀，避免重复添加。
Contact 使用静态兼容的客户端跳转，定位 About 页的联系方式区域。

## 媒体

所有 22 段视频均保留原有分类、顺序、完整内容与音轨；发布版采用最高 720p、30 fps 的 H.264/AAC，并启用 faststart。未裁切画面，保留宽高比。原始高分辨率素材不在本仓库中。

作品、图像与文字版权归原权利人所有。此仓库不授予素材再使用许可。
