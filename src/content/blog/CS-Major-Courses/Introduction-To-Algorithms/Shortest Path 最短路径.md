---
title: "Shortest Path 最短路径"
description: "单源最短路 1. Dijkstra's Algorithm 迪杰斯特拉算法 2. Bellman Ford Algotithm 贝尔曼福特算法可以检测负环的存在, 解决了迪杰斯特拉在有负环情况失效的问题. p.s. 注意时间复杂度差异 3. 差分约束 所有点对最短路 1. 多次执行[单源最短路] 2. Floyd..."
pubDate: "2026-06-21"
---
# 单源最短路
1. [Dijkstra's Algorithm 迪杰斯特拉算法](/blog/cs-major-courses/introduction-to-algorithms/dijkstras-algorithm-迪杰斯特拉算法/)
2. [Bellman-Ford Algotithm 贝尔曼福特算法](/blog/cs-major-courses/introduction-to-algorithms/bellman-ford-algotithm-贝尔曼福特算法/)可以检测负环的存在, 解决了迪杰斯特拉在有负环情况失效的问题.
p.s. 注意时间复杂度差异

3. 差分约束
# 所有点对最短路
1. 多次执行[单源最短路]
2. [Floyd-Warshall Algorithm 弗洛伊德华沙算法](/blog/cs-major-courses/introduction-to-algorithms/floyd-warshall-algorithm-弗洛伊德华沙算法/) good
3. [Johnson's Algorithm](/blog/cs-major-courses/introduction-to-algorithms/johnsons-algorithm/) reweight的时候需要用到差分约束来确定h(x), 适合稀疏且有负权重