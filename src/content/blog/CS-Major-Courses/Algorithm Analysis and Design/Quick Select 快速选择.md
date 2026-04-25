---
title: 'Quick Select 快速选择'
description: '核心任务: Top-K问题: 在一个数组中找第k小/大的元素 隶属于任务: Order Statistic 顺序统计量 参考方法: Divide & Conquer 分治 Quick Sort 快速排序 算法实现: step1: 随机选择一个pivot step2: 将数组分为3部分 $O(n)$ step3: ...'
pubDate: '2026-04-09'
protected: true
passwordHash: 'a5f6ee79cd69074506575fa931b1f391dfc68c915562d6fb391ff5ff65b6d79e'
passwordHint: '请输入课程内容访问密码'
---
# 核心任务:
	Top-K问题: 在一个数组中找第k小/大的元素
隶属于任务: [Order Statistic 顺序统计量](/blog/cs-major-courses/algorithm-analysis-and-design/order-statistic-顺序统计量/)
# 参考方法:
*Divide & Conquer 分治*
*Quick Sort 快速排序*

# 算法实现:
step1: 随机选择一个pivot

step2: 将数组分为3部分  $O(n)$
```
[ 小于 pivot ] pivot [ 大于 pivot ]
```

step3: 确定pivot的rank $O(1)$
```
k = rank(pivot)
```

step4: 递归查找
```
if i == k:
	return pivot
elif i < k:
	go to [ 小于 pivot ]
elif i > k:
	go to [ 大于 pivot]
```

*p.s. step2 和 step3 可以看作一个step, 因为本质上都是同一次遍历数组后得到的结果.*

# 时间复杂度
## Average:

$T(n)=T(n/2)+O(n)=O(n)$
## Worst Case:
每次选到最大或最小值
$T(n)=O(n^2)$

# 算法优劣
## 优:
在绝大多数情况十分高效, 时间复杂度仅为$O(n)$
## 劣:
在极端情况, 效率甚至低于排序, 时间复杂度达到$O(n^2)$

# 相关算法:
[BFPRT - Median of Medians BFPRT选择算法](/blog/cs-major-courses/algorithm-analysis-and-design/bfprt---median-of-medians-bfprt选择算法/): 解决Quick Select在极端情况下的低效问题, 实现在任何情况下的线性时间解法
