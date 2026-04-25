---
title: 'Dial + LCDNumber 组件实现 教学总结'
description: '很好。现在进入 LCD Number：阶段 2（教学总结）。 先给结论： 这个模块表面上是在学 ，但本质上是在学 “同一个数值的多种表示方式” 与 “输入控件驱动显示控件”。 和前面的模块相比： - ：重点是数值输入与计算联动 - ：重点是参数驱动外观变化 - ：重点是数值表示形式切换 文档中这一节明确给出了： ...'
pubDate: '2026-04-09'
protected: true
passwordHash: 'a5f6ee79cd69074506575fa931b1f391dfc68c915562d6fb391ff5ff65b6d79e'
passwordHint: '请输入课程内容访问密码'
---
很好。现在进入 **LCD Number：阶段 2（教学总结）**。

先给结论：  
这个模块表面上是在学 `QLCDNumber`，但本质上是在学 **“同一个数值的多种表示方式”** 与 **“输入控件驱动显示控件”**。  
和前面的模块相比：

- `SpinBox`：重点是数值输入与计算联动
    
- `HorizontalSlider`：重点是参数驱动外观变化
    
- `LCD Number`：重点是**数值表示形式切换**
    

文档中这一节明确给出了：

- `QDial` 改变数值；
    
- `QLCDNumber` 显示数值；
    
- 4 个单选按钮切换十进制 / 二进制 / 八进制 / 十六进制；
    
- 同时根据进制调整显示位数。
    

---

# 一、这个模块到底在学什么

这个模块可以拆成 4 层。

## 1. 输入层：`QDial`

用户通过旋钮改变一个整数值。

也就是：

$$
\text{QDial} \rightarrow int\ value  
$$

---

## 2. 显示层：`QLCDNumber`

这个值不直接显示成普通文本，而是显示成“液晶数字风格”。

也就是：

$$
int \rightarrow QLCDNumber  
$$

---

## 3. 表示层：进制切换

同一个值，可以按不同进制表示：

- 十进制
    
- 二进制
    
- 八进制
    
- 十六进制
    

这一步实际上是在教你：

$$
\text{值本身不变}，\text{显示形式可变}  
$$

---

## 4. 适配层：位数调整

不同进制下，同一个值需要的显示位数不同，所以你还要同步改：

```cpp
setDigitCount(...)
```

这说明 GUI 编程中经常要同时考虑：

- 数据本身
    
- 显示格式
    
- 显示容量
    

---

# 二、每个模块 / 函数的详细教学

下面按你要求，把这次新出现的东西逐个详细讲清楚。

---

## A. `QLCDNumber` 详细教学

## A.1 它是什么

`QLCDNumber` 是 Qt 提供的**液晶数字显示控件**。

它模拟的是那种电子设备上的数码管/液晶数字显示效果。  
常见用途：

- 计数器
    
- 仪表盘数值显示
    
- 计时器
    
- 电子钟
    
- 参数监视器
    

它和 `QLabel` 的区别在于：

- `QLabel`：普通文本显示
    
- `QLCDNumber`：数码显示风格，更适合“仪表/面板”场景
    

---

## A.2 这次为什么用它

因为这节课不是单纯让你“显示一个数字”，而是要让你直观看到：

- 同一个数值在不同进制下长什么样
    
- 数码显示控件的风格化特点
    

所以 `QLCDNumber` 比 `QLabel` 更适合。

---

## A.3 最核心接口 1：`display()`

你这次最常用的是：

```cpp
ui->LCDDisplay->display(value);
```

`display()` 的作用是：

> 把一个值显示到 LCD 控件上

它可以接收：

- `int`
    
- `double`
    
- `QString`
    

你这次主要用的是整数值。

---

## A.4 最核心接口 2：`setDigitCount()`

你这次写了：

```cpp
ui->LCDDisplay->setDigitCount(8);
```

这个函数表示：

> 设置 LCD 一共能显示多少位

例如：

- 十进制时显示 255，只需要 3 位
    
- 二进制时显示 255，需要 8 位（11111111）
    
- 八进制时 255 是 377，只需要 3 位，但文档用了更宽松的 5 位
    
- 十六进制时 255 是 FF，只需要 2 位，文档用了 3 位以便更稳妥
    

所以这里不是“数字大小变了”，而是：

$$
\text{显示窗口大小} \text{要适配显示格式}  
$$

文档确实在不同模式下调用了不同的 `setDigitCount(...)`。

---

## A.5 最核心接口 3：进制模式切换

你这次用了：

```cpp
ui->LCDDisplay->setDecMode();
ui->LCDDisplay->setBinMode();
ui->LCDDisplay->setOctMode();
ui->LCDDisplay->setHexMode();
```

它们分别表示：

- 十进制模式
    
- 二进制模式
    
- 八进制模式
    
- 十六进制模式
    

这组函数是 `QLCDNumber` 这节里最重要的特色接口。

---

## A.6 为什么切换进制时要重新 `display()`

你在每个单选按钮槽里都写了：

```cpp
ui->LCDDisplay->display(ui->dial->value());
```

这是必要的。

因为切换进制模式后，LCD 需要重新按新格式显示当前值。  
如果只切模式、不重新显示，用户看到的刷新时机可能不直观。

---

## A.7 你现在要形成的认识

以后只要出现这种需求：

- “把数值做面板式显示”
    
- “想让数值看起来像仪表/设备屏幕”
    
- “需要切换不同显示风格”
    

你都要想到 `QLCDNumber`。

---

## B. `QDial` 详细教学

## B.1 它是什么

`QDial` 是 Qt 的**旋钮控件**。  
看起来像一个圆形调节盘。

它适合表示：

- 音量旋钮
    
- 亮度旋钮
    
- 仪表调节器
    
- 模拟控制盘
    

---

## B.2 这次为什么用 `QDial`

因为它比 `QSpinBox` 和 `QSlider` 更有“面板感”，跟 `QLCDNumber` 搭配非常自然：

- 左边一个旋钮调值
    
- 右边一个 LCD 显示值
    

这就是典型的“仪表盘式 UI”。

文档原例也是用 `dial` 驱动 `LCDDisplay`。

---

## B.3 最核心接口

### 1. `value()`

读取当前旋钮值：

```cpp
ui->dial->value()
```

### 2. `setValue(int)`

设置旋钮当前位置：

```cpp
ui->dial->setValue(100);
```

### 3. `valueChanged(int)`

当旋钮值变化时自动发信号：

```cpp
void MainWindow::on_dial_valueChanged(int value)
```

这和 `QSpinBox`、`QSlider` 的“值变化信号”在模式上是一致的。

---

## B.4 它和 `QSlider` 的区别

### `QSlider`

- 线性拖动
    
- 参数变化直观
    
- 适合颜色/音量/比例
    

### `QDial`

- 圆形旋钮
    
- 更像硬件仪表控件
    
- 更适合“面板式界面”
    

这不是功能谁强谁弱的问题，而是**交互风格**不同。

---

## C. `on_dial_valueChanged(int value)` 详细教学

这个槽函数是本模块最核心的实时联动入口。

你写的是：

```cpp
void MainWindow::on_dial_valueChanged(int value)
{
    ui->LCDDisplay->display(value);
}
```

---

## C.1 它做了什么

含义非常直接：

- `dial` 一变
    
- LCD 立刻显示这个新值
    

也就是：

$$
QDial \rightarrow QLCDNumber  
$$

这是最简洁的一对一联动。

---

## C.2 为什么这里直接用参数 `value`

和上个模块不同，这次槽函数传进来的 `value` 就已经是你真正要显示的值。  
因此不需要再去：

```cpp
ui->dial->value()
```

虽然你也可以这样写，但这里直接用参数更清楚。

---

## C.3 它体现了什么设计思想

这说明：

> 当信号参数本身就是你需要的数据时，直接使用该参数是最自然的。

这和 HorizontalSlider 那种“必须重读全部状态”的情况不同。  
所以你要开始学会区分：

- **只依赖当前触发值** → 用参数
    
- **依赖多个控件整体状态** → 重新读取所有控件值
    

---

## D. `QRadioButton` 在这一模块里的作用

虽然 `QRadioButton` 不是第一次出现，但这次它承担了更明确的“模式切换”职责。

## D.1 它这次不是“选择题”，而是“显示模式开关”

4 个单选按钮并不是代表 4 个独立操作，而是表示：

$$
当前 LCD 使用哪一种进制显示模式  
$$

所以本质上，这是一个**互斥状态选择器**。

---

## D.2 为什么适合用 `QRadioButton`

因为进制模式在同一时刻只能有一种：

- 要么十进制
    
- 要么二进制
    
- 要么八进制
    
- 要么十六进制
    

这正好符合 `QRadioButton` 的单选语义。

---

## E. `on_radioBtnDec_clicked()` 等 4 个槽函数详细教学

这 4 个函数结构几乎一样，只是模式不同。

例如十进制：

```cpp
void MainWindow::on_radioBtnDec_clicked()
{
    ui->LCDDisplay->setDigitCount(3);
    ui->LCDDisplay->setDecMode();
    ui->LCDDisplay->display(ui->dial->value());
}
```

---

## E.1 这类函数的统一结构

每个函数都做 3 件事：

1. 设置显示位数
    
2. 设置显示模式
    
3. 用当前值重新刷新 LCD
    

也就是：

$$
\text{位数适配} \rightarrow \text{模式切换} \rightarrow \text{重新显示}  
$$

---

## E.2 为什么要先设置位数再切模式

虽然顺序上问题不大，但从逻辑上：

- 先决定“我要用什么格式显示”
    
- 再准备好足够的显示位数
    
- 最后把当前值刷出来
    

这是更自然的思路。

---

## E.3 为什么 4 个函数长得几乎一样

这是因为它们共享了同一个逻辑模板，只是参数不同。

这其实是在提示你：  
后面如果你想进一步优化代码，可以提取公共函数。

例如可以抽成：

```cpp
void MainWindow::updateLcdMode(...)
```

但就当前作业来说，不抽也完全可以，反而更直观。

---

# 三、为什么切换进制时必须调整位数

这是这一节最重要的概念之一。

假设当前值是：

$$
255  
$$

那么它在不同进制下的表示分别是：

- 十进制：`255`
    
- 二进制：`11111111`
    
- 八进制：`377`
    
- 十六进制：`FF`
    

你会发现：

- 值没变
    
- 表示长度变了
    

所以：

$$
\text{数据值} \neq \text{显示宽度}  
$$

这就是为什么不能固定只用 3 位。  
尤其二进制最容易不够。

文档中专门在不同按钮里调用了不同的 `setDigitCount(...)`，就是为了处理这个问题。

---

# 四、这个模块最重要的知识点

## 1. 同一个数值可以有多种表示形式

这是本模块的核心抽象：

$$
\text{value 不变，representation 可变}  
$$

也就是“数值”和“显示格式”是分离的。

---

## 2. `QLCDNumber` 既是显示控件，也是格式控件

它不仅能显示数字，还能控制：

- 位数
    
- 进制模式
    

所以它不是简单的“标签替代品”。

---

## 3. 输入控件和显示控件可以强绑定

这里 `QDial` 和 `QLCDNumber` 是一种非常典型的“面板式绑定”。

---

## 4. 模式切换通常需要同步刷新显示

切换进制不只是“改一个状态”，还要立刻让用户看到结果。  
所以每个单选按钮槽里都要重新 `display(...)`。

---

# 五、本模块新增模块的重点总结

这里按你要求，把“新出现的东西”再凝练成一份系统总结。

---

## 1. `QLCDNumber`

### 用途

显示数码风格数字

### 关键接口

- `display(...)`
    
- `setDigitCount(int)`
    
- `setDecMode()`
    
- `setBinMode()`
    
- `setOctMode()`
    
- `setHexMode()`
    

### 适合场景

- 仪表盘
    
- 计时器
    
- 数值面板
    
- 进制演示
    

---

## 2. `QDial`

### 用途

圆形旋钮输入控件

### 关键接口

- `value()`
    
- `setValue(int)`
    
- `valueChanged(int)`
    

### 适合场景

- 模拟硬件旋钮
    
- 面板式参数调节
    
- 仪表界面
    

---

## 3. “进制模式”

这不是一个单独类，但这是这节课真正新增的知识主题。

你应该记住：

- 十进制最直观
    
- 二进制位数通常最长
    
- 八进制和十六进制更紧凑
    
- 同一个数值在不同进制下只是“表示法不同”
    

---

# 六、这个模块最容易踩的坑

## 易错点 1：对象名和槽函数名不匹配

例如：

- 对象名必须是 `radioBtnBin`
    
- 对应槽函数必须是 `on_radioBtnBin_clicked()`
    

少一个字母都不行。

---

## 易错点 2：切换进制后没重新 `display()`

如果你只写：

```cpp
ui->LCDDisplay->setHexMode();
```

却不重新 `display(ui->dial->value())`，显示结果可能不会按你预期即时刷新。

---

## 易错点 3：位数设置不足

这在二进制最明显。  
如果位数不够，大值显示会不完整。

---

## 易错点 4：误以为 `display()` 只能显示十进制

不是。  
`display()` 显示成什么形式，取决于当前 `QLCDNumber` 的模式。

---

# 七、你现在应该形成的理解

做完这个模块，你应该明确：

1. `QDial` 是面板风格的数值输入控件
    
2. `QLCDNumber` 是数码显示控件
    
3. 同一个值可以按多种进制显示
    
4. 显示模式改变时，显示位数也往往需要跟着调整
    
5. 这类界面属于“仪表/设备风格”的典型 Qt 小案例
    

---

# 八、这一模块最值得记住的最小模板

你最值得记住的结构是这两段：

```cpp
void MainWindow::on_dial_valueChanged(int value)
{
    ui->LCDDisplay->display(value);
}
```

和：

```cpp
void MainWindow::on_radioBtnBin_clicked()
{
    ui->LCDDisplay->setDigitCount(8);
    ui->LCDDisplay->setBinMode();
    ui->LCDDisplay->display(ui->dial->value());
}
```

这两段分别代表：

$$
\text{输入变化} \rightarrow \text{显示更新}  
$$

以及

$$
\text{显示模式切换} \rightarrow \text{显示适配} \rightarrow \text{重新刷新}  
$$

---

下一步按新流程，应该进入 **CheckBox 阶段 1：实现 + 运行验证**。