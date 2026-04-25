---
title: 'LineEdit + Login 登录界面实现 教学总结'
description: '很好。既然 已经跑通，现在进入阶段 2：教学总结。 先给结论： 这个模块表面上是在学 ，但本质上已经进入了一个小型综合 GUI 模块： 你同时用到了 - ：输入用户名和密码 - ：文本读取、裁剪、比较 - ：把字符串转成字节流 - ：做 MD5 哈希 - ：做本地持久化配置 - ：做交互反馈 - 自定义函数 - ...'
pubDate: '2026-04-09'
protected: true
passwordHash: 'a5f6ee79cd69074506575fa931b1f391dfc68c915562d6fb391ff5ff65b6d79e'
passwordHint: '请输入课程内容访问密码'
---
很好。既然 `LineEditLogin` 已经跑通，现在进入**阶段 2：教学总结**。

先给结论：  
这个模块表面上是在学 `QLineEdit`，但本质上已经进入了一个**小型综合 GUI 模块**：  
你同时用到了

- `QLineEdit`：输入用户名和密码
    
- `QString`：文本读取、裁剪、比较
    
- `QByteArray`：把字符串转成字节流
    
- `QCryptographicHash`：做 MD5 哈希
    
- `QSettings`：做本地持久化配置
    
- `QMessageBox`：做交互反馈
    
- 自定义函数 `encrypt / ReadString / WriteString`
    
- 槽函数 `on_pushButton_clicked()`
    

也就是说，这一项不是“一个控件”的学习，而是“**一个控件驱动的小业务流程**”。文档里确实是把按钮组件与编辑框组件组合成一个简单登录验证界面，并明确出现了 `lineEdit_Username`、`lineEdit_Password`、`checkBox`、`encrypt()`、`ReadString()`、`WriteString()`、密码输入模式、记住用户名、错误次数限制等逻辑。

---

# 一、这个模块到底在学什么

你可以把 `LineEditLogin` 拆成 4 层：

## 第 1 层：输入层

用户在两个 `QLineEdit` 中输入：

- 用户名
    
- 密码
    

其中密码框通过 `setEchoMode(QLineEdit::Password)` 变成密码输入模式，不直接显示真实字符。这个行为在 Qt 登录对话框示例中也是标准写法。

---

## 第 2 层：处理层

点击登录按钮后：

1. 读取输入框内容
    
2. 去掉首尾空格
    
3. 对密码做加密
    
4. 拿结果去比较
    

也就是：

$$
\text{界面输入} \rightarrow \text{字符串处理} \rightarrow \text{哈希} \rightarrow \text{判定}  
$$

---

## 第 3 层：状态层

程序需要维护 3 个状态：

- `m_user`：正确用户名
    
- `m_pswd`：正确密码（注意应保存为加密后的值）
    
- `m_tryCount`：错误次数
    

这些状态决定登录是否成功、是否关闭窗口。

---

## 第 4 层：持久化层

程序关闭或重新打开后，希望还能记住一部分信息，所以用了 `QSettings`：

- 保存用户名
    
- 保存密码哈希值
    
- 保存“是否记住”的布尔值
    

这就是一个最小的“本地配置系统”。

---

# 二、每个函数的详细教学

下面我不只讲“它做了什么”，还讲“为什么必须这样写”。

---

## 1. `MainWindow::encrypt(const QString &str)`

这是这个模块里最重要的**工具函数**。

你的修正版逻辑应是：

```cpp
QString MainWindow::encrypt(const QString &str)
{
    QByteArray btArray = str.toUtf8();

    QCryptographicHash hash(QCryptographicHash::Md5);
    hash.addData(btArray);

    return hash.result().toHex();
}
```

---

### 1.1 这个函数的输入输出

输入：

$$
QString  
$$

输出：

$$
QString  
$$

但中间会经过：

$$
QString \rightarrow QByteArray \rightarrow hash \rightarrow QByteArray \rightarrow hex\ QString  
$$

也就是说，这个函数不是“直接加密字符串”，而是：

1. 先把 Qt 字符串转成字节流；
    
2. 再对字节流做哈希；
    
3. 最后把二进制哈希值转成十六进制字符串。
    

---

### 1.2 为什么不能直接 `append(str)`

你碰到的报错本质上就是这里：

```cpp
QByteArray btArray;
btArray.append(str);   // 错
```

因为：

- `QString` 是文本对象
    
- `QByteArray` 是字节数组
    
- `append()` 不接受 `QString`
    

所以必须先转换：

```cpp
QByteArray btArray = str.toUtf8();
```

或者：

```cpp
btArray.append(str.toUtf8());
```

Qt 6 登录对话框示例书中也是先把字符串转换成字节数组，再交给 `QCryptographicHash` 处理。书里示例用的是 `toLocal8Bit()`，原理相同，本质都是 `QString -> QByteArray`。

---

### 1.3 为什么推荐 `toUtf8()` 而不是 `toLocal8Bit()`

两者都能工作，但从编码稳定性上说：

- `toUtf8()`：跨平台更稳定，编码明确
    
- `toLocal8Bit()`：依赖本地系统编码
    

对课程作业来说两者都可接受；  
对你现在这种“自己写、希望不踩坑”的代码，我建议优先 `toUtf8()`。

---

### 1.4 `hash.result().toHex()` 到底是什么

`hash.result()` 返回的是**原始哈希字节序列**，不可直接拿来显示。  
`toHex()` 把它变成十六进制可读字符串。

例如 `"12345"` 的 MD5 会变成一串长度为 32 的十六进制字符串。  
所以你后面比较密码时，比的不是明文，而是这串十六进制文本。

---

## 2. `MainWindow::ReadString()`

这个函数做的是：**从本地配置里恢复状态**。

你当前逻辑大致是：

```cpp
void MainWindow::ReadString()
{
    QSettings settings("UserDataBase","onley");

    bool saved = settings.value("saved", false).toBool();
    m_user = settings.value("Username", "admin").toString();

    QString defaultPSWD = encrypt("12345");
    m_pswd = settings.value("PSWD", defaultPSWD).toString();

    if (saved) {
        ui->lineEdit_Username->setText(m_user);
    }
    ui->checkBox->setChecked(saved);
}
```

这和文档中的结构一致：读取 `saved`、`Username`、`PSWD` 三个键；若 `saved` 为真，就回填用户名。

---

### 2.1 这个函数的设计意义

它不是“读取界面内容”，而是：

- 恢复业务状态 `m_user / m_pswd`
    
- 再把状态同步回界面
    

这是一个典型方向：

$$
\text{存储} \rightarrow \text{成员变量} \rightarrow \text{UI}  
$$

而不是直接到处操作 UI。

---

### 2.2 `settings.value(...).toBool()` / `.toString()` 为什么这么写

因为 `QSettings::value()` 的返回值是 `QVariant`。  
`QVariant` 是 Qt 的“通用包装类型”，你必须显式转换成实际类型。  
文档对这一点写得很明确：`value()` 返回的是 `QVariant`，需要再转换成所需数据类型。

---

### 2.3 为什么默认密码也要先 `encrypt("12345")`

这是一个关键点。

如果你写：

```cpp
m_pswd = "12345";
```

而登录时比较的是：

```cpp
encrypt(pswd) == m_pswd
```

那么左边是密文，右边是明文，永远不等。

所以默认密码也必须先转成密文：

```cpp
QString defaultPSWD = encrypt("12345");
```

这一步不是“优化”，而是**逻辑正确性的必要条件**。

---

## 3. `MainWindow::WriteString()`

这个函数做的是：**把当前状态写回本地配置**。

典型结构：

```cpp
void MainWindow::WriteString()
{
    QSettings settings("UserDataBase","onley");
    settings.setValue("Username", m_user);
    settings.setValue("PSWD", m_pswd);
    settings.setValue("saved", ui->checkBox->isChecked());
}
```

文档原始案例也是这个结构：保存用户名、密码、是否记住。

---

### 3.1 这里保存的不是“密码”，而是“密码哈希值”

这一点必须牢牢记住。

```cpp
settings.setValue("PSWD", m_pswd);
```

表面上看是在存密码，实际应该存的是：

$$
\text{encrypt(明文密码)}  
$$

也就是哈希值。

---

### 3.2 为什么不能反过来把密码显示回密码框

因为 `QCryptographicHash` 只提供哈希，不提供解密。  
文档明确指出：读取到保存参数后，**无法把加密后的密码解密并显示在窗口上**，所以程序通常只能回显用户名，不能回显密码。

这也是为什么很多真实登录界面“记住密码”其实背后并不等于“明文再填回去”。

---

## 4. `MainWindow::on_pushButton_clicked()`

这是主业务槽函数，负责完整登录流程。

典型逻辑：

```cpp
void MainWindow::on_pushButton_clicked()
{
    QString user = ui->lineEdit_Username->text().trimmed();
    QString pswd = ui->lineEdit_Password->text().trimmed();

    QString encryptPSWD = encrypt(pswd);

    if (user == m_user && encryptPSWD == m_pswd) {
        WriteString();
        QMessageBox::information(this, "成功", "已登录");
    } else {
        m_tryCount++;
        ...
    }
}
```

文档中的登录槽函数也是“读取输入 -> 加密密码 -> 对比 -> 成功保存 -> 失败累计次数”的结构。

---

### 4.1 `trimmed()` 的意义

`trimmed()` 用于去掉首尾空白。  
这一步能避免：

- 用户复制粘贴时多带空格
    
- 输入时误加前后空格
    

登录场景里是合理的预处理。

---

### 4.2 为什么先加密再比较

因为存储侧保存的是密文，所以输入也要走同一映射：

$$
\text{明文输入} \xrightarrow{encrypt()} \text{密文}  
$$

然后才能比较。

---

### 4.3 `m_tryCount` 是什么

这是最简单的“防暴力尝试机制”。

逻辑是：

- 每次失败：`m_tryCount++`
    
- 超过阈值：关闭窗口
    

这个思路在教学场景里很常见，用来让你理解：

- 成员变量如何在多次点击之间保存状态
    
- 槽函数如何驱动状态机
    

---

# 三、新出现模块的重点教学

下面是你特别要求的部分：**凡是这一模块首次出现的新东西，都详细讲。**

---

## A. `QByteArray` 详细教学

### A.1 它是什么

`QByteArray` 是 Qt 的**字节数组类**，本质上用来存放：

$$
\text{一串原始字节}  
$$

适合处理：

- 编码后的字符串
    
- 文件内容
    
- 网络数据
    
- 哈希输入输出
    
- 二进制协议
    

---

### A.2 它和 `QString` 的区别

#### `QString`

面向“文本语义”：

- Unicode 字符串
    
- 适合显示、编辑、拼接、查找
    

#### `QByteArray`

面向“字节语义”：

- 不关心字符含义
    
- 适合 IO、加密、编码转换
    

最常见转换关系：

```cpp
QString s = "hello";
QByteArray b = s.toUtf8();
QString s2 = QString::fromUtf8(b);
```

---

### A.3 为什么这次必须用它

因为哈希算法处理的输入不是“Qt 文本对象”，而是“字节流”。

所以必须：

```cpp
QString -> QByteArray
```

这不是 Qt 的特殊规定，而是哈希算法的普遍要求。

---

### A.4 常用接口

```cpp
QByteArray b = "abc";
b.append("def");
b.size();
b.toHex();
```

这次你最重要要记住的接口只有两个：

- `toUtf8()`：把 `QString` 转成 `QByteArray`
    
- `toHex()`：把原始字节转成十六进制字符串
    

---

## B. `QSettings` 详细教学

### B.1 它是什么

`QSettings` 是 Qt 的**轻量级配置读写类**。

适合保存：

- 用户偏好
    
- 窗口位置和大小
    
- 最近打开文件
    
- 是否记住用户名
    
- 一些简单 key-value 配置
    

文档明确指出：应用程序设置就是应用程序需要保存的信息，在 Windows 系统里一般保存到注册表；`QSettings` 可实现这些信息的读取和写入。

---

### B.2 你这次怎么用的

你用了带组织名、应用名的构造函数：

```cpp
QSettings settings("UserDataBase", "onley");
```

这表示用一个固定分组保存配置。  
文档里也展示了同样结构的写法，并解释了它对应 Windows 注册表中的一个目录。

---

### B.3 两个最核心函数

#### 写入

```cpp
settings.setValue("Username", m_user);
```

#### 读取

```cpp
QString user = settings.value("Username", "admin").toString();
```

公式化理解：

$$
\text{key} \rightarrow \text{value}  
$$

其中读取时可给默认值：

$$
value(key, default)  
$$

---

### B.4 `QVariant` 为什么会出现

因为 `QSettings` 可能保存：

- bool
    
- int
    
- QString
    
- double
    
- ...
    

返回值必须能统一承载各种类型，所以用 `QVariant`。

这也是为什么你每次都要：

```cpp
.toBool()
.toString()
```

---

### B.5 什么时候适合用 `QSettings`

适合：

- 小配置
    
- 本地参数
    
- 用户偏好
    

不适合：

- 大量结构化数据
    
- 复杂查询
    
- 多表关系
    

后者就该上数据库，不该继续用 `QSettings`。

---

## C. `QCryptographicHash` 详细教学

### C.1 它是什么

`QCryptographicHash` 是 Qt 提供的**哈希计算类**。

用途：

- 计算 MD5 / SHA 等摘要
    
- 验证数据一致性
    
- 简单密码摘要演示
    

文档里明确说：Qt 提供的 `QCryptographicHash` 可用于加密（更准确地说，是哈希），示例里用于对字符串做 MD5。

---

### C.2 这次用法的标准结构

```cpp
QByteArray btArray = str.toUtf8();
QCryptographicHash hash(QCryptographicHash::Md5);
hash.addData(btArray);
QByteArray result = hash.result();
QString md5 = result.toHex();
```

这个模板你后面几乎可以原样复用。

---

### C.3 `Md5` 到底是什么

MD5 是一种哈希算法，会把任意输入映射成固定长度摘要。

特点：

- 输入一样，输出一定一样
    
- 输入稍变，输出显著变化
    
- 不能从结果反推原文
    

---

### C.4 为什么说它“不能解密”

因为它不是“加密-解密”对，而是**单向哈希**。

所以：

- 你可以算出 `encrypt("12345")`
    
- 但不能从结果恢复 `"12345"`
    

文档明确说明：`QCryptographicHash` 只提供加密功能，没有提供解密功能。

---

### C.5 学术上更准确的说法

严格说，你这里做的不是“加密”，而是：

$$
\text{哈希 / 摘要}  
$$

课程、博客里经常口语化写“加密”，但你自己要知道这两个概念不同。

---

### C.6 真实工程里要不要用 MD5

不推荐。

因为 MD5 已不适合真实密码存储。  
课程作业里用它只是为了快速理解：

- 字符串转字节
    
- 哈希流程
    
- 摘要比较
    

所以你当前阶段可以学接口，但不要把它当真实安全方案。

---

## D. `QMessageBox` 详细教学

### D.1 它是什么

Qt 的标准消息框类，用于弹出：

- 提示
    
- 警告
    
- 错误
    
- 询问
    

---

### D.2 这次你用到了什么

#### 警告

```cpp
QMessageBox::warning(this, "错误提示", "用户名或密码错误");
```

#### 严重错误

```cpp
QMessageBox::critical(this, "错误", "输入错误次数太多，强行退出");
```

#### 成功提示

你应该改成：

```cpp
QMessageBox::information(this, "成功", "已登录");
```

因为“成功”不该用 `critical`。

---

### D.3 三者区别

- `information`：普通提示、成功提示
    
- `warning`：用户可纠正的问题
    
- `critical`：严重错误、异常终止
    

这不是语法问题，而是交互语义问题。

---

# 四、这个模块最重要的易错点

## 易错点 1：明文和密文混用

最容易犯的错就是：

- 默认密码写成明文
    
- 比较时却拿密文比较
    

这一错一旦出现，程序“能跑但永远登录失败”。

---

## 易错点 2：`QString` 和 `QByteArray` 混淆

你这次已经真实踩到了。  
以后看到：

- 网络
    
- 文件
    
- 加密
    
- 编码
    

都要条件反射想到：  
**是不是该用 `QByteArray` 了？**

---

## 易错点 3：把配置读写当数据库

`QSettings` 是配置系统，不是数据库。  
这次适合用它；以后如果保存联系人列表、成绩表、多条记录关系，就不适合了。

---

## 易错点 4：把文档里的全局变量照抄

原文把 `m_user / m_pswd / m_tryCount` 写成全局变量，这对初学者非常容易形成坏习惯。

你现在已经改成成员变量，这是正确方向。

---

# 五、你现在应该形成的 Qt 认知

做完这个模块，你应该有这几个稳定认识：

1. **QLineEdit 不只是输入框**  
    它常常是业务流程的入口。
    
2. **Qt 控件学习不能只看控件本身**  
    真正有价值的是“控件 + 状态 + 槽函数 + 数据流”。
    
3. **字符串处理在 Qt GUI 中非常核心**  
    `QString` 是高频中的高频。
    
4. **配置持久化是 GUI 程序的基本能力**  
    `QSettings` 非常常用。
    
5. **很多 Qt 类的边界要分清**
    
    - `QString`：文本
        
    - `QByteArray`：字节
        
    - `QVariant`：通用值容器
        

---

# 六、这一模块你应该记住的最小模板

最后给你一个最值得背下来的“最小模板”：

```cpp
QString user = ui->lineEdit_Username->text().trimmed();
QString pswd = ui->lineEdit_Password->text().trimmed();

QString encryptPSWD = encrypt(pswd);

if (user == m_user && encryptPSWD == m_pswd) {
    WriteString();
    QMessageBox::information(this, "成功", "已登录");
} else {
    m_tryCount++;
    QMessageBox::warning(this, "错误提示", "用户名或密码错误");
}
```

这个模板背后的能力链是：

$$
UI输入 \rightarrow QString处理 \rightarrow 哈希 \rightarrow 状态判断 \rightarrow 配置保存 \rightarrow 消息反馈  
$$

你把这条链真正吃透，后面很多 Qt 小作业都会轻松很多。

---

下一步按新流程，应该进入 **SpinBox 数值组件的阶段 1：实现 + 运行验证**。