---
title: "What is Algorithm"
description: "算法（Algorithm）的定义： 算法是一个 良定义的计算过程 ：它接收某个值或一组值作为 输入 ，经过一系列明确的 计算步骤 ，产生某个值或一组值作为 输出 。换句话说，算法就是把输入转换为输出的一组有限、明确的操作步骤。 PPT 中的原文表述为： algorithm is “any well defined..."
pubDate: "2026-06-19"
---
**算法（Algorithm）的定义：**

算法是一个==**良定义的计算过程**==：它接收某个值或一组值作为==**输入**==，经过一系列明确的==**计算步骤**==，产生某个值或一组值作为==**输出**==。换句话说，算法就是把输入转换为输出的一组有限、明确的操作步骤。
PPT 中的原文表述为：
algorithm is “any well-defined computational procedure” that takes input and produces output，并且是 “a sequence of computational steps that transform the input into the output”。

可以压缩成一句话：

> **算法 = 输入 $\rightarrow$ 明确的计算步骤 $\rightarrow$ 输出**

更形式化地说：

$$  
\text{Algorithm}: I \longrightarrow O  
$$

其中：

- $I$ 表示输入集合；
    
- $O$ 表示输出集合；
    
- 算法规定了如何从输入 $I$ 中的一个实例，经过有限步骤，得到对应输出。
    

以排序问题为例，PPT 给出的形式是：输入为数字序列 $\langle a_1,a_2,\dots,a_n\rangle$，输出为一个重排后的序列 $\langle a'_1,a'_2,\dots,a'_n\rangle$，满足 $a'_1 \le a'_2 \le \cdots \le a'_n$。这说明算法通常是为了解决一个明确的问题：给定输入，按照规定步骤得到满足要求的输出。

需要注意：

**算法不是程序本身。**  
程序是算法在某种编程语言中的具体实现；算法更抽象，关注的是解决问题的步骤、正确性和资源消耗。

**算法也不是数据结构。**  
数据结构是组织和存储数据的方式；算法是在这些数据上执行操作、解决问题的方法。PPT 也把 data structure、analysis、design 分开说明：数据结构用于组织数据，算法分析关注资源使用，算法设计关注策略。

所以，最适合记忆的定义是：

> **算法是一个良定义的、有限的计算步骤序列，它以输入为起点，以输出为结果，用来解决某个明确的计算问题。**