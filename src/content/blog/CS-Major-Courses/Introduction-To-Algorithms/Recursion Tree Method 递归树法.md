---
title: "Recursion Tree Method 递归树法"
description: "Recursion Tree Method 递归树法 递归树法（Recursion Tree Method） 是求解递归式的一种直观方法：把递归式展开成一棵树，每个结点表示一个子问题的非递归代价；然后逐层求和，最后把所有层的代价相加，得到 $T(n)$ 的渐近界。 1. 基本思想 递归式通常来自 Divide a..."
pubDate: "2026-06-19"
---

# Recursion Tree Method 递归树法

> [!summary]
> **递归树法（Recursion Tree Method）** 是求解递归式的一种直观方法：把递归式展开成一棵树，每个结点表示一个子问题的非递归代价；然后逐层求和，最后把所有层的代价相加，得到 $T(n)$ 的渐近界。

## 1. 基本思想

递归式通常来自 Divide and Conquer 分治法：

$$
T(n)=\text{递归子问题代价}+\text{划分/合并等非递归代价}
$$

递归树法把递归执行过程可视化为一棵树：

- **根结点**：原问题规模 $n$，结点代价是根层的非递归工作；
- **内部结点**：某个子问题，结点代价是该子问题内部的非递归工作；
- **叶子结点**：达到基本情况，例如 $T(1)=\Theta(1)$；
- **每层总代价**：该层所有结点代价之和；
- **总时间**：所有层总代价之和。

因此，递归树法的核心公式是：

$$
T(n)=\sum_{\text{levels }i}\text{cost at level }i
$$

> [!important]
> 递归树法的价值主要在于**看清每层代价如何变化**，并据此猜测递归式的渐近解。严格证明时，通常还需要用 [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/) 验证猜测。

## 2. 具体过程

### 2.1 写出递归式

先把算法运行时间写成递归式。例如 [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/)：

$$
T(n)=2T(n/2)+cn
$$

其中：

- $2T(n/2)$：递归排序两个规模为 $n/2$ 的子数组；
- $cn$：合并两个有序数组的线性代价；
- $T(1)=\Theta(1)$：规模为 $1$ 时为基本情况。

### 2.2 展开前几层

把递归式展开为树。

以 $T(n)=2T(n/2)+cn$ 为例：

```text
level 0:                 cn
                       /    \
level 1:            c(n/2) c(n/2)
                   /   \    /   \
level 2:        c(n/4) ... ... c(n/4)
                   ...
leaves:          Θ(1) Θ(1) ... Θ(1)
```

第 $i$ 层有 $2^i$ 个子问题，每个子问题规模为 $n/2^i$，单个结点代价为：

$$
c\frac{n}{2^i}
$$

所以第 $i$ 层总代价为：

$$
2^i\cdot c\frac{n}{2^i}=cn
$$

### 2.3 求树高

树高由子问题规模下降到基本情况决定。

对 $T(n)=2T(n/2)+cn$：

$$
\frac{n}{2^h}=1
$$

解得：

$$
h=\log_2 n
$$

因此递归树大约有 $\log_2 n+1$ 层。

### 2.4 求叶子总代价

叶子数为：

$$
2^h=2^{\log_2 n}=n
$$

每个叶子代价为 $\Theta(1)$，所以叶子总代价为：

$$
\Theta(n)
$$

### 2.5 对所有层求和

内部每层总代价都是 $cn$，共有 $\log_2 n$ 层，因此内部总代价为：

$$
cn\log_2 n
$$

再加上叶子代价：

$$
T(n)=cn\log_2 n+\Theta(n)=\Theta(n\log n)
$$

## 3. 需要问题具有的性质

递归树法适合以下类型的问题。

### 3.1 递归式能表示递归执行过程

递归式应能明确区分：

- 子问题规模；
- 子问题数量；
- 当前层非递归代价；
- 基本情况。

典型形式包括：

$$
T(n)=aT(n/b)+f(n)
$$

以及更一般的不对称形式：

$$
T(n)=T(n/4)+T(n/2)+n^2
$$

### 3.2 子问题规模必须逐步变小

递归树必须能在有限层后到达基本情况，例如：

$$
T(1)=\Theta(1)
$$

如果子问题规模不收敛到基本情况，递归树就不能用于正常的运行时间分析。

### 3.3 每个结点的非递归代价可估计

例如：

- 归并排序的合并代价为 $\Theta(n)$；
- 快速排序一次 partition 的代价为 $\Theta(n)$；
- 某些递归式的根层代价可能是 $n^2$、$n\log n$ 等。

递归树法依赖这些结点代价来计算每层总和。

### 3.4 每层总代价可以求和

递归树法的关键不是“画树”，而是能写出每层代价序列。例如：

- 每层相同：

$$
n+n+n+\cdots+n
$$

- 几何递减：

$$
n^2+\frac{5}{16}n^2+\left(\frac{5}{16}\right)^2n^2+\cdots
$$

- 算术递减：

$$
n+(n-1)+(n-2)+\cdots+1
$$

### 3.5 允许忽略不影响渐近结果的取整细节

在算法分析中，常把：

$$
T(\lceil n/2\rceil)+T(\lfloor n/2\rfloor)
$$

近似写成：

$$
2T(n/2)
$$

只要这种简化不改变渐近阶即可。若需要严格证明，应回到 [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/) 处理取整和初始条件。

## 4. 典型例子

## 4.1 例 1：归并排序递归式

递归式：

$$
T(n)=2T(n/2)+cn
$$

基本情况：

$$
T(1)=\Theta(1)
$$

第 $i$ 层：

- 子问题数量：$2^i$；
- 每个子问题规模：$n/2^i$；
- 每个结点代价：$c(n/2^i)$；
- 层总代价：

$$
2^i\cdot c\frac{n}{2^i}=cn
$$

树高：

$$
h=\log_2 n
$$

叶子总代价：

$$
\Theta(n)
$$

总时间：

$$
T(n)=\underbrace{cn+cn+\cdots+cn}_{\log_2 n\text{ 层}}+\Theta(n)
$$

$$
T(n)=\Theta(n\log n)
$$

> [!tip]
> 这个例子体现了递归树法最常见的一种结构：**每层代价相同，层数为 $\log n$，因此总时间为 $\Theta(n\log n)$**。

## 4.2 例 2：不对称递归式

递归式：

$$
T(n)=T(n/4)+T(n/2)+n^2
$$

根层代价：

$$
n^2
$$

第 1 层代价：

$$
\left(\frac n4\right)^2+\left(\frac n2\right)^2
=\frac{n^2}{16}+\frac{n^2}{4}
=\frac{5}{16}n^2
$$

第 2 层代价：

$$
\left(\frac{5}{16}\right)^2n^2
$$

继续展开，每层代价构成几何级数：

$$
n^2\left(1+\frac{5}{16}+\left(\frac{5}{16}\right)^2+\cdots\right)
$$

由于：

$$
0<\frac{5}{16}<1
$$

所以该级数收敛，且总和被根层代价主导：

$$
T(n)=\Theta(n^2)
$$

> [!note]
> 这个例子说明：当每层代价按固定比例下降时，总时间通常由根层代价主导。

## 4.3 例 3：快速排序最坏情况

当快速排序每次 partition 都选到最小或最大元素时，一边为空，另一边规模为 $n-1$，递归式为：

$$
T(n)=T(0)+T(n-1)+cn
$$

由于 $T(0)=\Theta(1)$，可以写成：

$$
T(n)=T(n-1)+cn+\Theta(1)
$$

递归树退化成一条链：

```text
level 0: cn
level 1: c(n-1)
level 2: c(n-2)
...
level n-1: c
```

总时间为：

$$
T(n)=c\sum_{k=1}^{n}k+\Theta(n)
$$

$$
T(n)=\Theta(n^2)
$$

> [!warning]
> 递归树不一定是平衡树。快速排序最坏情况下的递归树高度为 $n$，不是 $\log n$。

## 4.4 例 4：快速排序近似平衡划分

若每次划分比例为 $1:9$，递归式为：

$$
T(n)=T(n/10)+T(9n/10)+cn
$$

虽然左右子问题不等大，但每一层所有子问题规模之和仍为 $n$，所以每层 partition 总代价为 $cn$。

较长路径的高度由较大的子问题 $9n/10$ 决定：

$$
\left(\frac{9}{10}\right)^h n=1
$$

解得：

$$
h=\log_{10/9} n=\Theta(\log n)
$$

因此：

$$
T(n)=O(n\log n)
$$

同时该递归式也有下界 $\Omega(n\log n)$，所以：

$$
T(n)=\Theta(n\log n)
$$

## 5. 常见层代价模式

| 层代价变化 | 典型形式 | 结论直觉 |
|---|---:|---|
| 每层相同 | $n,n,n,\ldots$ | 层数 $\log n$ 时，常得 $\Theta(n\log n)$ |
| 几何递减 | $n^2,\frac{5}{16}n^2,\ldots$ | 根层主导，常得 $\Theta(f(n))$ |
| 几何递增 | $1,2,4,\ldots,n$ | 叶子层主导，常得叶子总代价量级 |
| 算术递减 | $n,n-1,n-2,\ldots$ | 常得 $\Theta(n^2)$ |

## 6. 与其他方法的关系

| 方法                                 | 作用        | 特点                          |
| ---------------------------------- | --------- | --------------------------- |
| [Recursion Tree Method 递归树法](/blog/cs-major-courses/introduction-to-algorithms/recursion-tree-method-递归树法/)     | 形成直觉、估计答案 | 直观，但不总是严格                   |
| [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/)        | 验证猜测      | 最通用，适合严格证明                  |
| [Master Method 主方法](/blog/cs-major-courses/introduction-to-algorithms/master-method-主方法/)              | 快速求标准递归式  | 只适合特定形式 $T(n)=aT(n/b)+f(n)$ |
| [Iterating the Recurrence 迭代展开法](/blog/cs-major-courses/introduction-to-algorithms/iterating-the-recurrence-迭代展开法/) | 展开单分支递归式  | 适合 $T(n)=T(n/b)+f(n)$ 等简单形式 |

> [!important]
> 实战中推荐顺序：先用递归树法观察每层代价，得到候选答案；再用代入法证明上界或紧确界。

## 7. 易错点

> [!warning] 不要只看树高
> 树高是 $\log n$ 不代表总时间一定是 $\Theta(\log n)$。还必须看每层总代价。

> [!warning] 不要忽略叶子代价
> 有些递归式的叶子总代价可能主导总时间，尤其当每层代价递增时。

> [!warning] 递归树法常给出猜测，不自动等于证明
> 如果推导中使用了省略号、近似层数、忽略取整，最后最好用 [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/) 做严格证明。

## 8. 最小做题模板

```text
1. 写递归式：T(n)=...
2. 画前两到三层递归树。
3. 写第 i 层：
   - 子问题数量 = ...
   - 单个子问题规模 = ...
   - 单个结点代价 = ...
   - 第 i 层总代价 = ...
4. 求高度 h，使子问题规模降到 1。
5. 求叶子数与叶子总代价。
6. 对所有层求和。
7. 得到渐近界；必要时用代入法验证。
```

## 9. References

- Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein. *Introduction to Algorithms*, 3rd ed. Chapter 4.4: Recursion-tree method.
- Erik D. Demaine, Charles E. Leiserson. MIT 6.046J / 18.401J, Lecture 1: *Analysis of Algorithms*.
- Erik D. Demaine, Charles E. Leiserson. MIT 6.046J / 18.401J, Lecture 2: *Asymptotic Notation and Recurrences*.
- Erik D. Demaine, Charles E. Leiserson. MIT 6.046J / 18.401J, Lecture 4: *Quicksort*.

## 10. See also

- Recurrences 递归式
- [Substitution Method 代入法](/blog/cs-major-courses/introduction-to-algorithms/substitution-method-代入法/)
- [Master Method 主方法](/blog/cs-major-courses/introduction-to-algorithms/master-method-主方法/)
- Divide and Conquer 分治法
- [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/)
- [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/)
- [Asymptotic Notation & Analysis](/blog/cs-major-courses/introduction-to-algorithms/asymptotic-notation--analysis/)
