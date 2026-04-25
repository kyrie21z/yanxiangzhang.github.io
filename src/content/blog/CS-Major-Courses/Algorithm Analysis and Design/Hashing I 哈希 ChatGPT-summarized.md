---
title: 'Hashing I 哈希 ChatGPT-summarized'
description: '下面是完全兼容 Obsidian 的 Markdown + LaTeX 版本（已清理所有非标准标记，可直接粘贴）： 2. (T[k]) 存的是 record，不是 key 定义： $$ T[k] = \begin{cases} x & \text{if } key[x] = k \ \text{NIL} & \t...'
pubDate: '2026-04-09'
protected: true
passwordHash: 'a5f6ee79cd69074506575fa931b1f391dfc68c915562d6fb391ff5ff65b6d79e'
passwordHint: '请输入课程内容访问密码'
---
下面是**完全兼容 Obsidian 的 Markdown + LaTeX 版本**（已清理所有非标准标记，可直接粘贴）：

---

# Lecture 7 — Hashing（考前速记版）

## 一、易错点修正（重点）

### 1. 区分 (O(1)) 与 $\Theta(1$)

Direct-access table 的操作时间是：

$$  
\Theta(1)  
$$

强调的是**严格常数时间**，而不是宽松的 (O(1))。

---

### 2. (T[k]) 存的是 record，不是 key

定义：

$$  
T[k] =  
\begin{cases}  
x & \text{if } key[x] = k \  
\text{NIL} & \text{otherwise}  
\end{cases}  
$$

三者关系：

- (x)：完整记录（record）
    
- (key[x])：用于查找的键
    
- (T[k])：数组中第 (k) 个槽位，存的是记录 (x)
    

👉 **key 决定位置，位置里存 record**

---

### 3. chaining 中 $\alpha = O(1$) ⇒ 查找 $\Theta(1$)

负载因子：

$$  
\alpha = \frac{n}{m}  
$$

不成功查找期望时间：

$$  
\Theta(1 + \alpha)  
$$

若 $\alpha = O(1$)，则：

$$  
\Theta(1)  
$$

---

### 4. 有冲突 ≠ (n > m)

反例：

- (m = 10)
    
- 插入 2 个 key，但哈希到同一槽
    

👉 有 collision，但：

$$  
n < m  
$$

正确结论：

- chaining：允许 (n > m)
    
- open addressing：必须 (n \le m)
    

---

### 5. open addressing 删除困难（核心考点）

原因：

- 查找沿 probe sequence 进行
    
- 遇到 **EMPTY 就停止**
    

如果删除时直接设为 EMPTY：

👉 会截断 probe sequence  
👉 导致后面的元素“不可达”

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
    

👉 **坏区间自增强**

---

### 7. 所有复杂度结论都依赖假设

- chaining：simple uniform hashing
    
- open addressing：uniform hashing
    

👉 都是**分析假设，不是保证成立**

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
key \in {0,1,\dots,m-1}  
$$

定义：

$$  
T[k] = x \text{ if } key[x] = k  
$$

优点：

$$  
\Theta(1)  
$$

缺点：

- 空间 (O(m)) 可能极大（如 64-bit key）
    

---

### 3. Hashing 思想

定义：

$$  
h: U \rightarrow {0,1,\dots,m-1}  
$$

作用：

- 将大 key 空间压缩到小表
    

代价：

- **collision 不可避免**
    

---

### 4. Chaining

方法：

- 每个槽位挂链表
    

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

注意：

- (m) 不要选成小因子多或接近 (2^r)
    

---

#### Multiplication method

$$  
h(k) = (A \cdot k \bmod 2^w) \gg (w - r)  
$$

特点：

- 适合计算机实现（快）
    

---

### 6. Open Addressing

特点：

- 所有元素存表内
    
- 不用链表
    

探测序列：

$$  
h(k,i)  
$$

要求：

- 覆盖整个表（permutation）
    

问题：

- 表可能填满
    
- 删除困难
    

---

### 7. Probing 方法

#### Linear Probing

$$  
h(k,i) = (h'(k) + i) \bmod m  
$$

缺点：

- primary clustering
    

---

#### Double Hashing

$$  
h(k,i) = (h_1(k) + i \cdot h_2(k)) \bmod m  
$$

要求：

$$  
\gcd(h_2(k), m) = 1  
$$

👉 否则不能遍历全表

---

### 8. Open Addressing 分析

在 $\alpha < 1$ 时：

$$  
\mathbb{E}[\text{probes}] \le \frac{1}{1 - \alpha}  
$$

推导核心：

- 第一次一定 probe
    
- 后续概率逐步下降：
    

$$  
\frac{n}{m},\ \frac{n-1}{m-1},\ \dots  
$$

用几何级数上界：

$$  
1 + \alpha + \alpha^2 + \cdots = \frac{1}{1-\alpha}  
$$

---

## 三、最终记忆版（8句）

1. Direct-access：  
    $$  
    T[\text{key}] = \text{record}  
    $$
    
2. hashing：压缩 key 空间
    
3. collision：不可避免
    
4. chaining：  
    $$  
    \Theta(1+\alpha)  
    $$
    
5. 好 hash：均匀 + 抗规律
    
6. linear probing：cluster 会变长
    
7. double hashing：需要互素
    
8. open addressing 删除必须用 tombstone
    

---

如果你后面还要做考试准备，我可以帮你再出一套：

- **“Lecture 7 高频考点题 + 标准答案”**
    
- 或 **“一页推导模板（专门背证明）”**
    

这样你基本可以稳过 hashing 相关考题。