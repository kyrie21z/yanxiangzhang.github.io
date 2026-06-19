---
title: "Iterating the Recurrence 迭代展开法"
description: "Iterating the Recurrence 迭代展开法 迭代展开法（Iterating the Recurrence / Iteration Method） 是求解递归式的一种直接方法：不断把递归项继续代入自身，直到规模下降到边界条件，然后把每一轮产生的非递归代价求和。 它的核心不是“套公式”，而是把 $$..."
pubDate: "2026-06-19"
---

# Iterating the Recurrence 迭代展开法

> [!summary]
> **迭代展开法（Iterating the Recurrence / Iteration Method）** 是求解递归式的一种直接方法：不断把递归项继续代入自身，直到规模下降到边界条件，然后把每一轮产生的非递归代价求和。
>
> 它的核心不是“套公式”，而是把
>
> $$
> T(n)
> $$
>
> 展开成
>
> $$
> T(\text{base size}) + \text{累计代价}
> $$
>
> 再化简累计代价。

## 1. 基本思想

递归式通常来自 [分治算法](/blog/cs-major-courses/introduction-to-algorithms/divide--conquer-分治/) 的运行时间分析。

例如算法每次把问题规模从 $n$ 降到 $n/2$，并额外做常数时间工作，就可能得到：

$$
T(n)=T(n/2)+\Theta(1)
$$

迭代展开法的做法是：

$$
\begin{aligned}
T(n)
&=T(n/2)+c \\
&=T(n/4)+2c \\
&=T(n/8)+3c \\
&\cdots
\end{aligned}
$$

直到子问题规模变成常数，即：

$$
\frac{n}{2^k}=1
$$

得到：

$$
k=\log_2 n
$$

所以：

$$
T(n)=T(1)+c\log_2 n=\Theta(\log n)
$$

> [!important]
> 迭代展开法本质上是在回答两个问题：
>
> 1. 递归会执行多少层？
> 2. 每一层额外贡献多少代价？

---

## 2. 具体过程

给定递归式，按下面步骤处理。

### Step 1：写清边界条件

递归式必须最终停在某个基本规模，例如：

$$
T(1)=\Theta(1)
$$

或者更一般地：

$$
T(n)=\Theta(1),\quad n\le n_0
$$

> [!warning]
> 如果没有边界条件，递归式不能完整求解；在渐近分析中可以省略常数级边界，但推导时必须知道它存在。

### Step 2：连续展开递归项

以

$$
T(n)=T(n/2)+c
$$

为例：

$$
\begin{aligned}
T(n)&=T(n/2)+c \\
&=T(n/4)+2c \\
&=T(n/8)+3c \\
&=T(n/2^k)+kc
\end{aligned}
$$

展开后要得到一个含 $k$ 的通式。

### Step 3：求停止层数

令递归规模达到边界：

$$
\frac{n}{2^k}=1
$$

解得：

$$
k=\log_2 n
$$

如果递归式是：

$$
T(n)=T(n-b)+f(n)
$$

则通常令：

$$
n-kb=1
$$

求得：

$$
k=\Theta(n/b)
$$

### Step 4：代回并求和

把 $k$ 代回展开式。

例如：

$$
T(n)=T(n/2^k)+kc
$$

代入 $k=\log_2 n$：

$$
T(n)=T(1)+c\log_2 n=\Theta(\log n)
$$

如果每一层代价不相同，需要求和：

$$
T(n)=T(1)+\sum_{i=0}^{k-1} g_i(n)
$$

其中 $g_i(n)$ 表示第 $i$ 次展开产生的非递归代价。

### Step 5：必要时用代入法验证

迭代展开法通常能直接给出结果，但当推导中使用了近似、省略取整、忽略边界项时，严格证明可以交给 [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/)。

---

## 3. 需要问题具有的性质

迭代展开法对递归式本身有一些要求。

### 3.1 子问题规模必须持续变小

递归项中的规模必须趋向边界条件，例如：

```text
T(n) = T(n/2) + Θ(1)
T(n) = T(n-1) + n
T(n) = 2T(n/2) + n
```

如果递归规模不下降，就无法停止。

### 3.2 必须能识别展开规律

展开若干层之后，应能写出第 $k$ 层形式。

例如：

$$
T(n)=T(n/2^k)+kc
$$

或者：

$$
T(n)=2^kT(n/2^k)+kcn
$$

若无法写出通式，迭代展开法会变得低效。

### 3.3 累计代价必须可求和

常见可求和形式包括：

| 累计代价类型 | 常见结论 |
|---|---:|
| 常数项累加 | $\Theta(\log n)$ 或 $\Theta(n)$ |
| 等差数列 | $\Theta(n^2)$ |
| 等比数列 | 由首项或末项主导 |
| 每层相同 | 层数 $\times$ 每层代价 |
| 调和级数 | 常出现 $\Theta(\log n)$ |

### 3.4 更适合结构简单的递归式

迭代展开法最适合：

```text
T(n) = T(n/b) + f(n)
T(n) = T(n-b) + f(n)
T(n) = aT(n/b) + f(n) 且展开模式明显
```

不太适合：

```text
T(n) = T(n/3) + T(2n/3) + n
T(n) = T(⌊n/2⌋) + T(⌈n/2⌉) + n
T(n) = T(n - sqrt(n)) + n
```

这些递归式通常用 [Recursion Tree Method 递归树法](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/)、[Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/) 或更专门的工具处理更稳妥。

---

## 4. 典型例子

### 4.1 例 1：二分查找

二分查找每次只递归搜索一个子数组，规模减半；检查中间元素和选择方向的代价为常数。因此递归式为：

$$
T(n)=T(n/2)+\Theta(1)
$$

设常数代价为 $c$：

$$
\begin{aligned}
T(n)
&=T(n/2)+c \\
&=T(n/4)+2c \\
&=T(n/8)+3c \\
&=T(n/2^k)+kc
\end{aligned}
$$

停止条件：

$$
\frac{n}{2^k}=1
$$

所以：

$$
k=\log_2 n
$$

代回：

$$
T(n)=T(1)+c\log_2 n
$$

因此：

$$
T(n)=\Theta(\log n)
$$

> [!note]
> 课程 PPT 中二分查找的递归式正是 $T(n)=T(n/2)+\Theta(1)$，结论为 $\Theta(\lg n)$。

---

### 4.2 例 2：快速幂

计算 $a^n$ 时，可以利用：

$$
a^n=
\begin{cases}
a^{n/2}\cdot a^{n/2}, & n \text{ is even} \\
a^{(n-1)/2}\cdot a^{(n-1)/2}\cdot a, & n \text{ is odd}
\end{cases}
$$

每次只需要递归计算一个规模约为 $n/2$ 的子问题，额外乘法次数为常数，因此：

$$
T(n)=T(n/2)+\Theta(1)
$$

与二分查找完全相同：

$$
T(n)=\Theta(\log n)
$$

> [!tip]
> 这里不要把 $a^{n/2}\cdot a^{n/2}$ 理解成需要递归计算两次。实际算法应只计算一次 $x=a^{n/2}$，再返回 $x\cdot x$。

---

### 4.3 例 3：归并排序

归并排序的递归式为：

$$
T(n)=2T(n/2)+cn
$$

其中：

- $2T(n/2)$：递归排序两个长度为 $n/2$ 的子数组；
- $cn$：线性时间合并两个有序数组。

展开一次：

$$
T(n)=2T(n/2)+cn
$$

展开两次：

$$
\begin{aligned}
T(n)
&=2\left(2T(n/4)+c\frac{n}{2}\right)+cn \\
&=4T(n/4)+2cn
\end{aligned}
$$

展开三次：

$$
T(n)=8T(n/8)+3cn
$$

因此第 $k$ 次展开后：

$$
T(n)=2^kT(n/2^k)+kcn
$$

停止条件：

$$
\frac{n}{2^k}=1
$$

所以：

$$
k=\log_2 n
$$

代回：

$$
\begin{aligned}
T(n)
&=2^{\log_2 n}T(1)+cn\log_2 n \\
&=nT(1)+cn\log_2 n
\end{aligned}
$$

由于 $T(1)=\Theta(1)$，所以：

$$
T(n)=\Theta(n)+\Theta(n\log n)=\Theta(n\log n)
$$

> [!important]
> 归并排序的关键不是树高为 $\log n$，而是每一层总代价都是 $\Theta(n)$，总共有 $\Theta(\log n)$ 层。

---

### 4.4 例 4：快速排序最坏情况

快速排序最坏情况下，每次划分都产生一个空子数组和一个规模为 $n-1$ 的子数组，划分本身需要线性时间：

$$
T(n)=T(n-1)+cn
$$

连续展开：

$$
\begin{aligned}
T(n)
&=T(n-1)+cn \\
&=T(n-2)+c(n-1)+cn \\
&=T(n-3)+c(n-2)+c(n-1)+cn \\
&\cdots \\
&=T(1)+c\sum_{i=2}^{n} i
\end{aligned}
$$

求和：

$$
\sum_{i=2}^{n} i
=\frac{n(n+1)}{2}-1
=\Theta(n^2)
$$

因此：

$$
T(n)=\Theta(n^2)
$$

> [!warning]
> 这是“减 1 型递归”，与二分查找的“除 2 型递归”不同。前者递归深度是 $\Theta(n)$，后者递归深度是 $\Theta(\log n)$。

---

## 5. 常见展开模板

### 5.1 除法缩小：$T(n)=T(n/b)+c$

$$
\begin{aligned}
T(n)&=T(n/b)+c \\
&=T(n/b^2)+2c \\
&=T(n/b^k)+kc
\end{aligned}
$$

令：

$$
\frac{n}{b^k}=1
$$

得到：

$$
k=\log_b n
$$

因此：

$$
T(n)=\Theta(\log n)
$$

### 5.2 减法缩小：$T(n)=T(n-1)+n$

$$
\begin{aligned}
T(n)&=T(n-1)+n \\
&=T(n-2)+(n-1)+n \\
&=T(1)+\sum_{i=2}^{n} i
\end{aligned}
$$

因此：

$$
T(n)=\Theta(n^2)
$$

### 5.3 每层总代价相同：$T(n)=aT(n/b)+n^{\log_b a}$

常见形式：

$$
T(n)=2T(n/2)+n
$$

每一层总代价都是 $\Theta(n)$，层数是 $\Theta(\log n)$，所以：

$$
T(n)=\Theta(n\log n)
$$

---

## 6. 与其他递归式方法的关系

| 方法 | 主要用途 | 特点 |
|---|---|---|
| [Iterating the Recurrence 迭代展开法](/blog/cs-major-courses/introduction-to-algorithms/iterating-the-recurrence-迭代展开法/) | 直接展开递归式 | 适合模式清晰的递归式 |
| [Recursion Tree Method 递归树法](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/) | 分层观察递归代价 | 更直观，适合多分支递归 |
| [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/) | 严格证明候选解 | 最通用，但需要先猜解 |
| [Master Method 主方法](/blog/cs-major-courses/introduction-to-algorithms/master-method-主方法/) | 快速求标准分治递归式 | 适合 $T(n)=aT(n/b)+f(n)$ |

> [!tip]
> 实战顺序可以是：先迭代展开或画递归树得到猜测，再用代入法补严格证明；若递归式正好符合主方法，则优先用主方法快速判断。

---

## 7. 易错点

> [!warning] 错误 1：展开层数算错
> 对 $T(n)=T(n/2)+c$，停止条件是 $n/2^k=1$，不是 $n-k=1$。

> [!warning] 错误 2：把快速幂当成两个递归调用
> $a^{n/2}\cdot a^{n/2}$ 只需要递归算一次 $a^{n/2}$，然后平方；否则会退化成 $T(n)=2T(n/2)+\Theta(1)$。

> [!warning] 错误 3：只看递归深度，不看每层代价
> 归并排序递归深度是 $\log n$，但每层总代价是 $n$，所以总复杂度是 $\Theta(n\log n)$，不是 $\Theta(\log n)$。

> [!warning] 错误 4：忽略边界条件
> 渐近分析可以省略常数级边界，但展开时必须知道递归何时停止。

---

## 8. 最小做题模板

```text
1. 写出递归式和边界条件：
   T(n)=...
   T(1)=Θ(1)

2. 连续展开 2~3 层：
   T(n)=...
   =...
   =...

3. 写出第 k 层通式：
   T(n)=...T(size_k)+累计代价

4. 求停止条件：
   size_k = 1
   解出 k

5. 代回通式并求和。

6. 化简为渐近复杂度。

7. 如果需要严格证明，用代入法验证。
```

---

## 参考资料

- Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein. *Introduction to Algorithms*, 3rd ed. Chapter 4: Divide-and-Conquer; especially recurrence-solving methods in Chapter 4.3--4.5.
- Erik D. Demaine, Charles E. Leiserson. MIT 6.046J / 18.401J, Lecture 2: *Asymptotic Notation and Recurrences*.
- Erik D. Demaine, Charles E. Leiserson. MIT 6.046J / 18.401J, Lecture 3: *Divide and Conquer*.
- Erik D. Demaine, Charles E. Leiserson. MIT 6.046J / 18.401J, Lecture 4: *Quicksort*.

## 相关笔记

- Recurrences 递归式
- [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/)
- [Recursion Tree Method 递归树法](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/)
- [Master Method 主方法](/blog/cs-major-courses/introduction-to-algorithms/master-method-主方法/)
- [Divide & Conquer 分治](/blog/cs-major-courses/introduction-to-algorithms/divide--conquer-分治/)
- Binary Search 二分查找
- [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/)
- [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/)
- [Asymptotic Notation & Analysis](/blog/cs-major-courses/introduction-to-algorithms/asymptotic-notation--analysis/)
