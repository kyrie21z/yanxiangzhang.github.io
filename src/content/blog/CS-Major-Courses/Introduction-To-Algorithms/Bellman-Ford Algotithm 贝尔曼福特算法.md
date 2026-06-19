---
title: "Bellman-Ford 最短路径算法"
description: "Bellman Ford 最短路径算法 Bellman Ford 算法用于求解 加权有向图中的单源最短路径 。它允许图中存在负权边，并且能够检测从源点可达的负权环。若不存在从源点可达的负权环，算法最多经过 $ V 1$ 轮全边松弛后得到正确结果。 目录 1. 问题定义 2. 基本思想 3. 需要问题具有的性质 4..."
pubDate: "2026-06-16"
---

# Bellman-Ford 最短路径算法

> [!abstract] 核心结论
> Bellman-Ford 算法用于求解**加权有向图中的单源最短路径**。它允许图中存在负权边，并且能够检测从源点可达的负权环。若不存在从源点可达的负权环，算法最多经过 $|V|-1$ 轮全边松弛后得到正确结果。

## 目录

- [1. 问题定义](#1-问题定义)
- [2. 基本思想](#2-基本思想)
- [3. 需要问题具有的性质](#3-需要问题具有的性质)
- [4. 核心操作：松弛](#4-核心操作松弛)
- [5. 具体过程](#5-具体过程)
- [6. 伪代码](#6-伪代码)
- [V](#7-为什么需要-)
- [8. 正确性要点](#8-正确性要点)
- [9. 时空间复杂度](#9-时空间复杂度)
- [10. 典型例子](#10-典型例子)
- [11. 路径恢复](#11-路径恢复)
- [12. 常见错误](#12-常见错误)
- [13. 与其他最短路径算法的比较](#13-与其他最短路径算法的比较)

---

## 1. 问题定义

给定一个带权有向图：

$$
G=(V,E)
$$

其中：

- $V$ 是顶点集合；

- $E$ 是有向边集合；

- $w(u,v)$ 是边 $(u,v)$ 的权重；

- $s \in V$ 是指定源点。

Bellman-Ford 算法需要完成以下任务：

1. 若不存在从源点 $s$ 可达的负权环，求出 s 到每个顶点 $v$ 的最短路径距离：

$$
\delta(s,v)=\min_{p:s\rightsquigarrow v}w(p)
$$

2. 若存在从源点 $s$ 可达的负权环，报告最短路径不存在。

路径 p 的权重等于路径上所有边权之和：

$$
w(p)=\sum_{(u,v)\in p}w(u,v)
$$

> [!info] 单源与所有点对
> Bellman-Ford 本身解决的是**单源最短路径**问题。若对每个顶点都运行一次 Bellman-Ford，可以得到所有点对最短路径，时间复杂度为 $O(V^2E)$。

---

## 2. 基本思想

Bellman-Ford 的核心思想是：

> 重复遍历图中的所有边，并不断执行松弛操作，使距离估计逐步接近真实最短距离。

算法维护：

- `dist[v]`：源点到顶点 $v$ 的当前最短距离估计；

- `parent[v]`：当前最短路径中顶点 $v$ 的前驱。

初始化时：

$$
\text{dist}[s]=0
$$

$$
\forall v\ne s,\quad \text{dist}[v]=\infty
$$

随后进行最多 $|V|-1$ 轮操作。每一轮遍历所有边 $(u,v)$，检查经过 $u$ 到达 $v$ 是否可以得到更短路径。

> [!tip] 直观理解
> 第 1 轮至少可以传播只含 1 条边的最短路径；第 2 轮至少可以传播只含 2 条边的最短路径；依此类推。没有负权环时，一条最短简单路径最多包含 $|V|-1$ 条边，因此最多需要 $|V|-1$ 轮。

### 2.1 与 Dijkstra 的差异

- Dijkstra 每次贪心地永久确定一个当前距离最小的顶点；

- Bellman-Ford 不会提前永久确定顶点，而是反复允许所有边改进距离；

- 因而 Bellman-Ford 能处理负权边，但时间复杂度更高。

---

## 3. 需要问题具有的性质

### 3.1 允许负权边

Bellman-Ford 允许：

$$
w(u,v)<0
$$

例如，边权可以为：

$$
5,\quad 0,\quad -3
$$

因此，它比要求边权非负的 Dijkstra 算法 更一般。

### 3.2 不允许存在从源点可达的负权环

如果存在一个从源点可达的环 $C$，并且：

$$
w(C)<0
$$

那么每多绕该环一次，路径权重都会继续减小：

$$
w(p),\quad w(p)+w(C),\quad w(p)+2w(C),\dots
$$

由于 $w(C)<0$，路径权重可以无限减小，所以相关顶点不存在有限的最短路径。

> [!warning] “负权边”和“负权环”不同
>
> - 负权边本身不会导致最短路径不存在；
>
> - 从源点可达的负权环才会导致路径权重可以无限下降；
>
> - 标准单源 Bellman-Ford 只检测**从源点可达**的负权环。

### 3.3 图可以不连通

若顶点 $v$ 无法从源点 $s$ 到达，则算法结束后：

$$
\text{dist}[v]=\infty
$$

不可达部分中的负权环不会被标准单源 Bellman-Ford 检测到，因为这些顶点的距离始终为 $\infty$。

### 3.4 最短路径具有最优子结构

若：

$$
p=s\rightsquigarrow u\rightsquigarrow v
$$

是从 $s$ 到 $v$ 的最短路径，那么其中从 $s$ 到 $u$ 的子路径也必须是最短路径。

否则，可以用更短的 $s \rightsquigarrow u$ 路径替换原子路径，从而得到一条更短的 $s \rightsquigarrow v$ 路径，与原路径最短矛盾。

### 3.5 无向负权边的特殊问题

在无向图中，一条负权边 $(u,v)$ 通常等价于两条有向边：

$$
(u,v,w),\quad(v,u,w)
$$

若 $w<0$，则存在长度为 2 的负权环：

$$
u\to v\to u
$$

其权重为：

$$
2w<0
$$

因此，含负权边的无向图通常不存在有限最短路径。

---

## 4. 核心操作：松弛

对于有向边 $(u,v)$，若已经知道从源点到 $u$ 的一条路径，则可以尝试通过该边到达 $v$。

候选距离为：

$$
\text{dist}[u]+w(u,v)
$$

若候选距离更小，则更新：

$$
\text{dist}[v] =\min\left(\text{dist}[v],\ \text{dist}[u]+w(u,v)\right)
$$

对应操作为：

```text
if dist[u] != infinity and dist[u] + weight < dist[v]:
    dist[v] = dist[u] + weight
    parent[v] = u
```

其中判断：

```text
if dist[u] != infinity
```

用于避免从一个尚不可达的顶点出发进行无意义计算。

> [!note] 松弛的含义
> 每次松弛只检查一条边是否能够改进当前答案。Bellman-Ford 通过重复扫描全部边，使较短路径的信息不断沿着路径传播。

---

## 5. 具体过程

设图有 $n=|V|$ 个顶点，程序内部使用 **0-based 下标**：

$$
V=\{0,1,\dots,n-1\}
$$

### 5.1 初始化

建立长度为 $n$ 的数组：

```text
dist   <- [infinity, infinity, ..., infinity]
parent <- [-1, -1, ..., -1]
```

设置源点：

```text
dist[source] <- 0
```

### 5.2 执行 $n-1$ 轮全边松弛

每一轮遍历边集合中的每条有向边：

```text
for each edge (u, v, weight):
    relax(u, v, weight)
```

最多执行：

$$
n-1
$$

轮。

### 5.3 提前终止优化

若某一整轮中没有任何 `dist` 值发生变化，则说明距离已经收敛：

```text
if changed = false:
    break
```

此时没有必要继续执行剩余轮次。

> [!info] 轮数与边的扫描顺序
> 标准实现会在一轮中原地更新 `dist`，因此一次扫描可能传播多条边的信息。实际收敛轮数会受到边顺序影响，但无论边顺序如何，$|V|-1$ 轮都是正确性上界。

### 5.4 检测负权环

完成最多 $n-1$ 轮后，再扫描一次所有边。

若仍存在：

$$
\text{dist}[u]+w(u,v)<\text{dist}[v]
$$

则说明某个距离仍可继续减小，因此存在从源点可达的负权环。

### 5.5 返回结果

- 不存在可达负权环：返回 `dist` 和 `parent`；

- 存在可达负权环：报告最短路径不存在。

---

## 6. 伪代码

### 6.1 单源 Bellman-Ford

```text
BELLMAN_FORD(edges, n, source):
    dist   <- array of size n, initialized to infinity
    parent <- array of size n, initialized to -1

    dist[source] <- 0

    for pass <- 0 to n - 2:
        changed <- false

        for each (u, v, weight) in edges:
            if dist[u] != infinity and
               dist[u] + weight < dist[v]:

                dist[v]   <- dist[u] + weight
                parent[v] <- u
                changed   <- true

        if changed = false:
            break

    for each (u, v, weight) in edges:
        if dist[u] != infinity and
           dist[u] + weight < dist[v]:
            return false, dist, parent

    return true, dist, parent
```

返回值含义：

- `true`：不存在从源点可达的负权环；

- `false`：存在从源点可达的负权环。

### 6.2 松弛子过程

```text
RELAX(u, v, weight, dist, parent):
    if dist[u] != infinity and
       dist[u] + weight < dist[v]:

        dist[v]   <- dist[u] + weight
        parent[v] <- u
        return true

    return false
```

### 6.3 所有点对最短路径

```text
ALL_PAIRS_BELLMAN_FORD(edges, n):
    result <- n x n matrix

    for source <- 0 to n - 1:
        valid, dist, parent <- BELLMAN_FORD(edges, n, source)

        if valid = false:
            return "negative-weight cycle exists"

        result[source] <- dist

    return result
```

> [!warning] 不推荐直接用于大型所有点对问题
> 重复运行 Bellman-Ford 的时间复杂度为 $O(V^2E)$。对于稀疏图且存在负权边，通常优先考虑 Johnson 算法；对于顶点较少或稠密图，可以考虑 Floyd-Warshall 算法。

---

## 7. 为什么需要 $|V|-1$ 轮

假设图中不存在从源点可达的负权环。

任意有限最短路径都可以选择为简单路径，即路径中不重复经过顶点。若一条路径重复经过某个顶点，就包含一个环：

- 若该环权重为正，删除它可以得到更短路径；

- 若该环权重为零，删除它不会改变路径权重；

- 若该环权重为负，则与“不存在可达负权环”矛盾。

因此，最短路径最多经过所有顶点各一次。

一个包含 $|V|$ 个顶点的简单路径最多有：

$$
|V|-1
$$

条边。

设最短路径为：

$$
s=v_0\to v_1\to v_2\to\cdots\to v_k=v
$$

其中：

$$
k\le |V|-1
$$

每完成一轮全边松弛，至少可以保证最短路径信息沿路径再向前传播一条边。因此，在最多 $|V|-1$ 轮之后，所有有限最短路径都能够传播完成。

> [!important] 准确表述
> 原地更新的实现可能在同一轮中连续传播多条边，所以可能提前收敛。$|V|-1$ 不是每个实例必须执行的轮数，而是与边顺序无关的最坏情况上界。

---

## 8. 正确性要点

### 8.1 距离估计始终对应某条真实路径

初始化时：

- `dist[source] = 0` 对应空路径；

- 其他顶点距离为 $\infty$。

每次更新：

$$
\text{dist}[v]\leftarrow \text{dist}[u]+w(u,v)
$$

都是在一条到达 $u$ 的真实路径后追加边 $(u,v)$。

因此，任何有限的 `dist[v]` 都对应一条真实路径，不会凭空产生比最短路径更小的值：

$$
\text{dist}[v]\ge \delta(s,v)
$$

### 8.2 最短路径会逐边传播

对于最短路径：

$$
s=v_0\to v_1\to\cdots\to v_k=v
$$

若 `dist[v_{i-1}]` 已经等于真实最短距离，则松弛边 ($v_{i-1},v_i)$ 后：

$$
\text{dist}[v_i] \le \text{dist}[v_{i-1}]+w(v_{i-1},v_i) = \delta(s,v_i)
$$

结合距离估计不会低于真实最短距离，可得：

$$
\text{dist}[v_i]=\delta(s,v_i)
$$

由于最短简单路径最多包含 $|V|-1$ 条边，因此主循环结束后：

$$
\forall v\in V,\quad \text{dist}[v]=\delta(s,v)
$$

### 8.3 负权环检测为什么有效

若在 $|V|-1$ 轮后仍有边可以被松弛，说明存在一条超过 $|V|-1$ 条边、且权重仍能继续下降的可达路径。

任何含至少 $|V|$ 条边的路径都会重复经过某个顶点，因此包含环。若移除该环不能阻止距离下降，则其中必然包含负权环。

---

## 9. 时空间复杂度

设：

- $V=|V|$：顶点数；

- $E=|E|$：有向边数。

### 9.1 时间复杂度

主循环最多执行：

$$
V-1
$$

轮，每轮遍历全部 $E$ 条边：

$$
O((V-1)E)=O(VE)
$$

负权环检测再扫描一次全部边：

$$
O(E)
$$

因此总时间复杂度为：

$$
\boxed{O(VE)}
$$

若加入提前终止，并在第 $k$ 轮后收敛，则实际时间为：

$$
O(kE),\quad 1\le k\le V-1
$$

但最坏情况仍为：

$$
O(VE)
$$

### 9.2 空间复杂度

不计输入图本身，算法需要：

- `dist` 数组：$O(V)$；

- `parent` 数组：$O(V)$；

- 常数个辅助变量：$O(1)$。

因此额外空间复杂度为：

$$
\boxed{O(V)}
$$

若将边表存储空间计入，则总空间复杂度为：

$$
\boxed{O(V+E)}
$$

### 9.3 所有点对版本

对每个顶点运行一次 Bellman-Ford：

$$
\boxed{O(V^2E)}
$$

若保存完整距离矩阵，还需要：

$$
\boxed{O(V^2)}
$$

结果空间。

---

## 10. 典型例子

### 10.1 图与边表

考虑以下有向图，源点为顶点 `0`：

边表按以下顺序存储：

|编号|边|权重|
|---|---|---|
|1|$0\to1$|6|
|2|$0\to2$|7|
|3|$1\to2$|8|
|4|$1\to3$|5|
|5|$1\to4$|-4|
|6|$2\to3$|-3|
|7|$2\to4$|9|
|8|$3\to1$|-2|
|9|$4\to0$|2|
|10|$4\to3$|7|

该图含负权边，但不存在从源点可达的负权环，因此 Bellman-Ford 可以求得有限最短路径。

### 10.2 初始化

$$
\text{dist}=[0,\infty,\infty,\infty,\infty]
$$

$$
\text{parent}=[-1,-1,-1,-1,-1]
$$

### 10.3 逐轮结果

以下结果假设每一轮严格按照上表顺序扫描边，并采用原地更新。

|阶段|`dist[0..4]`|说明|
|---|---|---|
|初始化|[0,$\infty$,$\infty$,$\infty$,$\infty$]|只有源点距离为 0|
|第 1 轮|[0,2,7,4,2]|多条边在同一轮内连续传播|
|第 2 轮|[0,2,7,4,-2]|顶点 4 被进一步更新|
|第 3 轮|[0,2,7,4,-2]|无更新，提前终止|

最终距离为：

$$
\boxed{[0,2,7,4,-2]}
$$

前驱数组为：

$$
\text{parent}=[-1,3,0,2,1]
$$

### 10.4 最短路径

#### 从 0 到 1

由前驱关系：

$$
1\leftarrow3\leftarrow2\leftarrow0
$$

反转后：

$$
0\to2\to3\to1
$$

距离：

$$
7+(-3)+(-2)=2
$$

#### 从 0 到 2

$$
0\to2
$$

距离：

$$
7
$$

#### 从 0 到 3

$$
0\to2\to3
$$

距离：

$$
7+(-3)=4
$$

#### 从 0 到 4

$$
0\to2\to3\to1\to4
$$

距离：

$$
7+(-3)+(-2)+(-4)=-2
$$

> [!success] 结果核验
> 直接边 $0\to1$ 的权重是 6，但经过 $0\to2\to3\to1$ 的权重是 2。该例说明负权边可能使后续发现的路径优于较早发现的路径，因此不能直接使用普通 Dijkstra。

### 10.5 负权环检测示例

若额外加入边：

$$
4\to2,\quad w(4,2)=-10
$$

则形成环：

$$
2\to3\to1\to4\to2
$$

环权重为：

$$
-3+(-2)+(-4)+(-10)=-19<0
$$

在执行完 $|V|-1$ 轮后，仍会有边可以继续松弛，因此算法会报告可达负权环。

---

## 11. 路径恢复

Bellman-Ford 在每次成功松弛时记录前驱：

```text
parent[v] <- u
```

若要恢复从 `source` 到 `target` 的路径，可以从目标顶点沿 `parent` 反向回溯。

```text
RECONSTRUCT_PATH(parent, source, target):
    path <- empty list
    current <- target

    while current != -1:
        APPEND(path, current)

        if current = source:
            REVERSE(path)
            return path

        current <- parent[current]

    return empty list
```

若最终没有回到源点，说明目标顶点不可达。

> [!warning] 负权环下不能直接恢复普通最短路径
> 若目标顶点受到可达负权环影响，则不存在有限最短路径，`parent` 链可能形成循环。应先完成负权环检测，再决定是否恢复路径。

---

## 12. 常见错误

### 12.1 只松弛一次所有边

错误做法：

```text
for each edge:
    relax(edge)
```

一次扫描不能保证信息传播到较长路径的末端。

正确做法：最多执行 $|V|-1$ 轮全边松弛。

### 12.2 忘记检测负权环

仅执行 $|V|-1$ 轮并返回距离，无法区分：

- 正常收敛；

- 距离仍可因负权环无限下降。

必须额外扫描一次全部边。

### 12.3 把任意负权环都视为错误

单源 Bellman-Ford 只关心从源点可达的负权环。

检测时必须保留：

```text
if dist[u] != infinity
```

否则，某些语言中可能错误地从“无穷大”进行运算，或错误报告不可达区域中的负权环。

### 12.4 无向边只存一个方向

若输入是无向图，每条边 $(u,v,w)$ 必须展开为：

```text
(u, v, w)
(v, u, w)
```

但需要注意：无向负权边会直接形成负权环。

### 12.5 误以为每轮只允许传播一条边

原地更新实现中，同一轮后面的边可以立即使用前面边刚更新的结果，因此一轮可能传播多条边。

正确表述是：

> 第 i 轮结束后，算法至少已经正确处理所有使用不超过 i 条边的最短路径。

### 12.6 混淆顶点编号与数组下标

若题目顶点编号为 $1 \sim n$，但程序使用 0-based 下标，则需要统一转换：

$$
\text{index}=\text{vertex label}-1
$$

### 12.7 把 Bellman-Ford 当作无条件最优选择

若所有边权非负，通常应使用 Dijkstra 最短路径算法，因为其运行时间通常明显低于 $O(VE)$。

---

## 13. 与其他最短路径算法的比较

|算法|问题类型|负权边|负权环检测|典型时间复杂度|
|---|---|---|---|---|
|BFS|单源、无权图或等权图|不适用|否|$O(V+E)$|
|Dijkstra|单源、非负权图|否|否|$O((V+E)\log V)$|
|Bellman-Ford|单源、一般加权图|是|是|$O(VE)$|
|DAG 最短路径|单源、有向无环图|是|不需要|$O(V+E)$|
|Floyd-Warshall|所有点对|是|可辅助判断|$O(V^3)$|
|Johnson|稀疏图所有点对|是|是|典型为 $O(VE+V^2\log V)$|

> [!summary] 选择原则
>
> - 无权图：BFS；
>
> - 非负权单源最短路径：Dijkstra；
>
> - 含负权边的单源最短路径：Bellman-Ford；
>
> - DAG：拓扑排序后的线性时间松弛；
>
> - 所有点对且图较小或较稠密：Floyd-Warshall；
>
> - 所有点对、图较稀疏且允许负权边：Johnson。

---

## 参考资料

1. Cormen, Thomas H., Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein. _Introduction to Algorithms_, 3rd ed. MIT Press, 2009. Chapter 24: Single-Source Shortest Paths.

2. Demaine, Erik D., and Charles E. Leiserson. _Introduction to Algorithms, Lecture 16: Shortest Paths II_. MIT, 2005.

3. MIT Lecture 16: Shortest Paths II

4. 《算法导论》第 3 版
