---
title: "Divide & Conquer 分治"
description: "Divide & Conquer 分治 分治策略把一个规模为 $n$ 的问题拆成若干个规模更小、结构相同或相近的子问题，递归求解子问题，再把子问题的解合并成原问题的解。 标准流程是： Divide → Conquer → Combine 。 1. 基本思想 分治法（Divide and Conquer）是一种算法..."
pubDate: "2026-06-19"
---

# Divide & Conquer 分治

> [!summary] 核心结论
> 分治策略把一个规模为 $n$ 的问题拆成若干个规模更小、结构相同或相近的子问题，递归求解子问题，再把子问题的解合并成原问题的解。
>
> 标准流程是：**Divide → Conquer → Combine**。

## 1. 基本思想

分治法（Divide and Conquer）是一种算法设计范式，适合处理可以被递归拆解的问题。

设原问题规模为 $n$。若它可以被分成 $a$ 个规模约为 $n / b$ 的子问题，并且划分与合并的额外代价为 $f(n)$，则常见递归式为：

$$
T(n)=aT(n/b)+f(n)
$$

其中：

- $a$：子问题个数；
- $n/b$：每个子问题的规模；
- $f(n)$：划分问题、合并答案以及其他非递归工作的总代价。

> [!note] 分治的本质
> 分治不是“随便递归”，而是利用问题的**自相似结构**：大问题的解可以由若干个小问题的解构造出来。

## 2. 具体过程

分治算法通常包含三个阶段。

### 2.1 Divide：分解

将规模为 $n$ 的原问题划分为若干个规模更小的子问题。

常见分解方式：

- 将数组分成左右两半；
- 选取一个主元，将数组按主元划分；
- 将矩阵分成若干子矩阵；
- 将搜索区间缩小到一半。

### 2.2 Conquer：解决

递归地解决子问题。

当子问题规模足够小时，直接求解。该直接求解情形称为**递归基**（base case）。

### 2.3 Combine：合并

将子问题的解合并为原问题的解。

不同算法的合并代价差异很大：

- [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/) 的合并需要线性时间；
- [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/) 的合并几乎是平凡的，关键代价在 partition；
- Binary Search 二分查找 每次只递归进入一个子问题，合并是平凡的；
- Strassen Algorithm Strassen矩阵乘法 通过减少递归乘法次数降低复杂度。

## 3. 通用伪代码模板

```text
DIVIDE-AND-CONQUER(x):
    if size(x) <= threshold:
        return DIRECT-SOLVE(x)

    subproblems <- DIVIDE(x)
    answers <- empty list

    for each subproblem p in subproblems:
        answers.append(DIVIDE-AND-CONQUER(p))

    return COMBINE(answers)
```

> [!tip] 0-based 实现习惯
> 写代码时建议统一使用左闭右闭 `[low, high]` 或左闭右开 `[low, high)` 区间。不要在同一算法中混用两种边界约定。

## 4. 需要问题具有的性质

### 4.1 可分解性

原问题必须能被拆成规模更小的子问题。

形式上，需要能找到一种映射：

$$
P(n) \rightarrow P(n_1),P(n_2),\dots,P(n_a)
$$

并且满足：

$$
n_i < n
$$

否则递归不会收敛。

### 4.2 子问题结构相同或相近

子问题最好与原问题属于同一类问题，这样才能递归使用同一个算法。

例如：

- 排序数组的子数组仍然是排序问题；
- 在有序数组的一半中查找元素仍然是查找问题；
- 子矩阵乘法仍然是矩阵乘法问题。

### 4.3 子问题相对独立

分治法最适合子问题之间基本独立的情形。

如果子问题大量重叠，朴素分治会重复计算，通常应考虑：

- [Dynamic Programming 动态规划](/blog/cs-major-courses/introduction-to-algorithms/dynamic-programming-动态规划/)；
- 记忆化搜索；
- 自底向上递推。

典型反例是朴素递归 Fibonacci：

$$
F_n=F_{n-1}+F_{n-2}
$$

虽然它形式上递归拆分，但子问题高度重叠，因此朴素递归会产生指数级重复计算。

### 4.4 合并过程可行且代价可控

即使子问题能高效求解，如果合并代价过高，整体算法也未必高效。

分析时必须同时考虑：

$$
\text{总复杂度}=\text{递归子问题代价}+\text{划分与合并代价}
$$

### 4.5 子问题规模应持续下降

每层递归必须让问题规模严格变小。

否则会出现：

- 无限递归；
- 无法触达递归基；
- 复杂度分析中的递归式不成立。

### 4.6 划分尽量均衡

均衡划分通常能降低递归树高度。

例如：

- [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/) 总是近似二分，递归深度为 $\Theta(\log n)$；
- [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/) 若每次划分为 $0$ 和 $n-1$，最坏时间会退化为 $\Theta(n^2)$；
- 若快排划分较均衡，期望或平均表现通常接近 $\Theta(n\log n)$。

> [!warning] 分治不等于一定高效
> 分治只是设计策略。最终复杂度取决于子问题数量、子问题规模、划分/合并代价以及递归是否重复计算。

## 5. 复杂度分析框架

### 5.1 写出递归式

分析分治算法时，第一步通常是写出递归式。

常见形式：

$$
T(n)=aT(n/b)+f(n)
$$

更一般的形式可以是不均衡拆分：

$$
T(n)=T(k)+T(n-k-1)+f(n)
$$

例如 [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/) 的复杂度取决于 partition 后左右子数组的规模。

### 5.2 选择求解方法

常见方法：

- [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/)：先猜测，再用数学归纳法证明；
- Recursion Tree 递归树：逐层计算代价并求和；
- Master Theorem 主定理：适用于 $T(n)=aT(n/b)+f(n)$ 这一类标准递归式。

### 5.3 常见递归式

| 递归式 | 典型场景 | 复杂度 |
|---|---|---|
| $T(n)=2T(n/2)+\Theta(n)$ | [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/) | $\Theta(n\log n)$ |
| $T(n)=T(n/2)+\Theta(1)$ | Binary Search 二分查找、Fast Power 快速幂 | $\Theta(\log n)$ |
| $T(n)=8T(n/2)+\Theta(n^2)$ | 普通分治矩阵乘法 | $\Theta(n^3)$ |
| $T(n)=7T(n/2)+\Theta(n^2)$ | Strassen Algorithm Strassen矩阵乘法 | $\Theta(n^{\log_2 7})$ |
| $T(n)=T(k)+T(n-k-1)+\Theta(n)$ | [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/) | 取决于划分平衡性 |

## 6. 典型例子

> [!info] 说明
> 本节只给出算法引用和分治结构，不展开具体算法细节。具体过程见对应笔记。

### 6.1 [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/)

- **Divide**：将数组分成左右两半；
- **Conquer**：递归排序左右子数组；
- **Combine**：线性合并两个有序子数组；
- **递归式**：$T(n)=2T(n/2)+\Theta(n)$。

### 6.2 [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/)

- **Divide**：选取 pivot，通过 partition 划分为小于等于 pivot 和大于等于 pivot 的两部分；
- **Conquer**：递归排序左右子数组；
- **Combine**：平凡合并，因为 partition 已经把 pivot 放到正确位置；
- **关键点**：划分是否均衡决定复杂度表现。

### 6.3 Binary Search 二分查找

- **Divide**：检查中间元素；
- **Conquer**：只递归进入可能包含目标值的一半；
- **Combine**：平凡；
- **前提**：输入必须有序；
- **递归式**：$T(n)=T(n/2)+\Theta(1)$。

### 6.4 Fast Power 快速幂

- **Divide**：把 $a^n$ 转换为 $a^{\lfloor n/2\rfloor}$ 的子问题；
- **Conquer**：递归求半规模幂；
- **Combine**：平方，若 $n$ 为奇数则额外乘一次 $a$；
- **递归式**：$T(n)=T(n/2)+\Theta(1)$。

### 6.5 Maximum Subarray 最大子数组

- **Divide**：将数组分成左右两半；
- **Conquer**：分别求左半、右半最大子数组；
- **Combine**：求跨越中点的最大子数组；
- **关键点**：原问题最优解只可能在左侧、右侧或跨中点三类情况中。

### 6.6 Strassen Algorithm Strassen矩阵乘法

- **Divide**：将矩阵分块为子矩阵；
- **Conquer**：用 7 次递归子矩阵乘法替代普通方法的 8 次；
- **Combine**：通过若干矩阵加减组合结果；
- **递归式**：$T(n)=7T(n/2)+\Theta(n^2)$。

### 6.7 Randomized Select 随机选择

- **Divide**：随机选择 pivot 并 partition；
- **Conquer**：只递归进入包含第 $i$ 小元素的一侧；
- **Combine**：平凡；
- **关键点**：与快排类似使用 partition，但每层只递归一个子问题。

## 7. 与其他算法设计策略的区别

| 策略 | 核心思想 | 适用结构 |
|---|---|---|
| 分治 | 拆成较独立子问题，递归求解后合并 | 子问题相对独立、自相似 |
| [Dynamic Programming 动态规划](/blog/cs-major-courses/introduction-to-algorithms/dynamic-programming-动态规划/) | 保存重叠子问题结果，避免重复计算 | 最优子结构 + 重叠子问题 |
| [Greedy Algorithms 贪心算法](/blog/cs-major-courses/introduction-to-algorithms/greedy-algorithms-贪心算法/) | 每一步做局部最优选择 | 贪心选择性质 + 最优子结构 |
| [Backtracking 回溯法](/blog/cs-major-courses/introduction-to-algorithms/backtracking-回溯法/) | 深度优先搜索解空间树并剪枝 | 组合搜索、约束满足 |
| [Branch and Bound 分支限界法](/blog/cs-major-courses/introduction-to-algorithms/branch-and-bound-分支限界法/) | 用界函数控制搜索顺序和剪枝 | 优化搜索问题 |

## 8. 易错点

> [!warning] 常见错误
> 只写递归调用，不分析划分与合并代价，会低估复杂度。

> [!warning] 常见错误
> 看到递归就认为是分治。真正的分治要求子问题能有效组合成原问题，并且递归应当带来规模下降。

> [!warning] 常见错误
> 忽略子问题重叠。若同一子问题被反复计算，应优先考虑动态规划或记忆化。

> [!warning] 常见错误
> 忽略边界条件。数组分治尤其容易在 `mid`、`low`、`high` 的闭开区间约定上出错。

## 9. 学习检查清单

判断一个问题是否适合分治，可以依次检查：

- [ ] 能否把规模为 $n$ 的问题拆成规模更小的问题？
- [ ] 子问题是否与原问题同类型或足够相似？
- [ ] 子问题是否相对独立？若不独立，是否存在大量重叠？
- [ ] 子问题解能否被正确合并为原问题解？
- [ ] 划分与合并代价是多少？
- [ ] 能否写出递归式 $T(n)$？
- [ ] 递归基是否明确？
- [ ] 子问题规模是否严格下降？

## 10. 相关笔记

- Algorithm Design and Analysis 算法设计与分析
- Asymptotic Notation and Analysis 渐进记号与渐进分析
- Recurrences 递归式
- Master Theorem 主定理
- [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/)
- [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/)
- Binary Search 二分查找
- Fast Power 快速幂
- Maximum Subarray 最大子数组
- Strassen Algorithm Strassen矩阵乘法
- Randomized Select 随机选择
- [Dynamic Programming 动态规划](/blog/cs-major-courses/introduction-to-algorithms/dynamic-programming-动态规划/)

## 11. Sources

- Cormen, Thomas H.; Leiserson, Charles E.; Rivest, Ronald L.; Stein, Clifford. *Introduction to Algorithms*, 3rd ed. Ch. 2.3.1, Ch. 4.
- MIT 6.046J / 18.401J, Lecture 3: *Divide and Conquer*.
- MIT 6.046J / 18.401J, Lecture 4: *Quicksort*.
