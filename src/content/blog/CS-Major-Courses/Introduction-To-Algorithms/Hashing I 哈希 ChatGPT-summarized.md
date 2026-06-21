---
title: "Hashing I 哈希 ChatGPT-summarized"
description: "Lecture 7 — Hashing（考前速记版） 一、易错点修正（重点） 1. 区分 $O(1)$ 与 $\\Theta(1)$ Direct access table 的操作时间是： $$ \\Theta(1) $$ 强调的是 严格常数时间 ，而不是宽松的 $O(1)$。 2. $T[k]$ 存的是 recor..."
pubDate: "2026-06-20"
---

# Lecture 7 — Hashing（考前速记版）

## 一、易错点修正（重点）

### 1. 区分 $O(1)$ 与 $\Theta(1)$

Direct-access table 的操作时间是：

$$  
\Theta(1)  
$$

强调的是**严格常数时间**，而不是宽松的 $O(1)$。

---

### 2. $T[k]$ 存的是 record，不是 key

定义：

$$  
T[k] =  
\begin{cases}  
x & \text{if } key[x] = k \\  
\text{NIL} & \text{otherwise}  
\end{cases}  
$$

三者关系：

- $x$：完整记录（record）
- $key[x]$：用于查找的键
- $T[k]$：数组中第 $k$ 个槽位，存的是记录 $x$

> [!tip] 核心记忆
> key 决定位置，位置里存 record

---

### 3. chaining 中 $\alpha = O(1)$ ⇒ 查找 $\Theta(1)$

负载因子：

$$  
\alpha = \frac{n}{m}  
$$

不成功查找期望时间：

$$  
\Theta(1 + \alpha)  
$$

若 $\alpha = O(1)$，则：

$$  
\Theta(1)  
$$

---

### 4. 有冲突 ≠ $n > m$

反例：

- $m = 10$
- 插入 2 个 key，但哈希到同一槽

有 collision，但：

$$  
n < m  
$$

正确结论：

- chaining：允许 $n > m$
- open addressing：必须 $n \le m$

---

### 5. open addressing 删除困难（核心考点）

原因：

- 查找沿 probe sequence 进行
- 遇到 **EMPTY 就停止**

如果删除时直接设为 EMPTY：

> [!warning] 后果
> 会截断 probe sequence，导致后面的元素"不可达"。

解决方法：

- 使用 **tombstone（DELETED 标记）**

---

### 6. primary clustering 的本质

linear probing：

$$  
h(k,i) = (h'(k) + i) \bmod m  
$$

问题：

- 连续 occupied 区间（cluster）会不断变长
- 新元素更容易插入该区间后面

> [!tip] 本质
> 坏区间自增强

---

### 7. 所有复杂度结论都依赖假设

- chaining：simple uniform hashing
- open addressing：uniform hashing

> [!warning] 注意
> 都是**分析假设，不是保证成立**。

---

## 二、核心内容速记

### 1. 问题背景：Symbol Table

支持操作：

$$  
\text{INSERT},\ \text{DELETE},\ \text{SEARCH}  
$$

目标：高效按 key 查找

---

### 2. Direct-access table

前提：

$$  
key \in \{0,1,\dots,m-1\}  
$$

定义：

$$  
T[k] = x \text{ if } key[x] = k  
$$

优点：$\Theta(1)$

缺点：空间 $O(m)$ 可能极大（如 64-bit key）

---

### 3. Hashing 思想

定义：

$$  
h: U \rightarrow \{0,1,\dots,m-1\}  
$$

作用：将大 key 空间压缩到小表

代价：**collision 不可避免**

---

### 4. Chaining

方法：每个槽位挂链表

负载因子：

$$  
\alpha = \frac{n}{m}  
$$

复杂度：

$$  
\text{unsuccessful search} = \Theta(1 + \alpha)  
$$

---

### 5. Hash function 选择原则

要求：

- 均匀分布
- 不受 key 规律性影响

---

#### Division method

$$  
h(k) = k \bmod m  
$$

注意：$m$ 不要选成小因子多或接近 $2^r$

---

#### Multiplication method

$$  
h(k) = (A \cdot k \bmod 2^w) \gg (w - r)  
$$

特点：适合计算机实现（快）

---

### 6. Open Addressing

特点：

- 所有元素存表内
- 不用链表

探测序列：$h(k,i)$

要求：覆盖整个表（permutation）

问题：表可能填满；删除困难

---

### 7. Probing 方法

#### Linear Probing

$$  
h(k,i) = (h'(k) + i) \bmod m  
$$

缺点：primary clustering

---

#### Double Hashing

$$  
h(k,i) = (h_1(k) + i \cdot h_2(k)) \bmod m  
$$

要求：

$$  
\gcd(h_2(k), m) = 1  
$$

> [!tip] 关键点
> 否则不能遍历全表。

---

### 8. Open Addressing 分析（不成功查找的期望探测次数）

**问题**：在 open addressing 的表中，查一个**不存在的 key**，平均要探测几个槽？

**推导过程**：

- 第 1 次探测：一定会做 → 贡献 $1$
- 需要第 2 次探测：说明第 1 个槽被占了，概率 $\approx \frac{n}{m} = \alpha$
- 需要第 3 次探测：前两个槽都被占了，概率 $\approx \frac{n-1}{m-1} \le \alpha$
- 依此类推，每次"继续探测"的概率都被 $\alpha$ 上界约束

因此期望探测次数：

$$  
\mathbb{E}[\text{probes}] \le 1 + \alpha + \alpha^2 + \alpha^3 + \cdots  
$$

用几何级数求和（前提 $\alpha < 1$）：

$$  
1 + \alpha + \alpha^2 + \cdots = \frac{1}{1 - \alpha}  
$$

所以：

$$  
\mathbb{E}[\text{probes}] \le \frac{1}{1 - \alpha}  
$$

**直观理解**：

| $\alpha$ | 期望探测次数 | 含义 |
|---|---|---|
| 0.5 | $\le 2$ 次 | 表半满，很快 |
| 0.9 | $\le 10$ 次 | 表快满了，明显变慢 |
| 0.99 | $\le 100$ 次 | 几乎填满，性能急剧恶化 |

> [!tip] 核心结论
> 负载因子 $\alpha$ 越接近 1，查找越慢。实践中 open addressing 通常控制 $\alpha \le 0.5 \sim 0.7$。

---

## 三、最终记忆版（8句）

1. Direct-access：$T[\text{key}] = \text{record}$
2. hashing：压缩 key 空间
3. collision：不可避免
4. chaining：$\Theta(1+\alpha)$
5. 好 hash：均匀 + 抗规律
6. linear probing：cluster 会变长
7. double hashing：需要互素
8. open addressing 删除必须用 tombstone

---

> [!note] 相关笔记
> - [Hashing I 哈希](/blog/cs-major-courses/introduction-to-algorithms/hashing-i-哈希/) — 原始课堂笔记
> - [第十一章 散列表](/blog/cs-major-courses/introduction-to-algorithms/introduction-to-algorithms-算法导论/#第十一章-散列表)
