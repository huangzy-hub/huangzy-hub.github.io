# 一、主机 ↔ 虚拟机 文本复制（剪贴板共享）相关命令与操作
## 1. 检查/安装VMware剪贴板共享工具
```bash
# 检查open-vm-tools是否已安装
sudo apt list --installed | grep open-vm-tools

# 未安装则执行安装（Ubuntu系统）
sudo apt update && sudo apt install open-vm-tools open-vm-tools-desktop

# 重启工具服务（修复剪贴板失效）
sudo systemctl restart open-vm-tools

# 手动加载剪贴板模块（可选应急方案）
sudo vmware-user-suid-wrapper
```

## 2. 验证剪贴板功能
```bash
# 虚拟机内复制文本（示例：复制当前目录路径）
pwd | xclip -sel clip  # 需先安装xclip：sudo apt install xclip
# 主机粘贴即可；反之主机复制，虚拟机内执行以下命令粘贴
xclip -o sel clip
```

# 二、文件挂载相关命令（主机-虚拟机、开发板-虚拟机）
## （一）主机 ↔ 虚拟机 共享文件夹挂载（VMware共享文件夹）
```bash
# 虚拟机端检查共享文件夹是否挂载
vmware-hgfsclient

# 手动挂载共享文件夹
sudo vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other
```
[参考视频地址](https://www.bilibili.com/video/BV1HwuczVEG4/?spm_id_from=333.337.search-card.all.click&vd_source=3881e95a6111e5a025dbc0531ef2a219)


## （二）开发板 ↔ 虚拟机 NFS共享挂载（核心命令）
### 虚拟机端（NFS服务器配置）
```bash
# 1. 安装NFS服务
sudo apt update && sudo apt install nfs-kernel-server

# 2. 创建共享目录
mkdir -p /mnt/hgfs/share  # 或 ~/nfs_share
sudo chmod -R 777 /mnt/hgfs/share

# 3. 配置NFS共享权限
sudo nano /etc/exports
# 在文件末尾添加（允许开发板网段访问，添加fsid=0适配NFSv4）
/mnt/hgfs/share 192.168.1.0/24(rw,sync,no_subtree_check,no_root_squash,fsid=0)

# 4. 重新加载NFS配置并重启服务
sudo exportfs -r
sudo systemctl restart nfs-kernel-server
sudo systemctl enable nfs-kernel-server  # 设置NFS服务开机自启

# 5. 验证NFS共享目录列表
showmount -e localhost
```

### 开发板端（NFS客户端挂载）
```bash
# 1. 创建本地挂载目录
mkdir -p /mnt/host_share

# 2. 手动挂载虚拟机NFS共享目录
mount -t nfs 192.168.1.221:/mnt/hgfs/share /mnt/host_share

# 3. 验证挂载是否成功
df -h | grep /mnt/host_share  # 查看挂载状态
ls /mnt/host_share  # 查看共享文件

# 4. 配置开机自动挂载（永久生效）
sudo nano /etc/fstab
# 在文件末尾添加
192.168.1.221:/mnt/hgfs/share /mnt/host_share nfs defaults 0 0

# 5. 验证自动挂载（重启后执行）
df -h | grep /mnt/host_share


# 6. open-vm-tools已运行，但可能缺少桌面环境依赖，执行以下命令安装完整组件：
bash
运行
sudo apt install open-vm-tools-desktop
```

### 总结
1.  主机与虚拟机文本复制核心依赖`open-vm-tools`，需确保服务正常运行+VMware剪贴板勾选；
2.  主机与虚拟机文件共享用VMware自带共享文件夹（挂载点`/mnt/hgfs`），开发板与虚拟机用NFS（虚拟机为服务端、开发板为客户端）；
3.  所有挂载需先创建本地目录，NFS需配置`/etc/exports`并重启服务，开机自动挂载需配置`/etc/fstab`；
4.  Ubuntu 24.04需替换过时软件包名（如`libbsd1.2-dev`→`libbsd-dev`、`openjdk-8-jdk`→`openjdk-17-jdk`），并启用32位架构




# 三、交叉编译器安装


搞了一个下午终于搞定了，不知道为什么虚拟机又进不了桌面，然后昨天设置好的共享目录为什么又突然不行了，差点给我整破防了。ai给的命令行还京经常把“-”和“_”，我还以为今天完成不了了。

## 1. 下载交叉编译工具

[安装工具地址](https://gitee.com/tanzhtanzh/kickpi-book/blob/master/a133/zh/04-SDK%E7%BC%96%E8%AF%91/01-%E7%BC%96%E8%AF%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA.md)

## 2. 在linux里面解压

```bash
tar -xvf gcc-linaro-7.2.1-2017.11-x86_64-arm-linux-gnueabi.tar.xz
```
如果在windows里面解压就会出现一些乱七八糟的问题，这里耗了我好多时间。

## 3.找到对应文件设置环境变量

- 1. 临时生效（当前终端可用）

```bash
# 桌面解压后的bin目录绝对路径
export PATH=$PATH:/home/huangzy/桌面/gcc-linaro-7.2.1-2017.11-x86_64-arm-linux-gnueabi/bin
```

- 2. 永久生效（重启终端仍可用，推荐）

```bash
# 编辑用户环境变量配置文件
vim ~/.bashrc

# 在文件末尾粘贴上述export命令（路径务必准确）
# 保存退出：按Esc → 输入:wq → 回车

# 强制生效配置
source ~/.bashrc
```

- 3. 验证交叉编译器是否正常

```bash
# 查看编译器版本,若输出版本信息（gcc 7.2.1 Linaro），说明编译器配置成功。
arm-linux-gnueabi-gcc -v
```

## 4、静态连接方式

```bash
# 在虚拟机执行（添加-static参数）
arm-linux-gnueabi-gcc test.c -o test_static -static
```


```bash
# 在开发板终端
chmod +x test_static
./test_static
```

## 5、动态连接

- 检查开发板中原本有没有相应文件

```bash
#若存在这些文件，说明支持动态链接
ls /lib/libc.so.6  # 检查C标准库
ls /lib/ld-linux.so.3  # 检查链接器

```

- 如果没有就工具包里找
```bash
# 虚拟机中查找库文件
find /usr/arm-linux-gnueabi/ -name "libc.so.6"
find /usr/arm-linux-gnueabi/ -name "ld-linux.so.3"
```

- 将库文件拷贝到共享目录
在虚拟机终端，进入库文件所在目录，把文件复制到共享目录（比如/mnt/share）

```bash
# 进入库文件目录（根据你的实际路径调整）
cd /桌面/gcc-linaro-7.2.1-2017.11-x86_64_arm-linux-gnueabi/arm-linux-gnueabi/libc/lib/

# 复制到共享目录
cp libc.so.6 ld-linux.so.3 /mnt/share/
```

- 在开发板中拷贝到 /lib 目录

在开发板终端，进入共享目录，把库文件移动到/lib：

```bash
# 进入共享目录
cd /mnt/host_share

# 拷贝到开发板的/lib目录（需要root权限）
cp libc.so.6 ld-linux.so.3 /lib/
```

- 验证动态链接程序


虚拟机编译动态程序：

```bash
arm-linux-gnueabi-gcc test.c -o test_dynamic
```
传输到开发板后运行：

```bash
./test_dynamic
```