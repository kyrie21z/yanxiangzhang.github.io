---
title: "Merge Sort 归并排序"
description: "Merge Sort 归并排序 归并排序（Merge Sort） 是一种典型的分治算法：将序列递归地划分为两个子序列，分别排序后，再在线性时间内合并。 最好、平均、最坏时间复杂度均为 $\\Theta(n\\log n)$ 标准数组实现的辅助空间复杂度为 $\\Theta(n)$ 可以实现为 稳定排序 标准数组实现通常..."
pubDate: "2026-06-17"
---

# Merge Sort 归并排序

> [!abstract] 核心结论
> **归并排序（Merge Sort）**是一种典型的分治算法：将序列递归地划分为两个子序列，分别排序后，再在线性时间内合并。
>
> - 最好、平均、最坏时间复杂度均为 $\Theta(n\log n)$
> - 标准数组实现的辅助空间复杂度为 $\Theta(n)$
> - 可以实现为**稳定排序**
> - 标准数组实现通常不是原地排序

## 1. 问题定义

给定包含 $n$ 个元素的序列：

$$
A=[a_0,a_1,\ldots,a_{n-1}]
$$

将其重新排列为：

$$
A'=[a'_0,a'_1,\ldots,a'_{n-1}]
$$

使得：

$$
a'_0\leq a'_1\leq\cdots\leq a'_{n-1}
$$

归并排序属于比较排序，排序依据仅来自元素之间的比较结果。

## 2. 基本思想

归并排序采用分治策略，将一个规模较大的排序问题分解为规模更小、结构相同的子问题。

### 2.1 分治三步

1. **分解（Divide）**
   - 将当前区间从中点划分为左右两个子区间。

2. **解决（Conquer）**
   - 递归地对左右子区间进行归并排序。
   - 当区间中至多包含一个元素时，该区间天然有序。

3. **合并（Combine）**
   - 将两个已经有序的子区间合并为一个完整的有序区间。
   - 合并两个总长度为 $n$ 的有序序列需要 $\Theta(n)$ 时间。

> [!important] 关键前提
> `MERGE` 操作接收的两个子序列必须已经分别有序。  
> 归并排序的递归过程保证了这一前提。

### 2.2 递归关系

忽略向上取整和向下取整后，归并排序的运行时间满足：

$$
T(n)=2T\left(\frac{n}{2}\right)+\Theta(n)
$$

其中：

- $2T(n/2)$：递归排序两个规模约为 $n/2$ 的子序列；
- $\Theta(n)$：合并两个有序子序列。

由主定理可得：

$$
T(n)=\Theta(n\log n)
$$

## 3. 具体过程

本文统一使用 **0-based 下标**和**左闭右开区间**：

$$
A[\text{left}:\text{right})
$$

区间包含 `left`，但不包含 `right`，其长度为：

$$
\text{right}-\text{left}
$$

对区间 `A[left:right)` 执行归并排序：

1. 若 `right - left <= 1`，直接返回；
2. 计算中点：

   $$
   \text{mid}
   =
   \text{left}
   +
   \left\lfloor
   \frac{\text{right}-\text{left}}{2}
   \right\rfloor
   $$

3. 递归排序左半部分 `A[left:mid)`；
4. 递归排序右半部分 `A[mid:right)`；
5. 合并两个有序区间：
   - `A[left:mid)`
   - `A[mid:right)`

### 3.1 合并两个有序区间

设两个有序序列分别为：

$$
L=[l_0,l_1,\ldots,l_{p-1}]
$$

$$
R=[r_0,r_1,\ldots,r_{q-1}]
$$

使用两个指针 `i` 和 `j`：

- `i` 指向 `L` 中尚未合并的第一个元素；
- `j` 指向 `R` 中尚未合并的第一个元素。

每次比较 `L[i]` 与 `R[j]`：

- 若 `L[i] <= R[j]`，将 `L[i]` 放入结果；
- 否则，将 `R[j]` 放入结果；
- 当其中一个序列耗尽后，将另一个序列的剩余元素依次追加到结果末尾。

> [!tip] 如何保证稳定性
> 当两个元素的关键字相等时，优先取左侧子序列中的元素，即使用：
>
> ```text
> if L[i] <= R[j]
> ```
>
> 而不是只在 `L[i] < R[j]` 时取左侧元素。这样可以保留相等元素原有的相对次序。

## 4. 伪代码

### 4.1 归并排序

```text
MERGE-SORT(A, left, right)
    // 排序区间 A[left:right)
    if right - left <= 1
        return

    mid <- left + floor((right - left) / 2)

    MERGE-SORT(A, left, mid)
    MERGE-SORT(A, mid, right)
    MERGE(A, left, mid, right)
```

初始调用：

```text
MERGE-SORT(A, 0, length(A))
```

### 4.2 合并操作

```text
MERGE(A, left, mid, right)
    // A[left:mid) 和 A[mid:right) 已经分别有序

    temp <- empty array
    i <- left
    j <- mid

    while i < mid and j < right
        if A[i] <= A[j]
            APPEND(temp, A[i])
            i <- i + 1
        else
            APPEND(temp, A[j])
            j <- j + 1

    while i < mid
        APPEND(temp, A[i])
        i <- i + 1

    while j < right
        APPEND(temp, A[j])
        j <- j + 1

    for k <- 0 to length(temp) - 1
        A[left + k] <- temp[k]
```

## 5. 正确性说明

归并排序的正确性可以分为 `MERGE` 的正确性和递归算法的正确性。

### 5.1 `MERGE` 的循环不变式

在主循环每次迭代开始时，`temp` 满足：

1. `temp` 已按非递减顺序排列；
2. `temp` 包含左右子序列中已经处理的全部元素；
3. `temp` 中的元素是两个子序列全部元素中最小的若干个元素；
4. 指针 `i` 和 `j` 分别指向左右子序列尚未处理的最小元素。

由于每次都从 `A[i]` 和 `A[j]` 中选取较小者，因此不变式在每次迭代后仍然成立。

当某个子序列耗尽时，另一个子序列的剩余部分本身已有序，并且其元素均不小于 `temp` 中最后一个元素，因此直接追加仍可得到有序结果。

### 5.2 递归正确性

对区间长度 $n$ 使用数学归纳法。

**基础情况：**

当 $n\leq 1$ 时，区间为空或仅含一个元素，天然有序。

**归纳假设：**

假设归并排序能够正确排序所有长度小于 $n$ 的区间。

**归纳步骤：**

对于长度为 $n$ 的区间：

1. 左右子区间长度均小于 $n$；
2. 根据归纳假设，递归调用后两个子区间分别有序；
3. 根据 `MERGE` 的正确性，两个有序子区间能够被正确合并为一个有序区间。

因此，归并排序能够正确排序任意有限长度的输入序列。

## 6. 时空间复杂度

### 6.1 时间复杂度

| 情况 | 时间复杂度 | 原因 |
|---|---:|---|
| 最好情况 | $\Theta(n\log n)$ | 即使输入已经有序，标准实现仍会完成全部划分与合并 |
| 平均情况 | $\Theta(n\log n)$ | 递归树约有 $\log n$ 层，每层处理 $\Theta(n)$ 个元素 |
| 最坏情况 | $\Theta(n\log n)$ | 划分始终平衡，合并始终为线性时间 |

递归树中：

- 树高为 $\Theta(\log n)$；
- 每一层合并的元素总数为 $n$，工作量为 $\Theta(n)$。

因此：

$$
T(n)
=
\underbrace{\Theta(n)+\Theta(n)+\cdots+\Theta(n)}
_{\Theta(\log n)\text{ 层}}
=
\Theta(n\log n)
$$

> [!note] 渐近最优性
> 在一般比较模型下，任意比较排序的最坏时间复杂度下界为 $\Omega(n\log n)$。  
> 因此，归并排序在渐近意义上是最优的比较排序算法之一。

### 6.2 空间复杂度

标准数组实现需要临时数组保存合并结果：

| 空间来源 | 复杂度 |
|---|---:|
| 合并辅助数组 | $\Theta(n)$ |
| 递归调用栈 | $\Theta(\log n)$ |
| 总辅助空间 | $\Theta(n)$ |

由于 $\Theta(n)$ 支配 $\Theta(\log n)$，总辅助空间复杂度为：

$$
\Theta(n)
$$

> [!info] 链表版本
> 对链表执行归并排序时，可以通过修改节点指针完成合并，不需要长度为 $n$ 的辅助数组。此时额外节点空间可降为 $\Theta(1)$，但递归实现仍需要 $\Theta(\log n)$ 的调用栈。

## 7. 算法性质

| 性质 | 标准数组归并排序 |
|---|---|
| 排序方式 | 比较排序 |
| 设计范式 | 分治 |
| 稳定性 | 稳定，前提是相等时优先取左侧元素 |
| 原地性 | 通常不是原地排序 |
| 是否自适应 | 标准实现不是 |
| 最坏时间保证 | $\Theta(n\log n)$ |
| 是否适合链表 | 适合 |
| 是否适合外部排序 | 适合 |
| 是否易于并行化 | 较适合 |

## 8. 需要问题具有的性质

归并排序不仅能用于数字数组。只要问题满足以下条件，就可以使用归并排序思想。

### 8.1 元素之间可以进行一致的比较

必须存在比较规则，用于判断任意两个元素的先后关系。

比较器通常应满足：

1. **自反性**

   $$
   x\leq x
   $$

2. **反对称性**

   若 $x\leq y$ 且 $y\leq x$，则二者在排序关键字上等价。

3. **传递性**

   $$
   x\leq y
   \land
   y\leq z
   \Rightarrow
   x\leq z
   $$

4. **完全性**

   对任意 $x,y$，至少可以确定 $x\leq y$ 或 $y\leq x$。

若比较器不满足传递性，排序结果可能不具有一致意义。

### 8.2 问题可以分解为同类子问题

原问题应能够划分为两个或多个规模更小、结构相同的子问题。

对于排序问题：

- 原问题：排序一个序列；
- 子问题：排序该序列的两个子序列。

### 8.3 子问题的解可以有效合并

仅能划分问题还不够。必须存在高效的合并过程，将子问题的解组合为原问题的解。

归并排序高效的核心在于：

> 两个已经有序的序列可以在线性时间内合并。

### 8.4 能够接受相应的存储或访问方式

标准数组归并排序需要 $\Theta(n)$ 辅助空间。若内存限制严格，应考虑：

- [堆排序](/blog/cs-major-courses/introduction-to-algorithms/heap-sort-堆排序/)；
- 原地归并算法；
- 链表归并排序；
- 分块或外部归并排序。

## 9. 典型例子

对数组执行升序排序：

```text
A = [8, 2, 4, 9, 3, 6]
```

### 9.1 分解阶段

```text
[8, 2, 4, 9, 3, 6]
├── [8, 2, 4]
│   ├── [8]
│   └── [2, 4]
│       ├── [2]
│       └── [4]
└── [9, 3, 6]
    ├── [9]
    └── [3, 6]
        ├── [3]
        └── [6]
```

### 9.2 合并阶段

```text
[2] + [4]       -> [2, 4]
[8] + [2, 4]    -> [2, 4, 8]

[3] + [6]       -> [3, 6]
[9] + [3, 6]    -> [3, 6, 9]

[2, 4, 8] + [3, 6, 9]
                 -> [2, 3, 4, 6, 8, 9]
```

最终结果：

```text
[2, 3, 4, 6, 8, 9]
```

### 9.3 最后一次合并的指针过程

| 步骤 | 左侧候选 | 右侧候选 | 取出元素 | 临时结果 |
|---:|---:|---:|---:|---|
| 1 | 2 | 3 | 2 | `[2]` |
| 2 | 4 | 3 | 3 | `[2, 3]` |
| 3 | 4 | 6 | 4 | `[2, 3, 4]` |
| 4 | 8 | 6 | 6 | `[2, 3, 4, 6]` |
| 5 | 8 | 9 | 8 | `[2, 3, 4, 6, 8]` |
| 6 | — | 9 | 9 | `[2, 3, 4, 6, 8, 9]` |

## 10. Python 实现

```python
def merge_sort(arr: list[int]) -> None:
    """使用稳定归并排序更新 arr，内部使用 O(n) 辅助数组。"""
    temp = arr.copy()

    def merge(left: int, mid: int, right: int) -> None:
        i = left
        j = mid
        k = left

        while i < mid and j < right:
            # 相等时优先选择左侧元素，从而保持稳定性。
            if arr[i] <= arr[j]:
                temp[k] = arr[i]
                i += 1
            else:
                temp[k] = arr[j]
                j += 1
            k += 1

        while i < mid:
            temp[k] = arr[i]
            i += 1
            k += 1

        while j < right:
            temp[k] = arr[j]
            j += 1
            k += 1

        for index in range(left, right):
            arr[index] = temp[index]

    def sort(left: int, right: int) -> None:
        if right - left <= 1:
            return

        mid = left + (right - left) // 2
        sort(left, mid)
        sort(mid, right)
        merge(left, mid, right)

    sort(0, len(arr))


if __name__ == "__main__":
    data = [8, 2, 4, 9, 3, 6]
    merge_sort(data)
    print(data)

    assert data == [2, 3, 4, 6, 8, 9]
```

预期输出：

```text
[2, 3, 4, 6, 8, 9]
```

## 11. 常见错误

> [!warning] 边界定义混用
> 不要在同一实现中混用闭区间 `[left, right]` 与左闭右开区间 `[left, right)`。  
> 本文始终使用 `[left, right)`，基础情况为：
>
> ```text
> right - left <= 1
> ```

> [!warning] 忘记复制剩余元素
> 主比较循环结束只说明某一侧已经耗尽，另一侧可能仍有未处理元素，必须继续追加。

> [!warning] 破坏稳定性
> 当关键字相等时先取右侧元素，会改变相等元素原有的相对次序。

> [!warning] 在每一层频繁创建切片
> 某些语言中的数组切片会复制数据。若递归时不断创建左右切片，可能增加常数开销和内存分配。使用索引区间和复用辅助数组通常更高效。

## 12. 适用场景

归并排序常用于：

- 需要稳定排序的记录；
- 对链表进行排序；
- 数据量过大、无法一次全部载入内存的外部排序；
- 合并多个已经有序的数据流或文件；
- 并行排序；
- 统计数组中的逆序对；
- 作为 TimSort 等混合排序算法的组成部分。

## 13. 与其他排序算法比较

| 算法 | 最好时间 | 平均时间 | 最坏时间 | 辅助空间 | 稳定 | 原地 |
|---|---:|---:|---:|---:|---|---|
| 归并排序 | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n)$ | 是 | 通常否 |
| [插入排序](/blog/cs-major-courses/introduction-to-algorithms/insertion-sort-插入排序/) | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | 是 | 是 |
| [快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/) | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n^2)$ | 平均 $\Theta(\log n)$ | 通常否 | 通常是 |
| [堆排序](/blog/cs-major-courses/introduction-to-algorithms/heap-sort-堆排序/) | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(1)$ | 否 | 是 |

> [!question] 归并排序与快速排序的核心区别
> - 归并排序：**分解简单，合并复杂**；
> - 快速排序：**分解复杂，合并简单**。
>
> 归并排序提供稳定的最坏时间保证，但通常需要额外数组；快速排序通常具有更好的缓存局部性和更小的常数开销，但最坏情况可能退化为 $\Theta(n^2)$。

## 14. 总结

归并排序的核心结构是：

```text
划分 -> 递归排序左半部分 -> 递归排序右半部分 -> 线性合并
```

其关键结论为：

$$
T(n)
=
2T\left(\frac{n}{2}\right)
+
\Theta(n)
=
\Theta(n\log n)
$$

需要特别记住：

1. `MERGE` 的输入必须是两个有序序列；
2. 标准数组实现需要 $\Theta(n)$ 辅助空间；
3. 相等时优先取左侧元素可以保证稳定性；
4. 归并排序的最好、平均和最坏时间复杂度均为 $\Theta(n\log n)$；
5. 它非常适合链表、外部排序和需要最坏时间保证的场景。

## 15. 参考资料

1. Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein. *Introduction to Algorithms*, 3rd Edition. MIT Press, 2009. Section 2.3.
2. Erik D. Demaine, Charles E. Leiserson. *Introduction to Algorithms — Lecture 1: Analysis of Algorithms*. MIT.
3. Erik D. Demaine, Charles E. Leiserson. *Introduction to Algorithms — Lecture 3: Divide and Conquer*. MIT.

## 16. 相关笔记

- [Sorting Algorithms 排序算法](/blog/cs-major-courses/introduction-to-algorithms/sorting-algorithms-排序算法/)
- [Insertion Sort 插入排序](/blog/cs-major-courses/introduction-to-algorithms/insertion-sort-插入排序/)
- [Quick Sort 快速排序](/blog/cs-major-courses/introduction-to-algorithms/quick-sort-快速排序/)
- [Heap Sort 堆排序](/blog/cs-major-courses/introduction-to-algorithms/heap-sort-堆排序/)
