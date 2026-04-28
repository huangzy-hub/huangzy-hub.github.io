## 一、笔记：ida pro使用

### 1. 查找字符串
- shift+Fn+f12。（查找更多中文字符串：新快捷方式 -dCULTURE-all）

### 2. 中文字符串修复
- 选中字符串字节至0，选中A。查找字符串，右键点击“重建”。

### 3. 修改数据
- 右键edit/f2->修改->右键应用

### 4. 修改代码
- edit->assemble->修改（本地）

### 5. 打补丁
- edit->patch program->apply->代码修改应用到程序

### 6、交叉引用
快捷键X

### 7、函数修复
- 函数识别错误：找到函数头->右键create function。
- 栈不平衡：options->General->stack pointer->OK->负数可能出错->发现不平衡/修改->重新建立函数。

### 8、注释
- 快捷键;

## 二、笔记：x64dbg使用   

### 1、运行
- 直接附加。
- 运行再附加。

### 2、搜索字符串
- 右键/shift+D

### 3、代码流程图
- 快捷键G

### 4、修改代码/数据
- 空格->双击代码修改
- 搜索数据存放位置->转编码->cheat engine->找进程->改为读写->编辑

### 5、断点
- 快捷键f2

### 6、补丁
- 修改（不要在断点上修改代码）->修补文件->保存

## 三、笔记：.asm文件的编译链接过程（基于该CMD操作）
该过程是**汇编源文件（.asm）→ 目标文件（.obj）→ 可执行文件**的完整流程，对应操作及说明如下：

### 1. 汇编阶段：将.asm编译为.obj
- **操作命令**：`ml /c /coff test.asm`
  - 工具：`ml`是Microsoft Macro Assembler（MASM，版本6.14），即微软宏汇编器；
  - 参数说明：
    - `/c`：仅编译生成目标文件（.obj），不自动链接；
    - `/coff`：指定生成COFF格式的目标文件（Windows平台常用的目标文件格式）；
- **执行结果**：输出`Assembling: test.asm`，表示成功将`test.asm`汇编为`test.obj`（COFF格式）。


### 2. 链接阶段：将.obj链接为可执行文件
- **操作命令**：`Link /subsystem:windows test.obj`
  - 工具：`Link`是Microsoft Incremental Linker（增量链接器，版本5.12）；
  - 参数说明：
    - `/subsystem:windows`：指定程序运行的子系统为“Windows”（生成GUI程序，无控制台窗口；若需控制台程序，可替换为`/subsystem:console`）；
- **执行结果**：无报错则生成对应的可执行文件（默认输出`test.exe`）。