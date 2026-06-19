---
title: "Master Method 主方法"
description: "Master Method 主方法 主方法（Master Method） 是求解一类分治递归式的快速判定工具。它适用于形如 $$ T(n) aT(n/b)+f(n) $$ 的递归式，其中 $a\\ge 1$，$b 1$ 为常数，$f(n)$ 渐近非负。核心是比较 叶子总规模 $n^{\\log b a}$ 与 每层非..."
pubDate: "2026-06-19"
---

# Master Method 主方法

> [!summary]
> **主方法（Master Method）** 是求解一类分治递归式的快速判定工具。它适用于形如
>
> $$
> T(n)=aT(n/b)+f(n)
> $$
>
> 的递归式，其中 $a\ge 1$，$b>1$ 为常数，$f(n)$ 渐近非负。核心是比较 **叶子总规模** $n^{\log_b a}$ 与 **每层非递归代价** $f(n)$ 的增长速度。

## 1. 基本思想

主方法的本质是对 [递归树](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/) 的三种典型形态进行封装。

对递归式

$$
T(n)=aT(n/b)+f(n)
$$

可以这样理解：

| 符号 | 含义 |
|---|---|
| $a$ | 每次递归产生的子问题个数 |
| $n/b$ | 每个子问题的规模 |
| $f(n)$ | 当前层划分、合并或额外处理的非递归代价 |
| $n^{\log_b a}$ | 递归树叶子层的总代价规模 |

递归树高度约为：

$$
h=\log_b n
$$

叶子节点数量为：

$$
a^h=a^{\log_b n}=n^{\log_b a}
$$

因此，主方法的关键比较对象是：

$$
f(n) \quad \text{vs.} \quad n^{\log_b a}
$$

> [!important]
> 直觉上，$n^{\log_b a}$ 表示“递归产生的叶子规模”，$f(n)$ 表示“每个规模层上的额外工作”。谁占主导，谁通常决定 $T(n)$ 的阶。

---

## 2. 具体过程

给定递归式：

$$
T(n)=aT(n/b)+f(n)
$$

按以下步骤求解。

### Step 1：识别参数

从递归式中读出：

$$
a,
\quad b,
\quad f(n)
$$

例如：

$$
T(n)=2T(n/2)+\Theta(n)
$$

则：

$$
a=2,\quad b=2,\quad f(n)=\Theta(n)
$$

### Step 2：计算临界函数

计算：

$$
n^{\log_b a}
$$

这个函数是递归树叶子层总代价的量级。

### Step 3：比较 $f(n)$ 与 $n^{\log_b a}$

主方法常用三种情况。

#### Case 1：叶子层主导

若存在常数 $\varepsilon>0$，使得：

$$
f(n)=O\left(n^{\log_b a-\varepsilon}\right)
$$

即 $f(n)$ 比 $n^{\log_b a}$ **多项式级更小**，则：

$$
T(n)=\Theta\left(n^{\log_b a}\right)
$$

递归树直觉：每层代价从根到叶子递增，叶子层贡献主导。

#### Case 2：每层代价同阶

若存在常数 $k\ge 0$，使得：

$$
f(n)=\Theta\left(n^{\log_b a}\log^k n\right)
$$

则：

$$
T(n)=\Theta\left(n^{\log_b a}\log^{k+1}n\right)
$$

最常见特例是 $k=0$：

$$
f(n)=\Theta\left(n^{\log_b a}\right)
\Longrightarrow
T(n)=\Theta\left(n^{\log_b a}\log n\right)
$$

递归树直觉：每一层代价大致相同，共有 $\log_b n$ 层。

#### Case 3：根层主导

若存在常数 $\varepsilon>0$，使得：

$$
f(n)=\Omega\left(n^{\log_b a+\varepsilon}\right)
$$

且满足正则条件（regularity condition）：

$$
af(n/b)\le cf(n)
$$

其中某个常数 $c<1$，并且对充分大的 $n$ 成立，则：

$$
T(n)=\Theta(f(n))
$$

递归树直觉：每层代价从根到叶子递减，根节点代价占主导。

> [!warning]
> Case 3 不只要求 $f(n)$ 多项式级更大，还要求正则条件。正则条件用于排除某些增长不稳定的函数。

---

## 3. 需要问题具有的性质

主方法不是所有递归式都能用。通常需要满足以下条件。

### 3.1 必须是标准分治递归式

形式应为：

$$
T(n)=aT(n/b)+f(n)
$$

其中 $a$ 和 $b$ 是常数。

适合：

```text
T(n) = 2T(n/2) + Θ(n)
T(n) = 7T(n/2) + Θ(n^2)
T(n) = 4T(n/2) + n^3
```

不直接适合：

```text
T(n) = T(n-1) + n
T(n) = T(n/3) + T(2n/3) + n
T(n) = 2T(n/2) + n / log n
```

第三个例子虽然形似标准形式，但 $f(n)$ 与 $n^{\log_b a}$ 的差距不是多项式级，也不属于 Case 2 的 $\log^k n$ 形式，因此普通主方法不能直接应用。

### 3.2 子问题规模要按固定比例缩小

主方法要求子问题规模是 $n/b$，即每次都按固定比例缩小。

例如：

$$
T(n)=T(n/2)+\Theta(1)
$$

可以用；但：

$$
T(n)=T(n-1)+\Theta(n)
$$

不能用主方法，通常用 [迭代展开法](/blog/cs-major-courses/introduction-to-algorithms/iterating-the-recurrence-迭代展开法/) 或求和分析。

### 3.3 子问题数量固定

$a$ 应该是常数。

例如：

$$
T(n)=2T(n/2)+n
$$

可以用；但如果递归式中子问题数量随 $n$ 变化，例如：

$$
T(n)=nT(n/2)+n
$$

则不属于普通主方法的标准范围。

### 3.4 $f(n)$ 需要能与 $n^{\log_b a}$ 清楚比较

比较结果必须落入三种情况之一：

1. 多项式级更小；
2. 同阶或差一个 $\log^k n$；
3. 多项式级更大并满足正则条件。

> [!tip]
> 若无法清楚归入三种情况，优先改用 [递归树法](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/) 形成猜测，再用 [代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/) 证明。

---

## 4. 判定模板

```text
输入：递归式 T(n) = aT(n/b) + f(n)

1. 读出 a, b, f(n)
2. 计算 g(n) = n^(log_b a)
3. 比较 f(n) 与 g(n)
   - 若 f(n) = O(g(n) / n^ε)，则 Case 1
   - 若 f(n) = Θ(g(n) log^k n)，则 Case 2
   - 若 f(n) = Ω(g(n) n^ε)，且 af(n/b) ≤ cf(n)，则 Case 3
4. 写出 T(n) 的 Θ 结果
5. 若不满足任何情况，说明主方法不适用
```

---

## 5. 典型例子

### 例 1：归并排序 Merge Sort

递归式：

$$
T(n)=2T(n/2)+\Theta(n)
$$

参数：

$$
a=2,\quad b=2,\quad f(n)=\Theta(n)
$$

计算临界函数：

$$
n^{\log_b a}=n^{\log_2 2}=n
$$

比较：

$$
f(n)=\Theta(n)=\Theta\left(n^{\log_2 2}\right)
$$

属于 Case 2，且 $k=0$，因此：

$$
T(n)=\Theta(n\log n)
$$

结论：

$$
\boxed{T(n)=\Theta(n\log n)}
$$

---

### 例 2：二分查找 Binary Search

递归式：

$$
T(n)=T(n/2)+\Theta(1)
$$

参数：

$$
a=1,\quad b=2,\quad f(n)=\Theta(1)
$$

临界函数：

$$
n^{\log_b a}=n^{\log_2 1}=n^0=1
$$

比较：

$$
f(n)=\Theta(1)=\Theta(n^0)
$$

属于 Case 2，且 $k=0$，因此：

$$
T(n)=\Theta(\log n)
$$

结论：

$$
\boxed{T(n)=\Theta(\log n)}
$$

---

### 例 3：Strassen 矩阵乘法

递归式：

$$
T(n)=7T(n/2)+\Theta(n^2)
$$

参数：

$$
a=7,\quad b=2,\quad f(n)=\Theta(n^2)
$$

临界函数：

$$
n^{\log_b a}=n^{\log_2 7}\approx n^{2.81}
$$

比较：

$$
f(n)=\Theta(n^2)=O\left(n^{\log_2 7-\varepsilon}\right)
$$

其中可取某个 $0<\varepsilon<\log_2 7-2$。

属于 Case 1，因此：

$$
T(n)=\Theta(n^{\log_2 7})
$$

结论：

$$
\boxed{T(n)=\Theta(n^{\log_2 7})}
$$

---

### 例 4：三种情况对比

考虑：

$$
T(n)=4T(n/2)+f(n)
$$

此时：

$$
a=4,\quad b=2,\quad n^{\log_b a}=n^{\log_2 4}=n^2
$$

| $f(n)$ | 情况 | 结果 |
|---|---|---|
| $n$ | Case 1 | $T(n)=\Theta(n^2)$ |
| $n^2$ | Case 2 | $T(n)=\Theta(n^2\log n)$ |
| $n^3$ | Case 3 | $T(n)=\Theta(n^3)$ |

#### 例 4.1：Case 1

$$
T(n)=4T(n/2)+n
$$

因为：

$$
f(n)=n=O(n^{2-1})
$$

所以：

$$
T(n)=\Theta(n^2)
$$

#### 例 4.2：Case 2

$$
T(n)=4T(n/2)+n^2
$$

因为：

$$
f(n)=\Theta(n^2)=\Theta(n^{\log_2 4})
$$

所以：

$$
T(n)=\Theta(n^2\log n)
$$

#### 例 4.3：Case 3

$$
T(n)=4T(n/2)+n^3
$$

因为：

$$
f(n)=n^3=\Omega(n^{2+1})
$$

并且满足正则条件：

$$
4f(n/2)=4(n/2)^3=\frac{1}{2}n^3\le cf(n)
$$

取 $c=1/2<1$，所以：

$$
T(n)=\Theta(n^3)
$$

### 例5：变量替换后间接使用主方法

有些递归式**不直接满足主方法的标准形式**，但可以通过变量替换转化为标准形式，再间接使用主方法。

考虑递归式：

$$  
T(n)=2T(\sqrt n)+\log n  
$$

#### 1. 为什么不能直接使用主方法？

主方法要求递归式具有如下形式：

$$  
T(n)=aT(n/b)+f(n)  
$$

其中子问题规模必须是原问题规模的常数比例：

$$  
\frac{n}{b}  
$$

但在该例中，子问题规模是：

$$  
\sqrt n=n^{1/2}  
$$

它不是 $\frac{n}{b}$ 的形式，因此不能直接套用主方法。

> [!warning] 易错点  
> 只要递归式中出现 $T(\sqrt n)$、$T(n^{1/3})$ 这类子问题规模，就不能直接看作 $T(n/b)$。

#### 2. 变量替换

令：

$$  
n=2^m  
$$

则：

$$  
m=\log n  
$$

定义新函数：

$$  
S(m)=T(2^m)  
$$

将 $n=2^m$ 代入原递归式：

$$  
T(2^m)=2T(\sqrt{2^m})+\log(2^m)  
$$

由于：

$$  
\sqrt{2^m}=2^{m/2}  
$$

并且：

$$  
\log(2^m)=m  
$$

所以：

$$  
T(2^m)=2T(2^{m/2})+m  
$$

根据 $S(m)=T(2^m)$，得到：

$$  
S(m)=2S(m/2)+m  
$$

此时递归式已经转化为主方法的标准形式：

$$  
S(m)=aS(m/b)+f(m)  
$$

其中：

$$  
a=2,\qquad b=2,\qquad f(m)=m  
$$

#### 3. 使用主方法求解

计算临界函数：

$$  
m^{\log_b a}=m^{\log_2 2}=m  
$$

比较 $f(m)$ 与 $m^{\log_b a}$：

$$  
f(m)=m=\Theta(m)  
$$

因此属于主方法 Case 2：

$$  
S(m)=\Theta(m\log m)  
$$

#### 4. 换回原变量

因为：

$$  
m=\log n  
$$

所以：

$$  
T(n)=S(\log n)  
$$

代入：

$$  
T(n)=\Theta(\log n\cdot \log\log n)  
$$

最终：

$$  
\boxed{T(n)=\Theta(\log n\log\log n)}  
$$

#### 5. 方法总结

这类递归式的一般形式是：

$$  
T(n)=aT(n^\alpha)+f(n)  
$$

其中 $0<\alpha<1$。

常用处理方法是令：

$$  
n=2^m  
$$

于是：

$$  
n^\alpha=(2^m)^\alpha=2^{\alpha m}  
$$

从而把 $T(n^\alpha)$ 转化为 $S(\alpha m)$，也就是把“幂次缩小”转化成“常数比例缩小”。

例如：

$$  
T(\sqrt n)=T(n^{1/2})  
$$

在 $n=2^m$ 下变成：

$$  
T(2^{m/2})=S(m/2)  
$$

于是原问题就可以间接转化为主方法可处理的形式。

> [!tip] 判断规则  
> 当子问题规模不是 $n/b$，但可以通过变量替换变成某个新变量的常数比例缩小时，可以考虑先换元，再使用主方法。

---

## 6. 常见错误

### 错误 1：只看 $f(n)$，不算 $n^{\log_b a}$

错误做法：看到 $f(n)=n$ 就直接判断 $T(n)=\Theta(n\log n)$。

正确做法：必须先计算：

$$
n^{\log_b a}
$$

例如：

$$
T(n)=4T(n/2)+n
$$

虽然 $f(n)=n$，但：

$$
n^{\log_2 4}=n^2
$$

所以答案是：

$$
T(n)=\Theta(n^2)
$$

### 错误 2：Case 3 忘记检查正则条件

Case 3 需要同时满足：

$$
f(n)=\Omega\left(n^{\log_b a+\varepsilon}\right)
$$

和：

$$
af(n/b)\le cf(n),\quad c<1
$$

不能只看 $f(n)$ 比 $n^{\log_b a}$ 大。

### 错误 3：把非标准递归式硬套主方法

例如：

$$
T(n)=T(n/3)+T(2n/3)+n
$$

不是 $aT(n/b)+f(n)$ 的形式，不能直接用普通主方法。可用递归树或 Akra-Bazzi 方法，但普通课程中通常用递归树分析即可。

---

## 7. 与其他方法的关系

| 方法 | 作用 |
|---|---|
| [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/) | 最通用，适合严格证明 |
| [Recursion Tree Method 递归树法](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/) | 提供直觉，帮助猜测解 |
| [Master Method 主方法](/blog/cs-major-courses/introduction-to-algorithms/master-method-主方法/) | 快速处理标准分治递归式 |
| [Iterating the Recurrence 迭代展开法](/blog/cs-major-courses/introduction-to-algorithms/iterating-the-recurrence-迭代展开法/) | 适合单分支或简单递归式 |

> [!note]
> 主方法可以看作递归树法的“公式化快捷版”。当递归树每层代价呈现几何递增、基本持平或几何递减时，就分别对应 Case 1、Case 2、Case 3。

---

## 8. 速查表

给定：

$$
T(n)=aT(n/b)+f(n)
$$

令：

$$
g(n)=n^{\log_b a}
$$

| 比较关系 | 递归树主导层 | 结论 |
|---|---|---|
| $f(n)=O(g(n)/n^\varepsilon)$ | 叶子层 | $T(n)=\Theta(g(n))$ |
| $f(n)=\Theta(g(n)\log^k n)$ | 每层同阶 | $T(n)=\Theta(g(n)\log^{k+1}n)$ |
| $f(n)=\Omega(g(n)n^\varepsilon)$ 且满足正则条件 | 根层 | $T(n)=\Theta(f(n))$ |

---

## 参考资料

- Cormen, Thomas H.; Leiserson, Charles E.; Rivest, Ronald L.; Stein, Clifford. *Introduction to Algorithms*, 3rd ed. Chapter 4.5, **The master method**.
- Erik D. Demaine; Charles E. Leiserson. MIT 6.046J / 18.401J, Lecture 2, **Asymptotic Notation and Recurrences**.
- Erik D. Demaine; Charles E. Leiserson. MIT 6.046J / 18.401J, Lecture 3, **Divide and Conquer**.

