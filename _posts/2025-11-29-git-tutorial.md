---
layout: post
title: "Git + GitHub 实战指南：从仓库搭建到代码同步"
date: 2025-11-29 15:00:00 +0800
categories: [教程, 开发工具]
tags: [GitHub,blog]
---

## 前言

在完成个人博客网页后，由于完善网页和上传文章需要频繁上传代码，我又顺便解锁了Git + GitHub技能，下面是一些笔记（ai总结）。

## 一、基础准备：Git 安装与配置

### 1. 安装 Git
```bash
# Ubuntu/Debian 系统
sudo apt-get install git

# macOS 系统（需先安装 Homebrew）
brew install git

# Windows 系统
# 1. 下载安装包：https://git-scm.com/download/win
# 2. 安装时勾选「Add Git to PATH」，方便终端调用
```

### 2. 初始配置（绑定 GitHub 身份）
安装后必须配置用户名和邮箱（与 GitHub 账号一致），否则无法提交代码：
```bash
# 配置用户名（替换为你的 GitHub 用户名）
git config --global user.name "huangzy-hub"

# 配置邮箱（替换为你的 GitHub 绑定邮箱）
git config --global user.email "你的GitHub邮箱@xxx.com"

# 查看配置是否生效
git config --global --list
```
- `--global`：全局配置，所有本地仓库都生效；若需单独配置某个仓库，去掉该参数即可。

## 二、核心操作：本地与 GitHub 仓库同步

### 场景 1：本地已有项目，关联远程 GitHub 仓库
适合本地已写好博客/代码，需上传到 GitHub 备份或部署的场景。

#### 步骤 1：创建 GitHub 远程仓库
1. 登录 GitHub → 点击右上角「+」→ 选择「New repository」；
2. 填写仓库名（如 `huangzy-hub.github.io`，博客部署需用「用户名.github.io」格式）；
3. 勾选「Add a README file」（可选，创建初始说明文件）；
4. 点击「Create repository」，复制仓库地址（HTTPS 或 SSH 协议）。

#### 步骤 2：本地项目关联远程仓库
```bash
# 1. 进入本地项目根目录（替换为你的项目路径）
cd D:\root\blog

# 2. 初始化 Git 仓库（若本地未初始化）
git init

# 3. 关联 GitHub 远程仓库（替换为你的仓库地址）
# HTTPS 地址（推荐新手，无需配置密钥）
git remote add origin https://github.com/huangzy-hub/huangzy-hub.github.io.git

# 或 SSH 地址（需配置密钥，免密码推送，更稳定）
git remote add origin git@github.com:huangzy-hub/huangzy-hub.github.io.git

# 验证关联是否成功（显示远程仓库地址即生效）
git remote -v
```

### 场景 2：从 GitHub 拉取仓库到本地（覆盖本地文件）
适合本地文件混乱、想直接同步远程仓库内容的场景（本地文件会被覆盖，谨慎使用）：
```bash
# 1. 进入目标目录（如 D 盘根目录）
cd D:

# 2. 克隆远程仓库到本地（自动创建项目文件夹）
git clone https://github.com/huangzy-hub/huangzy-hub.github.io.git

# 3. 若本地已有文件夹，强制拉取远程文件覆盖本地
cd D:\root\blog  # 进入本地文件夹
git reset --hard HEAD  # 放弃本地未提交修改
git clean -fd  # 删除本地未跟踪文件
git fetch origin main  # 下载远程分支
git reset --hard origin/main  # 强制用远程文件覆盖本地
git branch -u origin/main  # 绑定分支，后续可直接 git pull/push
```

## 三、日常开发：代码提交与推送流程

核心流程：`修改文件 → 暂存 → 提交 → 推送`，四步即可完成本地代码同步到 GitHub。

### 1. 暂存修改（git add）
暂存区是 Git 的「临时缓冲区」，用于标记需要提交的文件：
```bash
# 暂存单个文件（替换为具体文件名，如 _posts/2025-12-01-test.md）
git add _posts/2025-12-01-test.md

# 暂存所有修改/新增的文件（常用，谨慎使用）
git add .

# 暂存指定文件夹下的所有文件（如只暂存文章文件夹）
git add _posts/*.md
```

### 2. 提交修改（git commit）
将暂存区的文件生成「版本记录」，必须填写备注说明修改内容：
```bash
# 提交并添加备注（备注要清晰，方便后续查看历史）
git commit -m "新增文章：Git实战指南 + 修复首页样式"

# 若忘记写备注，提交后会进入编辑模式，按以下步骤操作：
# 1. 输入备注内容（第一行）；
# 2. 按 Esc 键，输入 :wq 保存退出（Windows 终端可能需按 Ctrl+X 确认）。
```

### 3. 推送代码（git push）
将本地提交的版本推送到 GitHub 远程仓库：
```bash
# 首次推送（需绑定分支，后续可省略 -u origin main）
git push -u origin main

# 后续推送（已绑定分支，直接执行）
git push
```
- 若提示「fatal: The current branch main has no upstream branch」，说明未绑定分支，执行 `git push -u origin main` 即可。

### 4. 拉取远程代码（git pull）
同步 GitHub 仓库的最新代码到本地（如多人协作或异地修改后）：
```bash
# 拉取远程 main 分支（已绑定分支可直接 git pull）
git pull origin main

# 首次拉取可能出现「无关历史」错误，添加参数解决
git pull origin main --allow-unrelated-histories
```

## 四、常见问题：冲突处理与网络问题

### 问题 1：合并冲突（Automatic merge failed）
当本地和远程修改了同一文件的同一部分时，会出现冲突，终端提示：`CONFLICT (add/add): Merge conflict in 文件名`。

#### 解决步骤：
1. 打开冲突文件（VS Code 中会显示冲突标记）：
   ```markdown
   <<<<<<< HEAD  # 本地文件内容
   本地修改的内容：比如博客标题为「Git 完全指南」
   =======  # 分隔符
   远程文件内容：比如博客标题为「Git 实战指南」
   >>>>>>> origin/main  # 远程分支标识
   ```
2. 手动编辑文件：保留需要的内容，删除冲突标记（`<<<<<<<`、`=======`、`>>>>>>>`）；
3. 重新暂存并提交：
   ```bash
   git add 冲突文件名.md  # 或 git add . 暂存所有解决后的文件
   git commit -m "解决合并冲突：保留本地标题，合并远程内容"
   git push  # 推送解决后的代码
   ```

### 问题 2：网络错误（Failed to connect to github.com port 443）
HTTPS 协议可能被网络拦截，切换 SSH 协议即可解决。

#### 解决步骤：
1. 生成 SSH 密钥（本地终端执行，一路回车无需密码）：
   ```bash
   ssh-keygen -t ed25519 -C "你的GitHub邮箱@xxx.com"
   ```
2. 复制公钥内容（Windows 路径：`C:\Users\你的用户名\.ssh\id_ed25519.pub`，用记事本打开复制全部内容）；
3. 添加公钥到 GitHub：
   - GitHub 右上角头像 → Settings → SSH and GPG keys → New SSH key；
   - 粘贴公钥，填写标题（如「我的 Windows 设备」），点击 Add SSH key；
4. 更换本地仓库关联协议：
   ```bash
   # 删除旧的 HTTPS 关联
   git remote remove origin

   # 添加 SSH 关联（替换为你的仓库 SSH 地址）
   git remote add origin git@github.com:huangzy-hub/huangzy-hub.github.io.git
   ```
5. 测试连接：
   ```bash
   ssh -T git@github.com
   ```
   出现「Hi huangzy-hub! You've successfully authenticated...」即配置成功。

### 问题 3：推送提示「Everything up-to-date」
原因：只执行了 `git add .`（暂存），未执行 `git commit`（提交），Git 认为没有新版本可推送。

#### 解决：补全提交步骤
```bash
git commit -m "备注内容：如新增文章/修改配置"
git push
```

## 五、实用技巧：版本回退与文件恢复

### 场景 1：本地修改错误，恢复到修改前状态
```bash
# 1. 未执行 git add（未暂存）：放弃单个文件修改
git checkout -- 文件名.md  # 如 git checkout -- _config.yml

# 2. 未执行 git add：放弃所有文件修改
git checkout -- .

# 3. 已执行 git add（已暂存）：取消暂存并放弃修改
git reset HEAD .  # 取消所有暂存
git checkout -- .  # 放弃修改
```

### 场景 2：已提交错误版本，回退到历史版本
```bash
# 1. 查看提交历史（获取目标版本的 commit ID）
git log
# 终端会显示类似记录：commit 57ed15c（ID前7位即可），备注为提交说明

# 2. 回退到指定版本（替换为你的目标 commit ID）
git reset --hard 57ed15c

# 3. 若已推送错误版本到远程，强制覆盖（慎用！仅个人仓库使用）
git push -f origin main
```

### 场景 3：删除本地文件，从远程恢复
```bash
# 拉取远程最新版本，覆盖本地删除的文件
git pull origin main
```

## 六、博客部署：GitHub Pages 生效验证
若仓库名是「用户名.github.io」，推送代码后会自动部署为博客，验证步骤：
1. 推送代码后，进入 GitHub 仓库 → 点击「Settings」→ 下拉到「Pages」；
2. 若显示「Your site is published at https://huangzy-hub.github.io/」，说明部署成功；
3. 访问该链接即可查看博客（可能需要 1-2 分钟缓存生效）；
4. 若样式错乱或文章不显示，检查：
   - 文章是否在 `_posts` 文件夹，命名格式为「年-月-日-标题.md」；
   - `_config.yml` 中 `theme` 配置是否正确（如 `theme: jekyll-theme-primer`）。

## 七、常用命令速查表

查看配置                

```bash
#查看配置  
git config --global --list
#关联远程仓库
git remote add origin 仓库地址
#查看远程关联
git remote -v
#暂存所有文件
git add .
#提交修改
git commit -m "备注"
#首次推送
git push -u origin main
#后续推送
git push             
#拉取远程代码（已绑定分支可直接 `git pull`)
git pull origin main`（已绑定分支可直接 `git pull`）
#查看提交历史
git log
#回退到历史版本
git reset --hard commitID
#放弃本地所有修改
git checkout -- .
```

## 总结

Git + GitHub 的核心是「版本控制」和「远程同步」，掌握本文的命令和流程后，即可应对博客部署、代码备份、版本回退等常见场景。关键记住「add → commit → push」的推送流程，遇到冲突时按步骤手动解决，网络问题优先切换 SSH 协议。多实战几次就能熟练运用，后续可专注于内容创作，无需担心代码丢失或部署问题～