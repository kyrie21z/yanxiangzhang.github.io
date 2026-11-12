---
title: 'Agent Memory System：让 Agent 记住你纠正过的那句话'
description: '软件工程课程汇报的 PPT：从 Claude Code、Hermes、Mem0 到 Graphiti，沿着存储、检索、维护三个问题，看一个 Agent 的跨会话记忆该怎么做。'
pubDate: '2026-11-12'
---

这是我在软件工程课程上做的一次汇报，核心部分约 20 分钟，另配有[演示程序](https://yanxiangzhang.com/agent-memory-demo/)。

起点是做科研时反复遇到的一件小事：我纠正过 Agent 的行为，在当前会话里它确实改了，换一个新会话，同样的事又来了。纠正只进了 Context，没有变成 Memory。

汇报围绕一个记忆系统必须回答的三个问题展开：**存什么、怎么找、怎么维护**。四个产品对应四种存法，每一页讲一个缺陷，再引出下一种：

1. Claude Code：写进文件，目录常驻，细节按需读。
2. Hermes：记录多了，存进数据库，按关键词查。
3. Mem0：换个说法也要找到，用向量做语义检索。
4. Graphiti：把事实存成图，沿着关系走，一条不漏。

之后讨论读取和写入的时机、新信息与旧记忆冲突怎么办、记忆越积越多怎么保持可用，最后把读取、写入和维护接回 Agent。

## 演示

汇报配有一个演示程序：同一个 Agent，只换记忆系统，看四种存法分别怎么存、怎么找、花多少。这里是它的回放页面：

[记忆系统 · 演示回放](https://yanxiangzhang.com/agent-memory-demo/)

## 下载

[Agent Memory System 核心 01–16（PPTX）](/files/Agent-Memory-System-Core-01-16.pptx)

文件较大（约 17 MB），因为内嵌了字体。每页的演讲者备注里附有讲稿。
