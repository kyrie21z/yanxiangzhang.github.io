---
title: "Order Statistic 顺序统计量"
description: "核心任务: Top K问题: 在一个数组中找第k小/大的元素 实现方法: 1. Quick Select 快速选择 2. BFPRT Median of Medians BFPRT选择算法 总结 Quick Select 其实就是只走一边的Quick Sort. Quick Select 虽然worst case..."
pubDate: "2026-04-08"
---
## 核心任务: 
	Top-K问题: 在一个数组中找第k小/大的元素
## 实现方法:
1. [Quick Select 快速选择](/blog/cs-major-courses/introduction-to-algorithms/quick-select-快速选择/)
2. [BFPRT - Median of Medians BFPRT选择算法](/blog/cs-major-courses/introduction-to-algorithms/bfprt---median-of-medians-bfprt选择算法/)

## 总结
Quick Select 其实就是只走一边的Quick Sort.
Quick Select 虽然worst case时间复杂度为$O(n^2)$, 但worst case不容易触发, 所以用途依然最广泛.
BFPRT虽然永远是线性时间, 但是常数大, 实际使用耗时往往低于Quick Select
