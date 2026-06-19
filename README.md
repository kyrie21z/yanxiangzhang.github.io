# Yanxiang Zhang Web

Yanxiang Zhang 的个人博客与学习笔记站点，基于 Astro 构建。站点用于整理论文分享和个人思考。

线上站点：<https://yanxiangzhang.com>

## 技术栈

- [Astro](https://astro.build/) 5
- Astro Content Collections 管理 Markdown / MDX 内容
- `@astrojs/mdx` 支持 MDX
- `@astrojs/rss` 生成 RSS
- `@astrojs/sitemap` 生成 sitemap
- `remark-math` + `rehype-katex` 渲染数学公式
- GitHub Actions 部署到 GitHub Pages

## 功能概览

- 个人首页：展示头像、简介、研究兴趣和最近更新的笔记。
- 博客分类页：按 `src/content/blog` 下的目录层级生成一级分类和二级分类页面。
- 文章详情页：支持 Markdown / MDX、发布日期、更新日期、封面图、JSON-LD 和自动目录。
- 全站内容入口：`/blog` 页面提供分类列表和前端搜索。
- RSS 与 sitemap：构建时生成 `rss.xml` 和 sitemap 文件。
- Obsidian 发布脚本：可从本地 `Obsidian Vault` 增量同步笔记和图片到 Astro 内容目录。

## 目录结构

```text
.
├── .github/workflows/astro.yml       # GitHub Pages 部署流程
├── Obsidian Vault/                   # 本地 Obsidian 笔记源
├── public/                           # 静态资源，如 favicon、字体
├── scripts/
│   ├── publish-obsidian.mjs          # Obsidian -> Astro 内容转换脚本
│   └── .publish-manifest.json        # 增量同步记录
├── src/
│   ├── assets/                       # 由 Astro 处理的图片资源
│   ├── components/                   # 站点通用组件
│   ├── content/
│   │   └── blog/                     # 博客内容集合
│   ├── layouts/                      # 页面布局
│   ├── pages/                        # Astro 路由页面
│   └── styles/                       # 全局样式
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 内容结构

博客文章放在 `src/content/blog/` 下，目录会直接影响最终 URL。

示例：

```text
src/content/blog/
├── CS-Major-Courses/
│   └── Introduction-To-Algorithms/
├── Paper-Sharing/
└── Personal-Insights/
```

对应路由示例：

```text
/blog/CS-Major-Courses/Introduction-To-Algorithms/
/blog/Paper-Sharing/
```

每篇文章需要包含 frontmatter：

```md
---
title: '文章标题'
description: '文章摘要'
pubDate: '2026-04-14'
updatedDate: '2026-04-23'
heroImage: '../../assets/example.png'
---
```

`updatedDate` 和 `heroImage` 是可选字段。

## 本地开发

安装依赖：

```sh
npm install
```

启动开发服务器：

```sh
npm run dev
```

默认访问地址：

```text
http://localhost:4321
```

生产构建：

```sh
npm run build
```

本地预览构建结果：

```sh
npm run preview
```

## 从 Obsidian 同步内容

项目包含 `scripts/publish-obsidian.mjs`，用于将 `Obsidian Vault/` 中符合规则的笔记发布到 `src/content/blog/`。

执行：

```sh
node scripts/publish-obsidian.mjs
```

脚本会处理：

- 按文件名规则映射分类目录。
- 跳过索引页、空文件和未匹配分类的笔记。
- 去重带哈希后缀的同名笔记。
- 将 Obsidian 双链转换为站内链接。
- 将 Obsidian 图片引用转换为 Astro 可识别的相对图片路径。
- 复制 `Obsidian Vault/images/` 中的图片到 `src/assets/`。
- 使用 `scripts/.publish-manifest.json` 做增量同步。

## 部署

仓库通过 `.github/workflows/astro.yml` 部署到 GitHub Pages。

触发方式：

- 推送到 `main` 分支。
- 在 GitHub Actions 页面手动触发 `workflow_dispatch`。

站点域名由根目录 `CNAME` 配置为：

```text
yanxiangzhang.com
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产版本到 `dist/` |
| `npm run preview` | 预览生产构建结果 |
| `npm run astro -- --help` | 查看 Astro CLI 帮助 |
| `node scripts/publish-obsidian.mjs` | 从 Obsidian Vault 同步博客内容 |
