---
title: 'DateTimeEdit 组件实现 教学总结'
description: '很好。现在进入 DateTime 日期与时间组件：阶段 2（教学总结）。 先给结论： 这一项真正要掌握的，不是“按钮一按能显示当前时间”，而是 Qt 中日期、时间、日期时间这三类对象的区别与转换关系： [ QDate,\ QTime,\ QDateTime ] 以及两条最核心的数据流： [ \text{系统当前时...'
pubDate: '2026-04-09'
protected: true
passwordHash: 'a5f6ee79cd69074506575fa931b1f391dfc68c915562d6fb391ff5ff65b6d79e'
passwordHint: '请输入课程内容访问密码'
---
很好。现在进入 **DateTime 日期与时间组件：阶段 2（教学总结）**。

先给结论：  
这一项真正要掌握的，不是“按钮一按能显示当前时间”，而是 **Qt 中日期、时间、日期时间这三类对象的区别与转换关系**：

$$
QDate,\ QTime,\ QDateTime  
$$

以及两条最核心的数据流：

$$
\text{系统当前时间} \rightarrow \text{日期/时间控件}  
$$

$$
\text{字符串} \leftrightarrow \text{QDateTime}  
$$

这次模块已经把这两条链都覆盖到了，所以它是一个非常标准的“**日期时间基础能力模块**”。

---

# 一、这个模块到底在学什么

这次可以拆成 4 层。

## 1. 对象层

Qt 里日期时间不是一个单一概念，而是拆成三类：

- `QDate`：只表示日期
    
- `QTime`：只表示时间
    
- `QDateTime`：同时表示日期和时间
    

这次你在一个模块里把三者都用到了。

---

## 2. 控件层

对应地，Qt 也有三种编辑控件：

- `QDateEdit`
    
- `QTimeEdit`
    
- `QDateTimeEdit`
    

所以你现在要开始建立一个“**对象类型 ↔ 控件类型**”的对应关系。

---

## 3. 格式层

日期时间数据在程序里和界面里经常有两种存在方式：

- 作为对象：`QDateTime`
    
- 作为字符串：`"2026-04-07 20:30:15"`
    

而两者之间的转换依赖格式串：

$$
\text{"yyyy-MM-dd hh:mm:ss"}  
$$

---

## 4. 数据流层

这次你已经做了两种方向的流动：

### 方向 1：系统时间 → 控件

```cpp
QDateTime::currentDateTime()
```

### 方向 2：字符串 → 日期时间对象 → 控件

```cpp
QDateTime::fromString(...)
```

这说明你已经不只是在“显示值”，而是在做“对象转换 + 控件同步”。

---

# 二、每个模块 / 函数的详细教学

下面按你要求，把这次新出现的模块、函数逐个详细讲清楚。

---

## A. `QDateTime` 详细教学

## A.1 它是什么

`QDateTime` 是 Qt 的**日期时间类**，用于同时表示：

- 日期
    
- 时间
    

也就是：

$$
QDateTime = QDate + QTime  
$$

它非常适合表示：

- 当前系统时间
    
- 文件创建时间
    
- 日志时间戳
    
- 用户输入的完整日期时间
    

---

## A.2 这次为什么它是核心

因为这次模块的主轴其实就是围绕 `QDateTime` 展开的。

你写的是：

```cpp
QDateTime curDateTime = QDateTime::currentDateTime();
```

然后又把它拆成：

- `curDateTime.date()`
    
- `curDateTime.time()`
    

再分别给不同控件。

也就是说，它充当了这次模块的“总源头”。

---

## A.3 最核心接口 1：`currentDateTime()`

```cpp
QDateTime curDateTime = QDateTime::currentDateTime();
```

作用：

> 获取当前系统日期时间

这一步很重要，因为它让你的程序可以和真实系统时钟同步。

---

## A.4 最核心接口 2：`date()` 和 `time()`

```cpp
curDateTime.date()
curDateTime.time()
```

含义：

- 从完整的日期时间对象中取出日期部分
    
- 从完整的日期时间对象中取出时间部分
    

所以：

$$
QDateTime \rightarrow QDate  
$$  
$$
QDateTime \rightarrow QTime  
$$

---

## A.5 最核心接口 3：`toString()`

```cpp
curDateTime.toString("yyyy-MM-dd hh:mm:ss")
```

作用：

> 把 `QDateTime` 转成指定格式的字符串

这是 GUI 编程里非常高频的需求，因为：

- 控件显示常常需要字符串
    
- 日志输出也常常需要字符串
    
- 保存配置、导出文本也会用到字符串
    

---

## A.6 最核心接口 4：`fromString()`

```cpp
QDateTime datetime = QDateTime::fromString(str, "yyyy-MM-dd hh:mm:ss");
```

作用：

> 把一个符合指定格式的字符串解析成 `QDateTime`

这一步和 `toString()` 刚好是反向关系：

$$
QDateTime \xrightarrow{toString} QString  
$$

$$
QString \xrightarrow{fromString} QDateTime  
$$

---

## A.7 这次你应该形成的认识

以后只要遇到：

- 当前时间
    
- 完整时间戳
    
- 时间字符串解析
    
- 日期时间持久化
    

你都要优先想到 `QDateTime`。

---

## B. `QDate` 详细教学

## B.1 它是什么

`QDate` 是 Qt 的**日期类**，只表示日期，不包含具体时分秒。

例如：

$$
2026-04-07  
$$

它适合表示：

- 生日
    
- 截止日期
    
- 日历选择
    
- 课程日期
    
- 某一天
    

---

## B.2 这次怎么来的

你没有手动构造 `QDate`，而是通过：

```cpp
curDateTime.date()
```

得到的。

这说明 `QDate` 常常并不是独立产生的，而是从完整 `QDateTime` 中拆出来。

---

## B.3 为什么它和 `QTime` 要分开

因为很多业务并不需要完整日期时间。

例如：

- 生日：只关心日期
    
- 每天上课时间：可能只关心时间
    
- 日历组件：通常只关心日期
    

所以 Qt 把它们拆成独立类，是很合理的。

---

## C. `QTime` 详细教学

## C.1 它是什么

`QTime` 是 Qt 的**时间类**，只表示时分秒，不包含日期。

例如：

$$
20:30:15  
$$

它适合表示：

- 闹钟时间
    
- 上课开始时间
    
- 每日固定时间点
    
- 某一时刻的钟表时间
    

---

## C.2 这次怎么来的

同样是从：

```cpp
curDateTime.time()
```

拆出来的。

所以这次你也学到了：

$$
QDateTime \rightarrow QTime  
$$

---

# 三、日期时间控件的详细教学

这次你第一次同时用了三种时间类控件。

---

## A. `QTimeEdit`

## A.1 它是什么

`QTimeEdit` 是 Qt 的**时间编辑控件**，用来显示和编辑 `QTime`。

你这次写的是：

```cpp
ui->timeEdit->setTime(curDateTime.time());
```

作用：

> 把当前系统时间填进时间控件

---

## A.2 什么时候适合用它

适合：

- 选择上课时间
    
- 设置闹钟
    
- 选择出发时间
    
- 设置每日固定执行时刻
    

也就是：  
**只关心时间，不关心日期**。

---

## B. `QDateEdit`

## B.1 它是什么

`QDateEdit` 是 Qt 的**日期编辑控件**，用来显示和编辑 `QDate`。

你这次写的是：

```cpp
ui->dateEdit->setDate(curDateTime.date());
```

作用：

> 把当前系统日期填进日期控件

---

## B.2 什么时候适合用它

适合：

- 选择生日
    
- 选择截止日期
    
- 选择考试日期
    
- 选择某一天
    

也就是：  
**只关心日期，不关心时间**。

---

## C. `QDateTimeEdit`

## C.1 它是什么

`QDateTimeEdit` 是 Qt 的**日期时间编辑控件**，可以同时显示和编辑完整的 `QDateTime`。

你这次用了两个：

- `dateTimeEdit`
    
- `dateTimeEdit_string_to_datetime`
    

这其实很有价值，因为你分别用它们承载了两种来源：

1. 当前系统时间
    
2. 字符串解析后的时间
    

---

## C.2 最核心接口：`setDateTime()`

```cpp
ui->dateTimeEdit->setDateTime(curDateTime);
ui->dateTimeEdit_string_to_datetime->setDateTime(datetime);
```

作用：

> 把一个完整 `QDateTime` 对象写入日期时间控件

---

## C.3 为什么这次你会觉得它“最方便”

因为如果你已经有一个完整的 `QDateTime`，那最直接的就是：

```cpp
setDateTime(...)
```

不用再拆成日期和时间分别写。

---

# 四、字符串转换相关函数详细教学

这是这次最关键的新知识组。

---

## A. `toString()` 详细教学

你写的是：

```cpp
ui->lineEdit->setText(curDateTime.toString("yyyy-MM-dd hh:mm:ss"));
```

---

## A.1 它做了什么

它把一个日期时间对象变成字符串。

也就是：

$$
QDateTime \rightarrow QString  
$$

---

## A.2 为什么必须带格式串

因为日期时间字符串不是唯一写法。  
比如同一个时间可以写成：

- `2026-04-07 20:30:15`
    
- `2026/04/07 20:30:15`
    
- `07-04-2026 20:30:15`
    

所以 `toString()` 需要你指定格式，告诉 Qt 你想要什么样的输出。

---

## A.3 这次格式串的含义

```text
yyyy-MM-dd hh:mm:ss
```

逐段解释：

- `yyyy`：四位年份
    
- `MM`：两位月份
    
- `dd`：两位日期
    
- `hh`：两位小时
    
- `mm`：两位分钟
    
- `ss`：两位秒
    

注意这里：

- 月份是 `MM`
    
- 分钟是 `mm`
    

这是最常见也最容易混淆的点。

---

## B. `fromString()` 详细教学

你写的是：

```cpp
QDateTime datetime = QDateTime::fromString(str, "yyyy-MM-dd hh:mm:ss");
```

---

## B.1 它做了什么

它把字符串解析成 `QDateTime`：

$$
QString \rightarrow QDateTime  
$$

这是 `toString()` 的反向过程。

---

## B.2 为什么格式必须严格匹配

因为 `fromString()` 不是“猜测解析”，而是“按你给定模板精确匹配”。

所以如果你的字符串是：

```text
2026/04/07 20:30:15
```

但格式串写的是：

```text
yyyy-MM-dd hh:mm:ss
```

那么它会解析失败。

同理，如果你写成：

```text
2026-04-07 20:30
```

少了秒，也会失败。

---

## B.3 这次为什么你加了 `trimmed()`

你写的是：

```cpp
QString str = ui->lineEdit_2->text();
str = str.trimmed();
```

作用是：

> 去掉首尾空白，避免因为用户多打了空格导致格式匹配失败

这是很合理的预处理。

---

# 五、本模块新增模块的重点系统总结

下面把这次新出现的东西系统总结一遍。

---

## 1. `QDateTime`

### 定义

完整日期时间类

### 常用接口

- `currentDateTime()`
    
- `date()`
    
- `time()`
    
- `toString()`
    
- `fromString()`
    

### 本次作用

- 获取当前系统日期时间
    
- 作为字符串转换的核心对象
    

---

## 2. `QDate`

### 定义

仅表示日期的类

### 本次来源

`curDateTime.date()`

### 本次作用

给 `QDateEdit` 提供数据

---

## 3. `QTime`

### 定义

仅表示时间的类

### 本次来源

`curDateTime.time()`

### 本次作用

给 `QTimeEdit` 提供数据

---

## 4. `QTimeEdit`

### 定义

时间编辑控件

### 核心接口

- `setTime(QTime)`
    

### 本次作用

显示当前系统时间

---

## 5. `QDateEdit`

### 定义

日期编辑控件

### 核心接口

- `setDate(QDate)`
    

### 本次作用

显示当前系统日期

---

## 6. `QDateTimeEdit`

### 定义

日期时间编辑控件

### 核心接口

- `setDateTime(QDateTime)`
    

### 本次作用

- 显示当前系统日期时间
    
- 显示字符串解析后的日期时间
    

---

## 7. `toString()` / `fromString()`

### 定义

对象与字符串之间的双向转换接口

### 本次作用

- `toString()`：把当前时间显示到 `lineEdit`
    
- `fromString()`：把 `lineEdit_2` 中的文本转回日期时间对象
    

---

# 六、这个模块最重要的知识点

## 1. 日期、时间、日期时间是三种不同概念

这是这节最根本的知识点。

---

## 2. 控件类型和数据类型是一一对应的

- `QTimeEdit` ↔ `QTime`
    
- `QDateEdit` ↔ `QDate`
    
- `QDateTimeEdit` ↔ `QDateTime`
    

---

## 3. `QDateTime` 是总入口

它既能表示完整时间，又能拆出日期和时间，还能和字符串互转。

---

## 4. 字符串解析依赖格式串严格匹配

不是“看起来像时间”就一定能解析成功。

---

# 七、这个模块最容易踩的坑

## 易错点 1：月份 `MM` 和分钟 `mm` 混淆

这是最经典的错误。

- `MM`：month
    
- `mm`：minute
    

如果写反，字符串会乱。

---

## 易错点 2：格式串和输入字符串不匹配

例如：

- 用 `/` 写日期，但格式串写 `-`
    
- 少了秒
    
- 多了空格
    

都会导致 `fromString()` 失败。

---

## 易错点 3：误以为 `QDateTimeEdit` 会自动识别任意字符串

不会。  
字符串到日期时间对象必须先用 `fromString()` 转。

---

## 易错点 4：把 `QDateEdit` 当作能直接放完整时间

不能。  
它只接收日期部分。

---

# 八、你现在应该形成的理解

做完这个模块，你应该明确：

1. Qt 把日期、时间、日期时间严格区分开
    
2. `QDateTime` 是最核心的时间对象
    
3. `QDateTimeEdit` 是最完整的日期时间显示/编辑控件
    
4. 时间对象和字符串之间转换时，格式串是关键
    
5. 日期时间类在 GUI、日志、配置、数据展示里都非常常用
    

---

# 九、这一模块最值得记住的最小模板

你最值得记住的是这两段：

```cpp
QDateTime curDateTime = QDateTime::currentDateTime();

ui->timeEdit->setTime(curDateTime.time());
ui->dateEdit->setDate(curDateTime.date());
ui->dateTimeEdit->setDateTime(curDateTime);

ui->lineEdit->setText(curDateTime.toString("yyyy-MM-dd hh:mm:ss"));
```

它代表：

$$
\text{系统当前时间} \rightarrow \text{多个日期时间控件} \rightarrow \text{字符串显示}  
$$

以及：

```cpp
QString str = ui->lineEdit_2->text().trimmed();
QDateTime datetime = QDateTime::fromString(str, "yyyy-MM-dd hh:mm:ss");
ui->dateTimeEdit_string_to_datetime->setDateTime(datetime);
```

它代表：

$$
\text{字符串} \rightarrow \text{QDateTime} \rightarrow \text{日期时间控件}  
$$

---

下一步按新流程，应该进入 **PlainTextEdit 阶段 1：实现 + 运行验证**。