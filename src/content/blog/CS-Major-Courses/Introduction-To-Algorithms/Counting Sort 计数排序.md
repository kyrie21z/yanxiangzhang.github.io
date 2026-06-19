---
title: "Counting Sort 计数排序"
description: "Counting Sort 计数排序 计数排序（Counting Sort） 是一种不比较元素大小的整数排序算法。对于长度为 $n$、键值范围大小为 $k$ 的输入，其时间复杂度为 $\\Theta(n+k)$。当 $k O(n)$ 时，算法具有线性时间复杂度 $\\Theta(n)$。 1. 问题定义 给定包含 $..."
pubDate: "2026-06-17"
---

# Counting Sort 计数排序

> [!abstract] 核心结论
> **计数排序（Counting Sort）**是一种不比较元素大小的整数排序算法。对于长度为 $n$、键值范围大小为 $k$ 的输入，其时间复杂度为 $\Theta(n+k)$。当 $k=O(n)$ 时，算法具有线性时间复杂度 $\Theta(n)$。

## 1. 问题定义

给定包含 $n$ 个元素的数组：

$$
A[0 \dots n-1]
$$

每个元素具有一个整数键 `key(x)`，并且所有键都位于有限区间：

$$
\text{minKey} \le \operatorname{key}(x) \le \text{maxKey}
$$

定义键值范围大小：

$$
k=\text{maxKey}-\text{minKey}+1
$$

目标是构造一个按键非递减排列的输出数组：

$$
\operatorname{key}(B[0])\le \operatorname{key}(B[1])\le\cdots\le\operatorname{key}(B[n-1])
$$

> [!info] 与比较排序的区别
> [Insertion Sort 插入排序](/blog/cs-major-courses/introduction-to-algorithms/insertion-sort-插入排序/)、[Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/)、[Heap Sort 堆排序](/blog/cs-major-courses/introduction-to-algorithms/heap-sort-堆排序/) 和 [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/)通过元素比较确定相对顺序。计数排序直接利用整数键索引辅助数组，因此不属于比较排序，比较排序的 $\Omega(n\log n)$ 下界不适用于它。

## 2. 基本思想

计数排序不直接比较两个元素，而是统计每个键出现的次数。

核心过程如下：

1. 使用计数数组 `C` 统计每个键的出现次数。
2. 对 `C` 计算前缀和，使 `C[i]` 表示键值不大于索引 $i$ 所对应键值的元素数量。
3. 根据累计计数确定每个输入元素在输出数组 `B` 中的最终位置。
4. 从右向左扫描输入数组并回填 `B`，从而保持相同键元素的原始相对次序。

为支持负整数键，定义下标映射：

$$
\operatorname{index}(x)=\operatorname{key}(x)-\text{minKey}
$$

于是 `C[index(x)]` 对应键 `key(x)`。

## 3. 具体过程

### 3.1 初始化计数数组

创建长度为 $k$ 的数组：

$$
C[0\dots k-1]
$$

并将所有位置初始化为 $0$。

### 3.2 统计频数

遍历输入数组 `A`。对于每个元素 `A[j]`：

$$
C[\operatorname{index}(A[j])]
\leftarrow
C[\operatorname{index}(A[j])] + 1
$$

统计结束后，`C[i]` 表示对应键值出现的次数。

### 3.3 计算累计计数

从左向右计算前缀和：

$$
C[i]\leftarrow C[i]+C[i-1],\qquad 1\le i<k
$$

计算结束后：

$$
C[i]
=
\left|\left\{x\in A:\operatorname{index}(x)\le i\right\}\right|
$$

因此，`C[i] - 1` 是键值索引为 $i$ 的元素在输出数组中能够占据的最右位置。

### 3.4 稳定回填输出数组

从输入数组末尾向前扫描。对于元素 `A[j]`，令：

$$
i=\operatorname{index}(A[j])
$$

将其放入：

$$
B[C[i]-1]\leftarrow A[j]
$$

然后更新：

$$
C[i]\leftarrow C[i]-1
$$

> [!important] 为什么必须从右向左扫描
> 对于两个具有相同键的元素 $A[p]$ 和 $A[q]$，若 $p<q$，则 $A[q]$ 会先被放到该键值区间中更靠右的位置，随后 $A[p]$ 被放到更靠左的位置。因此输出中仍有 $A[p]$ 位于 $A[q]$ 之前，算法保持稳定。

## 4. 伪代码

以下伪代码使用 **0-based 下标**，并通过偏移量支持负整数键。

```text
COUNTING-SORT(A)
    n ← length(A)

    if n = 0
        return empty array

    minKey ← minimum key in A
    maxKey ← maximum key in A
    k ← maxKey - minKey + 1

    create array C[0 ... k - 1], initialized to 0
    create array B[0 ... n - 1]

    // 1. 统计每个键出现的次数
    for j ← 0 to n - 1
        index ← key(A[j]) - minKey
        C[index] ← C[index] + 1

    // 2. 计算累计计数
    for i ← 1 to k - 1
        C[i] ← C[i] + C[i - 1]

    // 3. 从右向左稳定回填
    for j ← n - 1 downto 0
        index ← key(A[j]) - minKey
        position ← C[index] - 1
        B[position] ← A[j]
        C[index] ← C[index] - 1

    return B
```

## 5. Python 实现

```python
from collections.abc import Callable, Sequence
from typing import TypeVar, cast

T = TypeVar("T")


def counting_sort(
    values: Sequence[T],
    key: Callable[[T], int],
) -> list[T]:
    """按整数键执行稳定计数排序并返回新列表。"""
    n = len(values)
    if n == 0:
        return []

    keys = [key(value) for value in values]
    if not all(isinstance(current_key, int) for current_key in keys):
        raise TypeError("key(value) 必须返回整数")

    min_key = min(keys)
    max_key = max(keys)
    range_size = max_key - min_key + 1

    count = [0] * range_size
    output: list[T | None] = [None] * n

    # 统计频数。
    for current_key in keys:
        count[current_key - min_key] += 1

    # 计算前缀和。
    for i in range(1, range_size):
        count[i] += count[i - 1]

    # 反向扫描，保证稳定性。
    for j in range(n - 1, -1, -1):
        index = keys[j] - min_key
        position = count[index] - 1
        output[position] = values[j]
        count[index] -= 1

    # 算法保证所有位置都已被填充。
    return [cast(T, value) for value in output]


if __name__ == "__main__":
    data = [4, 1, 3, 4, 3]
    result = counting_sort(data, key=lambda value: value)
    print(result)
    assert result == [1, 3, 3, 4, 4]

    records = [
        (4, "a"),
        (1, "b"),
        (3, "c"),
        (4, "d"),
        (3, "e"),
    ]
    stable_result = counting_sort(records, key=lambda item: item[0])
    print(stable_result)
    assert stable_result == [
        (1, "b"),
        (3, "c"),
        (3, "e"),
        (4, "a"),
        (4, "d"),
    ]
```

## 6. 时空间复杂度

设：

- $n$：输入元素数量；
- $k=\text{maxKey}-\text{minKey}+1$：键值范围大小。

### 6.1 时间复杂度

| 阶段 | 时间复杂度 |
|---|---:|
| 寻找最小键和最大键 | $\Theta(n)$ |
| 初始化计数数组 | $\Theta(k)$ |
| 统计频数 | $\Theta(n)$ |
| 计算前缀和 | $\Theta(k)$ |
| 构造输出数组 | $\Theta(n)$ |
| **总计** | **$\Theta(n+k)$** |

因此：

$$
T(n,k)=\Theta(n+k)
$$

当 $k=O(n)$ 时：

$$
T(n,k)=\Theta(n)
$$

> [!warning] “线性时间”是有条件的
> 计数排序并不总是关于 $n$ 的线性算法。例如 $n=10$，但键值范围为 $0$ 到 $10^9$ 时，计数数组的规模约为 $10^9$，算法在时间和空间上都不可接受。

### 6.2 空间复杂度

稳定版本需要：

- 长度为 $k$ 的计数数组 `C`；
- 长度为 $n$ 的输出数组 `B`。

因此辅助空间复杂度为：

$$
S(n,k)=\Theta(n+k)
$$

若只排序纯整数，并根据频数直接重写原数组，可以省去 `B`，将额外空间降低到 $\Theta(k)$；但这种简单写法无法稳定地排列带附属数据的记录。

## 7. 需要问题具有的性质

### 7.1 键可以映射为整数

元素的排序依据必须是整数，或者能够无冲突地映射到整数：

$$
\operatorname{key}:X\rightarrow\mathbb{Z}
$$

例如：

- 学生成绩：$0$ 到 $100$；
- 年龄：$0$ 到 $150$；
- 字符编码；
- 离散化后的类别编号。

### 7.2 键值范围有限且较小

范围大小 $k$ 不应远大于元素数量 $n$。通常希望：

$$
k=O(n)
$$

若 $k\gg n$，大量计数槽位始终为 $0$，会造成明显的时间与空间浪费。

### 7.3 允许使用额外存储空间

标准稳定实现需要 $\Theta(n+k)$ 的辅助空间，因此不适合对额外内存要求极严格的场景。

### 7.4 稳定性与扫描方向相匹配

当元素除了键之外还带有附属数据时，稳定性很重要。标准计数排序通过从右向左回填输出数组保证稳定性。

## 8. 典型例子

给定：

$$
A=[4,1,3,4,3]
$$

键值范围为 $0$ 到 $4$，因此 $k=5$。

### 8.1 统计频数

| 键值 | 0 | 1 | 2 | 3 | 4 |
|---:|---:|---:|---:|---:|---:|
| 出现次数 `C` | 0 | 1 | 0 | 2 | 2 |

### 8.2 计算前缀和

| 键值 | 0 | 1 | 2 | 3 | 4 |
|---:|---:|---:|---:|---:|---:|
| 累计计数 `C` | 0 | 1 | 1 | 3 | 5 |

含义如下：

- 不大于 $1$ 的元素共有 $1$ 个；
- 不大于 $3$ 的元素共有 $3$ 个；
- 不大于 $4$ 的元素共有 $5$ 个。

### 8.3 从右向左回填

| 当前元素 | 放置位置 | 操作 |
|---:|---:|---|
| $3$ | $C[3]-1=2$ | `B[2] = 3` |
| $4$ | $C[4]-1=4$ | `B[4] = 4` |
| $3$ | $C[3]-1=1$ | `B[1] = 3` |
| $1$ | $C[1]-1=0$ | `B[0] = 1` |
| $4$ | $C[4]-1=3$ | `B[3] = 4` |

最终结果：

$$
B=[1,3,3,4,4]
$$

### 8.4 稳定性示例

输入记录：

```text
[(4, a), (1, b), (3, c), (4, d), (3, e)]
```

只按照第一个分量排序后：

```text
[(1, b), (3, c), (3, e), (4, a), (4, d)]
```

其中 `(3, c)` 仍位于 `(3, e)` 之前，`(4, a)` 仍位于 `(4, d)` 之前，因此排序是稳定的。

## 9. 正确性要点

计算前缀和后，`C[i]` 等于键值索引不大于 $i$ 的元素数量，因此：

$$
C[i]-1
$$

恰好是键值索引为 $i$ 的尚未放置元素能够占据的最右下标。

每放置一个该键值元素，就执行：

$$
C[i]\leftarrow C[i]-1
$$

于是下一个相同键元素会被放置到其左侧。最终：

1. 每个输入元素恰好被放置一次；
2. 键较小的元素位于键较大的元素之前；
3. 相同键元素保持原有相对顺序。

因此输出数组按键非递减排列，且标准实现是稳定的。

## 10. 常见错误

> [!bug] 错误一：混淆频数和累计计数
> 统计频数后，`C[i]` 只表示对应键出现多少次；只有计算前缀和后，它才能用于确定输出位置。

> [!bug] 错误二：遗漏 `-1`
> 由于数组使用 0-based 下标，若 `C[i]` 表示元素数量，则最右合法位置是 `C[i] - 1`，不是 `C[i]`。

> [!bug] 错误三：从左向右回填却声称算法稳定
> 使用累计计数的标准写法若从左向右扫描输入，会颠倒相同键元素的相对顺序。为了保证稳定性，应从右向左扫描。

> [!bug] 错误四：忽略负数偏移
> 若存在负整数键，应使用 $\operatorname{index}(x)=\operatorname{key}(x)-\text{minKey}$，不能直接将负数作为数组下标。

> [!bug] 错误五：无条件写成 $O(n)$
> 一般复杂度应写为 $\Theta(n+k)$。只有在 $k=O(n)$ 时，才能进一步写成 $\Theta(n)$。

## 11. 与其他排序算法对比

| 算法 | 类型 | 时间复杂度 | 辅助空间 | 稳定性 | 主要限制 |
|---|---|---:|---:|---|---|
| Counting Sort | 非比较排序 | $\Theta(n+k)$ | $\Theta(n+k)$ | 是 | 整数键且范围较小 |
| [Insertion Sort 插入排序](/blog/cs-major-courses/introduction-to-algorithms/insertion-sort-插入排序/) | 比较排序 | $O(n^2)$ | $O(1)$ | 是 | 大规模输入较慢 |
| [Merge Sort 归并排序](/blog/cs-major-courses/introduction-to-algorithms/merge-sort-归并排序/) | 比较排序 | $\Theta(n\log n)$ | $\Theta(n)$ | 是 | 需要额外数组 |
| [Heap Sort 堆排序](/blog/cs-major-courses/introduction-to-algorithms/heap-sort-堆排序/) | 比较排序 | $\Theta(n\log n)$ | $O(1)$ | 否 | 非稳定排序 |
| [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/) | 比较排序 | 期望 $\Theta(n\log n)$ | 期望 $O(\log n)$ | 否 | 最坏时间为 $\Theta(n^2)$ |
| [Radix Sort 基数排序](/blog/cs-major-courses/introduction-to-algorithms/radix-sort-基数排序/) | 非比较排序 | 取决于位数和基数 | 取决于辅助排序 | 取决于辅助排序 | 每一位排序必须稳定 |

## 12. 适用场景与不适用场景

### 适用场景

- 大量学生成绩按分数排序；
- 年龄、月份、星期等范围固定的离散数据；
- 作为 [Radix Sort 基数排序](/blog/cs-major-courses/introduction-to-algorithms/radix-sort-基数排序/) 的稳定子程序；
- 统计直方图后需要恢复有序序列；
- 键值范围与输入规模同阶的整数排序。

### 不适用场景

- 浮点数不能自然映射到较小整数范围；
- 字符串键的可能取值空间很大；
- 键值极度稀疏，例如只有少量元素却横跨巨大整数范围；
- 内存受限且 $k$ 较大；
- 需要通用原地排序。

## 13. 总结

> [!summary]
> - 计数排序通过“统计频数 → 前缀和 → 定位回填”完成排序。
> - 一般时间复杂度为 $\Theta(n+k)$，空间复杂度为 $\Theta(n+k)$。
> - 当 $k=O(n)$ 时，时间复杂度为 $\Theta(n)$。
> - 它不是比较排序，因此不受比较排序 $\Omega(n\log n)$ 下界约束。
> - 标准实现从右向左回填，因而是稳定排序。
> - 适用前提是键可映射为范围较小的整数。

## 14. 参考资料

1. Cormen, Thomas H.; Leiserson, Charles E.; Rivest, Ronald L.; Stein, Clifford. *Introduction to Algorithms*, 3rd ed., Chapter 8.2: Counting Sort. MIT Press, 2009.
2. Demaine, Erik D.; Leiserson, Charles E. *Introduction to Algorithms, Lecture 5: Sorting Lower Bounds and Linear-Time Sorting*. MIT, 2005.
3. [kepano/obsidian-skills：Obsidian Flavored Markdown Skill](https://github.com/kepano/obsidian-skills/blob/main/skills/obsidian-markdown/SKILL.md)
