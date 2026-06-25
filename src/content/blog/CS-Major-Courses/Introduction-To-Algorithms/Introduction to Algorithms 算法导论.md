---
title: "Introduction to Algorithms 算法导论"
description: "重点 第一章 What is Algorithm 1. 算法的概念 2. 算法定义中的 5 个性质: 输入, 输出, 确定性, 有穷性, 有效性 第二章 算法设计与分析基础 1. 如何做算法设计, 算法分析 1. 基本思想 2. 具体过程 3. 伪代码 4. 时空间复杂度 5. 需要问题具有的性质 6. 典型例子..."
pubDate: "2026-06-24"
pinned: true
---
# 重点

## 第一章 [What is Algorithm](/blog/cs-major-courses/introduction-to-algorithms/what-is-algorithm/)

1. 算法的概念
2. 算法定义中的 5 个性质: 输入, 输出, 确定性, 有穷性, 有效性

## 第二章 算法设计与分析基础

1. 如何做算法设计, 算法分析
	1. 基本思想
	2. 具体过程
	3. 伪代码
	4. 时空间复杂度
	5. 需要问题具有的性质
	6. 典型例子
2. 复杂度不确定: 条件判断情况
3. 最好情况, 平均情况, 最坏情况
4. 递推表达式
5. 归并排序

## 第三章 [Asymptotic Notation & Analysis](/blog/cs-major-courses/introduction-to-algorithms/asymptotic-notation--analysis/) 渐进记号与渐进分析

1. 渐进记号, 渐进分析: n 趋于无穷情况的复杂度 $O,\Theta$
2. f(x) = O(...) 其实表示"属于"
3. 渐进记号写在左边和写在右边的区别 [Asymptotic Notation Tips](/blog/cs-major-courses/introduction-to-algorithms/asymptotic-notation-tips/)

## 第四章 递归表达式求解 & 分治策略

1. 递归表达式的求解
	1. 递归树 [Recursion Tree Method 递归树法](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/)
	2. 代入法 [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/)
	3. 主方法 [Master Method 主方法](/blog/cs-major-courses/introduction-to-algorithms/master-method-主方法/)
	4. 迭代展开法 [Iterating the Recurrence 迭代展开法](/blog/cs-major-courses/introduction-to-algorithms/iterating-the-recurrence-迭代展开法/)
2. 分治策略
	1. 基本思想, 具体过程, 伪代码, 时空间复杂度
	2. 需要具有最优子结构
	3. 典型例子

## 第六章 [Heap Sort 堆排序](/blog/cs-major-courses/introduction-to-algorithms/heap-sort-堆排序/)

## 第七章 [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/)

1. 为什么快速排序时间复杂度为 O(n²) 仍然可以称为"快速"

## 第八章 [Linear Time Sort 线性时间排序](/blog/cs-major-courses/introduction-to-algorithms/linear-time-sort-线性时间排序/)

1. 计数排序和基数排序重要, 桶排序了解
2. 计数排序: 非线性时间的条件 [Counting Sort 计数排序](/blog/cs-major-courses/introduction-to-algorithms/counting-sort-计数排序/)
3. 基数排序: [Radix Sort 基数排序](/blog/cs-major-courses/introduction-to-algorithms/radix-sort-基数排序/)
4. 概念: 稳定排序, 置换排序

## 第九章 顺序统计

1. 顺序统计的概念
2. 同时找出最小值和最大值, 需要多少次比较
3. 期望为线性时间的选择算法 [Quick Select 快速选择](/blog/cs-major-courses/introduction-to-algorithms/quick-select-快速选择/)
4. 最坏情况为线性时间的选择算法 [BFPRT - Median of Medians BFPRT选择算法](/blog/cs-major-courses/introduction-to-algorithms/bfprt---median-of-medians-bfprt选择算法/)

## 第十一章 散列表

1. 散列函数如何设计
2. Direct Access Table
3. 开放地址法, 探查序列
4. **全域散列** important
5. 完美散列

## 第十二章 [Binary Search Tree 二叉搜索树](/blog/cs-major-courses/introduction-to-algorithms/binary-search-tree-二叉搜索树/)

1. 所有二叉搜索树的操作时间复杂度为 O(log n)
2. 前驱, 后继

## 第十三章 **[Red-Black Tree 红黑树](/blog/cs-major-courses/introduction-to-algorithms/red-black-tree-红黑树/)**

1. 删除略作了解, 其他重要

## 第十四章 数据结构的扩张

1. 基本步骤
	1. 选择基础数据结构
	2. 添加属性, 基于何种原则
	3. 基本操作如何维护新属性
	4. 根据新属性开发新算法解决实际问题

## **第十五章 [Dynamic Programming 动态规划](/blog/cs-major-courses/introduction-to-algorithms/dynamic-programming-动态规划/)** important

1. 基本思想
2. 具体过程
3. 伪代码
4. 时空间复杂度
5. 需要问题具有的性质: 最优子结构 && 重叠子问题
6. 典型例子
7. 自顶向下 || 自底向上

## **第十六章 [Greedy Algorithm 贪心算法](/blog/cs-major-courses/introduction-to-algorithms/greedy-algorithm-贪心算法/)**

1. [Minimum Spanning Tree 最小生成树](/blog/cs-major-courses/introduction-to-algorithms/minimum-spanning-tree-最小生成树/)
2. [Shortest Path 最短路径](/blog/cs-major-courses/introduction-to-algorithms/shortest-path-最短路径/)
	1. 什么情况不存在最短路径
	2. DJ 和 BF 的区别与联系
	3. 差分约束
3. [Activity Selection 活动选择问题](/blog/cs-major-courses/introduction-to-algorithms/activity-selection-活动选择问题/)

## 第二十六章 [Network Flow 网络流](/blog/cs-major-courses/introduction-to-algorithms/network-flow-网络流/)

1. 源与汇的概念
2. 边的容量
3. 流 <= 容量
4. 流入 == 流出
5. 割的概念: 割出来的两个集合, 其中一个包含源, 另一个包含汇
6. 如何求最大流
	1. 找增广路径
		1. 引入残流图
		2. 给定一个网络, 如何画残流图
	2. [Ford-Fulkerson Algorithm 福特福克森算法](/blog/cs-major-courses/introduction-to-algorithms/ford-fulkerson-algorithm-福特福克森算法/)
		1. 割的容量
		2. 割的流量

## 解空间树

1. [Branch and Bound 分支限界法](/blog/cs-major-courses/introduction-to-algorithms/branch-and-bound-分支限界法/)
2. [Backtracking 回溯法](/blog/cs-major-courses/introduction-to-algorithms/backtracking-回溯法/)
3. 什么是解空间树?

---

# 题型

## 判断题 (10 × 1 = 10 分)

1. 插入排序在最坏情况的时间复杂度
2. 堆排序是最优的比较排序算法
3. Dijkstra 算法是一种贪心算法
4. 任何基数排序算法都是线性时间算法

## 填空题 (10 × 1 = 10 分)

1. 空间树常规分为哪两种树: 子集树, 排列树
2. 回溯法
3. DP 需要问题具备的性质
4. 散列的方法: 开放地址法和直接寻址和
5. 最少需要多少次比较

## 简答题 (4 × 5 = 20 分)

1. 某种算法策略的基本思想, 解题步骤...
	1. 分治, DP, 贪心, ...
	2. DP 解题步骤, 常见方法
2. 什么是简单一次散列, 什么是完美散列...

## 计算题 (5~6 题 × 10~12 分 = 60 分)

1. 求解递归表达式
	1. 递归树
	2. 主方法
	3. 代入法
2. 经典问题: MCM, LCS 等
	1. 分析
	2. 伪代码
	3. 时空间复杂度
	4. 递归表达式

---

# 知识点导航

## [Divide & Conquer 分治](/blog/cs-major-courses/introduction-to-algorithms/divide--conquer-分治/)

## [Sorting Algorithms 排序算法](/blog/cs-major-courses/introduction-to-algorithms/sorting-algorithms-排序算法/)

- [Insertion Sort 插入排序](/blog/cs-major-courses/introduction-to-algorithms/insertion-sort-插入排序/)
- [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/)
- [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/)
- [Heap Sort 堆排序](/blog/cs-major-courses/introduction-to-algorithms/heap-sort-堆排序/)
- 线性时间排序 [Linear Time Sort 线性时间排序](/blog/cs-major-courses/introduction-to-algorithms/linear-time-sort-线性时间排序/)
	- [Counting Sort 计数排序](/blog/cs-major-courses/introduction-to-algorithms/counting-sort-计数排序/)
	- [Radix Sort 基数排序](/blog/cs-major-courses/introduction-to-algorithms/radix-sort-基数排序/)
	- [Bucket Sort 桶排序](/blog/cs-major-courses/introduction-to-algorithms/bucket-sort-桶排序/)

## [Order Statistic 顺序统计量](/blog/cs-major-courses/introduction-to-algorithms/order-statistic-顺序统计量/)

- [Quick Select 快速选择](/blog/cs-major-courses/introduction-to-algorithms/quick-select-快速选择/)
- [BFPRT - Median of Medians BFPRT选择算法](/blog/cs-major-courses/introduction-to-algorithms/bfprt---median-of-medians-bfprt选择算法/)

## [Hashing I 哈希](/blog/cs-major-courses/introduction-to-algorithms/hashing-i-哈希/)

- [Hashing I 哈希 ChatGPT-summarized](/blog/cs-major-courses/introduction-to-algorithms/hashing-i-哈希-chatgpt-summarized/)

## [Binary Search Tree 二叉搜索树](/blog/cs-major-courses/introduction-to-algorithms/binary-search-tree-二叉搜索树/)

## [Red-Black Tree 红黑树](/blog/cs-major-courses/introduction-to-algorithms/red-black-tree-红黑树/)

## [Dynamic Programming 动态规划](/blog/cs-major-courses/introduction-to-algorithms/dynamic-programming-动态规划/)

- [Longest Common Subsequence (LCS) 最长公共子序列](/blog/cs-major-courses/introduction-to-algorithms/longest-common-subsequence-lcs-最长公共子序列/) — 自顶向下
- [Matrix Chain Multiplication (MCM) 矩阵连乘](/blog/cs-major-courses/introduction-to-algorithms/matrix-chain-multiplication-mcm-矩阵连乘/) — 自底向上
- [0-1 Knapsack Problem 0-1背包 DP](/blog/cs-major-courses/introduction-to-algorithms/0-1-knapsack-problem-0-1背包-dp/)

## [Greedy Algorithm 贪心算法](/blog/cs-major-courses/introduction-to-algorithms/greedy-algorithm-贪心算法/)

- [Shortest Path 最短路径](/blog/cs-major-courses/introduction-to-algorithms/shortest-path-最短路径/)
	- [Dijkstra 算法](/blog/cs-major-courses/introduction-to-algorithms/dijkstras-algorithm-迪杰斯特拉算法/)
	- [Bellman-Ford 算法](/blog/cs-major-courses/introduction-to-algorithms/bellman-ford-algotithm-贝尔曼福特算法/)
	- [Floyd-Warshall 算法](/blog/cs-major-courses/introduction-to-algorithms/floyd-warshall-algorithm-弗洛伊德华沙算法/)
	- [Johnson 算法](/blog/cs-major-courses/introduction-to-algorithms/johnsons-algorithm/)
- [Activity Selection 活动选择问题](/blog/cs-major-courses/introduction-to-algorithms/activity-selection-活动选择问题/)
- [Minimum Spanning Tree 最小生成树](/blog/cs-major-courses/introduction-to-algorithms/minimum-spanning-tree-最小生成树/)
	- [Prim 算法](/blog/cs-major-courses/introduction-to-algorithms/prims-algorithm/)
	- [Kruskal 算法](/blog/cs-major-courses/introduction-to-algorithms/kruskals-algorithm/)

> Greedy 和 DP 都有最优子结构 (同);
> Greedy 是自顶向下, DP 可上可下 (异).

## [Network Flow 网络流](/blog/cs-major-courses/introduction-to-algorithms/network-flow-网络流/)

- [Ford-Fulkerson 方法](/blog/cs-major-courses/introduction-to-algorithms/ford-fulkerson-方法/)

## [Backtracking 回溯法](/blog/cs-major-courses/introduction-to-algorithms/backtracking-回溯法/)

## [Branch and Bound 分支限界法](/blog/cs-major-courses/introduction-to-algorithms/branch-and-bound-分支限界法/)
