---
title: "Substitution Method 代入法"
description: "Substitution Method 代入法 代入法（Substitution Method） 是求解递归式的一种通用方法：先猜测递归式的渐近界，再把猜测代入递归式，用数学归纳法证明猜测成立，最后选择足够大的常数处理残差项和初始条件。 1. 基本思想 代入法的核心流程可以概括为三步： 1. 猜测解的形式 ：例如..."
pubDate: "2026-06-19"
---

# Substitution Method 代入法

> [!summary]
> **代入法（Substitution Method）** 是求解递归式的一种通用方法：先猜测递归式的渐近界，再把猜测代入递归式，用数学归纳法证明猜测成立，最后选择足够大的常数处理残差项和初始条件。

## 1. 基本思想

代入法的核心流程可以概括为三步：

1. **猜测解的形式**：例如猜 $T(n)=O(n^2)$、$T(n)=\Theta(n\log n)$。
2. **用归纳法验证**：假设对所有更小规模 $k<n$ 成立，再证明对 $n$ 成立。
3. **求常数**：选择足够大的常数 $c,c_1,c_2$，使不等式和初始条件同时成立。

其本质是：

$$
\text{guess} \Rightarrow \text{substitute} \Rightarrow \text{induction} \Rightarrow \text{constants}
$$

> [!important]
> 代入法不是“把答案代进去看像不像”，而是一个**严格的归纳证明过程**。猜测只负责提出目标，真正成立依赖归纳证明。

## 2. 具体过程

设递归式为：

$$
T(n)=aT(n/b)+f(n)
$$

或者更一般地：

$$
T(n)=\sum_i T(g_i(n))+f(n)
$$

代入法通常按以下步骤执行。

### 2.1 猜测渐近界

可以从以下来源猜测：

- 使用 [Recursion Tree Method 递归树法](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/) 观察每层代价；
- 使用 [Master Method 主方法](/blog/cs-major-courses/introduction-to-algorithms/master-method-主方法/) 得到候选答案；
- 根据常见递归式模式经验猜测；
- 先猜一个宽松上界，再逐步收紧。

例如：

$$
T(n)=4T(n/2)+n
$$

可以先猜：

$$
T(n)=O(n^3)
$$

再尝试收紧为：

$$
T(n)=O(n^2)
$$

### 2.2 写出归纳假设

若要证明：

$$
T(n)=O(g(n))
$$

则设存在常数 $c>0$，对所有 $k<n$ 有：

$$
T(k)\le c g(k)
$$

目标是推出：

$$
T(n)\le c g(n)
$$

若要证明：

$$
T(n)=\Omega(g(n))
$$

则设：

$$
T(k)\ge c g(k)
$$

目标是推出：

$$
T(n)\ge c g(n)
$$

若要证明：

$$
T(n)=\Theta(g(n))
$$

通常需要分别证明：

$$
T(n)=O(g(n))
$$

和

$$
T(n)=\Omega(g(n))
$$

### 2.3 代入递归式

把归纳假设代入递归式中。

例如证明 $T(n)=O(n^3)$：

$$
T(n)=4T(n/2)+n
$$

归纳假设：

$$
T(k)\le ck^3, \qquad k<n
$$

代入：

$$
\begin{aligned}
T(n)
&=4T(n/2)+n \\
&\le 4c(n/2)^3+n \\
&=\frac{c}{2}n^3+n
\end{aligned}
$$

要证明：

$$
\frac{c}{2}n^3+n\le cn^3
$$

等价于：

$$
n\le \frac{c}{2}n^3
$$

当 $c\ge2$ 且 $n\ge1$ 时成立。因此：

$$
T(n)=O(n^3)
$$

### 2.4 处理初始条件

归纳必须有基例。通常设：

$$
T(n)=\Theta(1), \qquad n<n_0
$$

然后选择足够大的常数 $c$，使得对所有 $1\le n<n_0$ 都有：

$$
T(n)\le cg(n)
$$

> [!warning]
> 不能只证明递推步骤而忽略初始条件。递归式最终会落到小规模输入，基例必须被常数覆盖。

## 3. 需要问题具有的性质

代入法适用于递归式求解，通常需要满足以下条件。

| 性质 | 说明 |
|---|---|
| 有明确递归式 | 能写出 $T(n)$ 与更小规模问题的关系 |
| 子问题规模变小 | 递归必须朝基例推进，如 $n/2$、$n-1$、$3n/4$ |
| 有初始条件 | 需要给出 $T(1)$ 或 $T(n)=\Theta(1)$ for $n<n_0$ |
| 能提出候选界 | 需要先猜 $O$、$\Omega$ 或 $\Theta$ 的形式 |
| 可用归纳法证明 | 递归式对应良序结构，通常对 $n$ 做强归纳 |
| 常数可调 | 允许选择足够大的常数处理低阶项和基例 |

> [!note]
> 代入法比主方法更通用。主方法要求递归式接近 $T(n)=aT(n/b)+f(n)$，而代入法也可以处理非均匀子问题、期望递归式、带求和项的递归式等。

## 4. 典型例子：证明 $T(n)=4T(n/2)+n$ 的上界

### 4.1 宽松上界：$T(n)=O(n^3)$

递归式：

$$
T(n)=4T(n/2)+n
$$

假设：

$$
T(k)\le ck^3, \qquad k<n
$$

代入：

$$
\begin{aligned}
T(n)
&=4T(n/2)+n \\
&\le 4c(n/2)^3+n \\
&=\frac{c}{2}n^3+n \\
&\le cn^3
\end{aligned}
$$

最后一步要求：

$$
\frac{c}{2}n^3+n\le cn^3
$$

即：

$$
n\le \frac{c}{2}n^3
$$

当 $c\ge2$ 且 $n\ge1$ 时成立。因此：

$$
T(n)=O(n^3)
$$

但这个界不紧。

### 4.2 直接猜 $O(n^2)$ 会遇到问题

试图证明：

$$
T(n)=O(n^2)
$$

归纳假设：

$$
T(k)\le ck^2, \qquad k<n
$$

代入：

$$
\begin{aligned}
T(n)
&=4T(n/2)+n \\
&\le 4c(n/2)^2+n \\
&=cn^2+n
\end{aligned}
$$

但要证明的是：

$$
T(n)\le cn^2
$$

而现在得到：

$$
T(n)\le cn^2+n
$$

多出了 $+n$，无法推出目标结论。

> [!failure]
> 这不是说明 $O(n^2)$ 错了，而是说明归纳假设太弱，无法吸收递归式中的低阶项。

### 4.3 加强归纳假设

解决方法：减去一个低阶项，加强归纳假设。

设：

$$
T(k)\le c_1k^2-c_2k, \qquad k<n
$$

代入：

$$
\begin{aligned}
T(n)
&=4T(n/2)+n \\
&\le 4\left(c_1(n/2)^2-c_2(n/2)\right)+n \\
&=c_1n^2-2c_2n+n \\
&=c_1n^2-c_2n-(c_2n-n) \\
&\le c_1n^2-c_2n
\end{aligned}
$$

只要：

$$
c_2\ge1
$$

就有：

$$
c_2n-n\ge0
$$

因此归纳成立。再选择足够大的 $c_1$ 处理初始条件，即可得到：

$$
T(n)=O(n^2)
$$

因为：

$$
T(n)\le c_1n^2-c_2n\le c_1n^2
$$

所以：

$$
T(n)=O(n^2)
$$

## 5. 常见技巧

### 5.1 先猜宽松界，再收紧

若一开始不知道答案，可以先证明一个容易成立的上界，例如：

$$
O(n^3)\rightarrow O(n^2)
$$

宽松界有助于理解递归式，但最终应尽量给出紧确界。

### 5.2 加强归纳假设

当直接假设：

$$
T(k)\le cg(k)
$$

无法推出目标时，可以尝试：

$$
T(k)\le cg(k)-\text{lower-order term}
$$

例如：

$$
T(k)\le c_1k^2-c_2k
$$

这类低阶项可以在代入后吸收额外残差。

### 5.3 分别证明上下界

证明 $\Theta(g(n))$ 时，通常不要直接写“显然为 $\Theta$”。更稳妥的做法是：

1. 证明 $T(n)=O(g(n))$；
2. 证明 $T(n)=\Omega(g(n))$；
3. 合并得到 $T(n)=\Theta(g(n))$。

### 5.4 注意向上取整和向下取整

实际递归式中常见：

$$
T(n)=T(\lfloor n/2\rfloor)+T(\lceil n/2\rceil)+f(n)
$$

初学阶段可以先忽略取整，得到主要增长阶；严格证明时再利用常数吸收取整误差。

## 6. 与其他方法的关系

| 方法                             | 作用          |
| ------------------------------ | ----------- |
| [Recursion Tree Method 递归树法](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/) | 生成猜测、理解每层代价 |
| [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/)    | 严格证明猜测是否成立  |
| [Master Method 主方法](/blog/cs-major-courses/introduction-to-algorithms/master-method-主方法/)          | 快速求解标准形式递归式 |
| Iteration Method 迭代展开法     | 适合单分支或简单递归式 |

> [!tip]
> 做题时的实用流程：先用主方法或递归树猜答案，再用代入法证明。

## 7. 模板

证明 $T(n)=O(g(n))$ 的模板：

```text
Claim: T(n) = O(g(n)).
即存在常数 c>0 和 n0，使得 n>=n0 时 T(n) <= c g(n)。

Inductive Hypothesis:
假设对所有 k<n，有 T(k) <= c g(k)。

Inductive Step:
将归纳假设代入递归式：
T(n) = ...
     <= ...
     <= c g(n)

Base Case:
选择足够大的 c，使所有 n<n0 的基例也满足 T(n) <= c g(n)。

Conclusion:
因此 T(n)=O(g(n))。
```

证明 $T(n)=\Omega(g(n))$ 的模板：

```text
Claim: T(n) = Omega(g(n)).
即存在常数 c>0 和 n0，使得 n>=n0 时 T(n) >= c g(n)。

Inductive Hypothesis:
假设对所有 k<n，有 T(k) >= c g(k)。

Inductive Step:
将归纳假设代入递归式：
T(n) = ...
     >= ...
     >= c g(n)

Base Case:
选择合适常数，使基例满足下界。

Conclusion:
因此 T(n)=Omega(g(n))。
```

## 8. 易错点

> [!warning]
> **错误 1：只代入，不证明。** 代入法必须以归纳法收尾。

> [!warning]
> **错误 2：忽略初始条件。** 常数不仅要处理递推步骤，也要覆盖基例。

> [!warning]
> **错误 3：把证明失败当成结论错误。** 有时结论是对的，只是归纳假设不够强。

> [!warning]
> **错误 4：证明 $\Theta$ 时只证明上界。** $O(g(n))$ 只给上界，不能推出紧确界。

## 9. 最小复习卡片

> [!question] 代入法的三步是什么？
> 1. 猜测解的形式；
> 2. 用归纳法验证；
> 3. 求常数并处理初始条件。

> [!question] 为什么有时要加强归纳假设？
> 因为直接假设 $T(k)\le cg(k)$ 可能在代入后多出低阶残差，无法推出 $T(n)\le cg(n)$。减去低阶项可以吸收这些残差。

> [!question] 代入法和递归树法的关系是什么？
> 递归树法常用于猜测答案，代入法用于严格证明答案。
