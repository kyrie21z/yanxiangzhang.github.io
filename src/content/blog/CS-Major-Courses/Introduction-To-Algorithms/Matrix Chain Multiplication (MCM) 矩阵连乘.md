---
title: "矩阵连乘（MCM）动态规划"
description: "矩阵连乘（MCM）动态规划 给定矩阵链 $A 0A 1\\cdots A {n 1}$，设维度数组为 $p [p 0,p 1,\\ldots,p n]$，其中 $A i$ 的维度为 $p i\\times p {i+1}$。 定义： $$ dp[i][j] \\text{计算 }A iA {i+1}\\cdots A j\\..."
pubDate: "2026-06-14"
---

# 矩阵连乘（MCM）动态规划

> [!summary] 核心结论
> 给定矩阵链 $A_0A_1\cdots A_{n-1}$，设维度数组为 $p=[p_0,p_1,\ldots,p_n]$，其中 $A_i$ 的维度为 $p_i\times p_{i+1}$。
>
> 定义：
>
> $$
> dp[i][j] = \text{计算 }A_iA_{i+1}\cdots A_j\text{ 所需的最少标量乘法次数}
> $$
>
>
> 状态转移：
>
> $$
> dp[i][j] = \min_{i\le k<j} \left( dp[i][k] + dp[k+1][j] + p_i p_{k+1} p_{j+1} \right)
> $$
>
>
> 最终答案为：
>
> $$
> dp[0][n-1]
> $$
>
>

---

## 1. 问题定义

给定 n 个可以连续相乘的矩阵：

$$
A_0A_1\cdots A_{n-1}
$$

矩阵乘法满足结合律，因此不同的加括号方式得到的最终矩阵相同，但计算量可能不同。

例如：

$$
A_0A_1A_2
$$

可以按以下两种方式计算：

$$
(A_0A_1)A_2
$$

或：

$$
A_0(A_1A_2)
$$

矩阵连乘问题的目标是：

> 找到一种加括号方式，使标量乘法次数最少。

MCM 算法只决定最优计算顺序，并不真正执行矩阵乘法。

---

## 2. 输入如何表示

设维度数组为：

$$
p=[p_0,p_1,\ldots,p_n]
$$

第 i 个矩阵的维度为：

$$
A_i:p_i\times p_{i+1}
$$

其中：

$$
0\le i<n
$$

因此：

$$
n=\operatorname{len}(p)-1
$$

也就是说：

- 维度数组有 n+1 个元素；

- 矩阵链中有 n 个矩阵。

### 示例

若：

$$
p=[5,4,6,2]
$$

则：

$$
A_0:5\times4
$$

$$
A_1:4\times6
$$

$$
A_2:6\times2
$$

所以：

$$
n=4-1=3
$$

---

## 3. 为什么这是区间动态规划

原问题是计算整个矩阵链：

$$
A_0A_1\cdots A_{n-1}
$$

缩小后的子问题仍然是一段连续矩阵链：

$$
A_iA_{i+1}\cdots A_j
$$

一个子问题需要由两个下标确定：

- i：子链起点；

- j：子链终点。

因此使用二维状态：

$$
dp[i][j]
$$

这类状态由连续区间 [i,j] 描述，所以属于**区间 DP**。

---

## 4. `dp` 数组的状态定义

定义：

$$
\boxed{ dp[i][j] = \text{计算矩阵链 }A_iA_{i+1}\cdots A_j \text{ 所需的最少标量乘法次数} }
$$

其中：

$$
0\le i\le j<n
$$

> [!note] 如何口头理解
> 看到 `dp[i][j]` 时，应立即翻译成：
>
> “计算从第 i 个矩阵到第 j 个矩阵这一整段矩阵链的最小代价。”
>
> 例如：
>
> - `dp[0][0]`：计算 $A_0$ 的最小代价；
> - `dp[1][2]`：计算 $A_1A_2$ 的最小代价；
> - `dp[0][n-1]`：计算完整矩阵链的最小代价。
>
> `dp[i][j]` 存储的是一个数值，即最少标量乘法次数；它不存储矩阵本身，也不存储矩阵乘法结果。

---

## 5. `dp` 数组大小与输入的关系

设：

$$
n=\operatorname{len}(p)-1
$$

则矩阵编号为：

$$
A_0,A_1,\ldots,A_{n-1}
$$

所以 `dp` 的逻辑大小为：

$$
n\times n
$$

Python 中可以写为：

```python
n = len(p) - 1
dp = [[0] * n for _ in range(n)]
```

其中：

- 行下标表示区间起点 i；

- 列下标表示区间终点 j。

只有满足：

$$
i\le j
$$

的状态有意义，因此实际只使用 `dp` 的右上三角区域。

例如当 n=4 时：

|`dp[i][j]`|`j=0`|`j=1`|`j=2`|`j=3`|
|---|---|---|---|---|
|`i=0`|有效|有效|有效|有效|
|`i=1`|无效|有效|有效|有效|
|`i=2`|无效|无效|有效|有效|
|`i=3`|无效|无效|无效|有效|

下三角虽然没有使用，但直接分配完整二维数组可以显著简化实现，而且空间复杂度仍为 $\Theta(n^2)$。

---

## 6. 基本情况

当区间中只有一个矩阵时，不需要做矩阵乘法。

因此：

$$
\boxed{ dp[i][i]=0 }
$$

例如：

$$
dp[2][2]=0
$$

因为计算单个矩阵 A_2 不需要任何标量乘法。

---

## 7. 状态转移的推导

考虑子链：

$$
A_iA_{i+1}\cdots A_j
$$

它的最后一次矩阵乘法一定会在某个位置 k 处将区间划分成两部分：

$$
(A_i\cdots A_k)(A_{k+1}\cdots A_j)
$$

其中：

$$
i\le k<j
$$

总代价由三部分组成。

### 7.1 左半部分的最优代价

$$
dp[i][k]
$$

### 7.2 右半部分的最优代价

$$
dp[k+1][j]
$$

### 7.3 两个结果矩阵相乘的代价

左侧结果：

$$
A_i\cdots A_k
$$

其维度为：

$$
p_i\times p_{k+1}
$$

右侧结果：

$$
A_{k+1}\cdots A_j
$$

其维度为：

$$
p_{k+1}\times p_{j+1}
$$

因此，最后一次矩阵乘法的标量乘法次数为：

$$
p_i p_{k+1} p_{j+1}
$$

所以，在分割点 k 下的总代价为：

$$
dp[i][k] + dp[k+1][j] + p_i p_{k+1} p_{j+1}
$$

枚举所有可能的 k，取最小值：

$$
\boxed{ dp[i][j] = \min_{i\le k<j} \left( dp[i][k] + dp[k+1][j] + p_i p_{k+1} p_{j+1} \right) }
$$

---

## 8. 为什么转移式中的维度是 `p[i] * p[k+1] * p[j+1]`

这是 0-based 下标中最容易写错的地方。

对于分割：

$$
(A_i\cdots A_k)(A_{k+1}\cdots A_j)
$$

左侧结果维度：

$$
p_i\times p_{k+1}
$$

右侧结果维度：

$$
p_{k+1}\times p_{j+1}
$$

因此两个矩阵相乘的代价为：

$$
\boxed{ p_i p_{k+1} p_{j+1} }
$$

可以记忆为：

> 区间左端维度 × 分割位置右侧维度 × 区间右端的下一个维度。

---

## 9. 计算顺序

`dp[i][j]` 依赖于更短的区间：

$$
dp[i][k]
$$

和：

$$
dp[k+1][j]
$$

因此必须先计算短区间，再计算长区间。

令区间长度为：

$$
L=j-i+1
$$

计算顺序为：

$$
L=2,3,\ldots,n
$$

对每个长度 L：

1. 枚举起点 i；

2. 计算终点：

    $$
    j=i+L-1
    $$

3. 枚举分割点：

    $$
    k=i,i+1,\ldots,j-1
    $$

不能简单按 `i`、`j` 从小到大遍历，因为这样不一定保证所有依赖状态都已经计算完成。

区间 DP 的典型顺序是：**先枚举区间长度，再枚举区间起点**。

---

## 10. 精简伪代码

### 10.1 只求最少乘法次数

```text
MATRIX-CHAIN-ORDER(p)
    n ← length(p) - 1
    dp ← n × n array filled with 0

    for L ← 2 to n
        for i ← 0 to n - L
            j ← i + L - 1
            dp[i][j] ← +∞

            for k ← i to j - 1
                cost ← dp[i][k]
                        + dp[k+1][j]
                        + p[i] × p[k+1] × p[j+1]

                dp[i][j] ← min(dp[i][j], cost)

    return dp[0][n-1]
```

---

## 11. 恢复最优加括号方案

仅使用 `dp` 可以得到最少乘法次数，但无法直接知道最优括号如何放置。

因此额外使用：

$$
split[i][j]
$$

表示 `dp[i][j]` 取得最小值时的最优分割位置 k。

### 11.1 带路径记录的伪代码

```text
MATRIX-CHAIN-ORDER(p)
    n ← length(p) - 1
    dp ← n × n array filled with 0
    split ← n × n array

    for L ← 2 to n
        for i ← 0 to n - L
            j ← i + L - 1
            dp[i][j] ← +∞

            for k ← i to j - 1
                cost ← dp[i][k]
                        + dp[k+1][j]
                        + p[i] × p[k+1] × p[j+1]

                if cost < dp[i][j]
                    dp[i][j] ← cost
                    split[i][j] ← k

    return dp, split
```

### 11.2 输出最优括号

```text
PRINT-OPTIMAL-PARENS(split, i, j)
    if i = j
        print "A"i
        return

    k ← split[i][j]

    print "("
    PRINT-OPTIMAL-PARENS(split, i, k)
    PRINT-OPTIMAL-PARENS(split, k+1, j)
    print ")"
```

初始调用：

```text
PRINT-OPTIMAL-PARENS(split, 0, n-1)
```

---

## 12. 完整 Python 实现

```python
from math import inf


def matrix_chain_order(p: list[int]) -> tuple[int, str]:
    """
    返回：
    1. 最少标量乘法次数
    2. 最优加括号方案

    p 的长度为 n + 1，
    第 i 个矩阵 A_i 的维度为 p[i] × p[i + 1]。
    """
    if len(p) < 2:
        raise ValueError("维度数组 p 至少需要包含两个元素")

    n = len(p) - 1
    dp = [[0] * n for _ in range(n)]
    split = [[-1] * n for _ in range(n)]

    # L 表示矩阵子链长度
    for L in range(2, n + 1):
        for i in range(0, n - L + 1):
            j = i + L - 1
            dp[i][j] = inf

            for k in range(i, j):
                cost = (
                    dp[i][k]
                    + dp[k + 1][j]
                    + p[i] * p[k + 1] * p[j + 1]
                )

                if cost < dp[i][j]:
                    dp[i][j] = cost
                    split[i][j] = k

    def build_parenthesization(i: int, j: int) -> str:
        if i == j:
            return f"A{i}"

        k = split[i][j]
        left = build_parenthesization(i, k)
        right = build_parenthesization(k + 1, j)
        return f"({left}{right})"

    return dp[0][n - 1], build_parenthesization(0, n - 1)


if __name__ == "__main__":
    dimensions = [5, 4, 6, 2]
    min_cost, order = matrix_chain_order(dimensions)

    print("最少标量乘法次数：", min_cost)
    print("最优加括号方式：", order)

```

预期输出：

```text
最少标量乘法次数： 88
最优加括号方式： (A0(A1A2))
```


---

## 13. 具体示例

设：

$$
p=[5,4,6,2]
$$

则：

$$
A_0:5\times4
$$

$$
A_1:4\times6
$$

$$
A_2:6\times2
$$

### 13.1 长度为 1 的区间

$$
dp[0][0]=0
$$

$$
dp[1][1]=0
$$

$$
dp[2][2]=0
$$

### 13.2 长度为 2 的区间

对于 $A_0A_1$：

$$
dp[0][1] = 5\times4\times6 = 120
$$

对于 $A_1A_2$：

$$
dp[1][2] = 4\times6\times2 = 48
$$

### 13.3 长度为 3 的区间

计算：

$$
dp[0][2]
$$

#### 在 k=0 处分割

$$
A_0(A_1A_2)
$$

总代价：

$$
dp[0][0] + dp[1][2] + p_0p_1p_3
$$

$$
= 0+48+5\times4\times2
$$

$$
=88
$$

#### 在 k=1 处分割

$$
(A_0A_1)A_2
$$

总代价：

$$
dp[0][1] + dp[2][2] + p_0p_2p_3
$$

$$
= 120+0+5\times6\times2
$$

$$
=180
$$

因此：

$$
dp[0][2]=\min(88,180)=88
$$

最优方案为：

$$
\boxed{ A_0(A_1A_2) }
$$

---

## 14. `dp` 表示例

对于：

$$
p=[5,4,6,2]
$$

`dp` 表为：

|`dp[i][j]`|`j=0`|`j=1`|`j=2`|
|---|---|---|---|
|`i=0`|0|120|88|
|`i=1`|无效|0|48|
|`i=2`|无效|无效|0|

最终答案：

$$
dp[0][2]=88
$$

---

## 15. 正确性说明

### 15.1 最优子结构

假设 $A_i\cdots A_j$ 的最优方案最后在 k 处分割：

$$
(A_i\cdots A_k)(A_{k+1}\cdots A_j)
$$

那么左半部分 $A_i\cdots A_k$ 必须采用最优方案。

否则，如果左半部分存在更小代价的计算方法，用它替换当前左半部分，就能得到一个更优的整体方案，与原方案最优矛盾。

右半部分同理。

因此该问题具有最优子结构。

### 15.2 完备性

对于区间 $[i,j]$，最后一次乘法的分割点必然满足：

$$
i\le k<j
$$

算法枚举了所有可能的 k，所以不会遗漏任何加括号方案。

因此，取所有分割方案中的最小值即可得到最优解。

---

## 16. 复杂度分析

### 时间复杂度

三层循环分别枚举：

1. 区间长度 L；

2. 区间起点 i；

3. 分割点 k。

因此：

$$
\boxed{ T(n)=\Theta(n^3) }
$$

### 空间复杂度

`dp` 和 `split` 都是 $n\times n$ 数组：

$$
\boxed{ S(n)=\Theta(n^2) }
$$

恢复括号方案的递归深度最多为：

$$
O(n)
$$

---

## 17. 常见错误

> [!danger] 错误 1：把矩阵数量写成 `len(p)`
> 正确关系是：
>
> $$
> n=\operatorname{len}(p)-1
> $$
>
>

> [!danger] 错误 2：错误定义状态
> `dp[i][j]` 不是矩阵 $A_i$ 与 $A_j$ 相乘的代价，而是整个连续子链：
>
> $$
> A_iA_{i+1}\cdots A_j
> $$
>
>

> [!danger] 错误 3：写错最后一次乘法的维度
> 在 0-based 下标下，正确代价为：
>
> $$
> p_i p_{k+1} p_{j+1}
> $$
>
> 不是 $p_{i-1}p_kp_j$。后者对应 1-based 矩阵编号。

> [!danger] 错误 4：按普通二维数组顺序填写
> 区间 DP 必须优先保证短区间已经完成，因此应先枚举区间长度。

> [!danger] 错误 5：分割点枚举到 `j`
> 分割点范围应为：
>
> $$
> i\le k<j
> $$
>
> Python 中对应：
>
> ```python
> for k in range(i, j):
> ```

> [!danger] 错误 6：认为 `dp` 存储矩阵计算结果
> `dp` 仅存储最小标量乘法次数。真实矩阵结果不需要保存。

---

## 18. 状态设计检查清单

遇到类似动态规划问题时，可以按以下顺序思考：

### 18.1 原问题缩小后是什么

完整矩阵链：

$$
A_0\cdots A_{n-1}
$$

缩小后仍然是连续矩阵子链：

$$
A_i\cdots A_j
$$

### 18.2 需要哪些参数确定子问题

需要起点 i 和终点 j，因此使用二维状态：

$$
dp[i][j]
$$

### 18.3 状态保存什么

问题要求最小计算量，所以保存：

$$
\text{最少标量乘法次数}
$$

### 18.4 如何从更小状态转移

枚举最后一次乘法的分割点 k：

$$
[i,k]+[k+1,j]
$$

### 18.5 最终答案在哪里

完整区间是：

$$
[0,n-1]
$$

因此答案为：

$$
dp[0][n-1]
$$

---

## 19. 一句话记忆

> [!quote]
> `dp[i][j]` 表示计算连续矩阵链 $A_i\cdots A_j$ 的最少标量乘法次数；枚举最后一次乘法的分割点 k，由左右两个子区间的最优代价加上最后一次矩阵乘法代价完成转移。

---

## 20. 参考资料

- Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein. _Introduction to Algorithms_, 3rd Edition. Chapter 15: Dynamic Programming, Section 15.2: Matrix-chain multiplication.

- MIT Introduction to Algorithms, Dynamic Programming lecture materials.