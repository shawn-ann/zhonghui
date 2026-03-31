# 中汇企业官网部署文档

本文档详细介绍如何在 CentOS 服务器上部署中汇企业官网系统，包括后端 API 和管理后台。

---

## 一、服务器环境要求

### 1.1 基础环境

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| CentOS | 7.x 或 8.x | 操作系统 |
| Node.js | ≥ 18.0.0 | 推荐使用 nvm 管理 |
| MySQL | ≥ 8.0 | 数据库 |
| Nginx | ≥ 1.18 | Web 服务器 |
| PM2 | 最新版 | 进程管理工具 |
| firewall-cmd | - | 防火墙管理（CentOS 7） |
| podman/docker | - | 容器（可选） |

### 1.2 安装 MySQL 8.x (CentOS)

```bash
# 1. 安装 MySQL 官方 YUM 源
rpm -Uvh https://dev.mysql.com/get/mysql80-community-release-el7-7.noarch.rpm

# 2. 安装 MySQL Server
yum install -y mysql-community-server

# 3. 启动 MySQL 服务
systemctl start mysqld
systemctl enable mysqld

# 4. 获取临时 root 密码
grep 'temporary password' /var/log/mysqld.log

# 5. 登录 MySQL
mysql -u root -p

# 6. 修改 root 密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'PK[XZvDYxX{Ps6bx';

# 7. 创建数据库
CREATE DATABASE zhonghui CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 8. 退出
EXIT;
```

**注意**：请将 `YourNewPassword!` 替换为您自己的密码，并妥善保管。

### 1.3 安装 Node.js

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 使用 nvm 安装 Node.js
source ~/.bashrc
nvm install 16
nvm use 16

# 验证安装
node -v  # 应该显示 v18.x.x
npm -v
```

### 1.4 安装 Nginx (CentOS)

```bash
# 安装 epel-release
yum install -y epel-release

# 安装 Nginx
yum install -y nginx

# 启动 Nginx
systemctl start nginx
systemctl enable nginx
```

### 1.5 安装 PM2

```bash
npm install -g pm2
pm2 --version
```

---

## 二、目录结构

在服务器上创建以下目录结构：

```bash
/var/www/
├── zhonghui/                    # 项目根目录
│   ├── backend/                # 后端服务
│   │   ├── admin/              # 管理后台构建文件
│   │   ├── uploads/            # 上传文件目录
│   │   ├── config/              # 配置文件
│   │   ├── api/                # API 路由
│   │   ├── models/             # 数据模型
│   │   └── index.js             # 入口文件
```

**注意**：请确保目录所有者为 `nginx` 用户（CentOS）

---

## 三、数据库部署

### 3.1 创建数据库用户和数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE zhonghui CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 创建应用专用用户（推荐）
CREATE USER 'zhonghui'@'localhost' IDENTIFIED BY 'PK[XZvDYxX{Ps6bx';
GRANT ALL PRIVILEGES ON zhonghui.* TO 'zhonghui'@'localhost';
FLUSH PRIVILEGES;

# 退出
EXIT;
```

**注意**：
- 请将 `YourAppPassword!` 替换为您自己的密码
- 应用建议使用专用用户，不要使用 root 用户

### 3.2 导入初始数据

```bash
cd /var/www/zhonghui/backend
mysql -u root -p zhonghui < config/init.sql
```

### 3.3 执行迁移脚本（可选）

如果需要修改密码加密方式：

```bash
mysql -u root -p zhonghui < config/migrations/20260330_admin_password_md5.sql
```

### 3.4 配置 .env 文件

```bash
# 进入后端目录
cd /var/www/zhonghui/backend

# 创建 .env 文件
cat > .env << 'EOF'
PORT=3000
DB_HOST=localhost
DB_USER=zhonghui
DB_PASSWORD=PK[XZvDYxX{Ps6bx
DB_NAME=zhonghui
UPLOAD_DIR=./uploads
EOF
```

---

## 四、后端服务部署

### 4.1 上传代码

```bash
# 方法一：使用 git clone
cd /var/www/zhonghui
git clone https://github.com/shawn-ann/zhonghui.git

# 方法二：使用 scp 上传
scp -r ./backend user@server:/var/www/zhonghui/
```

### 4.2 安装依赖

```bash
cd /var/www/zhonghui/backend
npm install --production
```

### 4.3 创建上传目录

```bash
mkdir -p uploads
chmod 755 uploads
```

### 4.4 启动服务

```bash
# 使用 PM2 启动
pm2 start index.js --name zhonghui-api

# 设置开机自启
pm2 startup
pm2 save
```

### 4.5 查看服务状态

```bash
pm2 status
pm2 logs zhonghui-api
```

---

## 五、管理后台部署

### 5.1 构建生产版本

在本地执行构建：

```bash
cd admin
npm run build
```

构建完成后，`dist` 目录中的文件即为生产版本。

### 5.2 上传构建文件

将构建文件上传到服务器的 backend 目录下（由后端服务托管）：

```bash
# 上传到服务器
scp -r ./admin/dist/* user@server:/var/www/zhonghui/backend/admin/
```

### 5.3 配置环境变量（可选）

如果需要使用不同的 API 地址：

```bash
# 编辑生产环境配置
vim /var/www/zhonghui/admin/.env.production

# 修改 API 地址
VITE_API_BASE_URL=http://localhost:3000
```

---

## 六、Nginx 配置（含 HTTPS）

### 6.1 复制 Nginx 配置

```bash
# 复制配置文件
sudo cp nginx.conf /etc/nginx/sites-available/www.chinaaupairs.com

# 创建软链接
sudo ln -s /etc/nginx/sites-available/www.chinaaupairs.com /etc/nginx/sites-enabled/

# 删除默认配置（如果存在）
sudo rm -f /etc/nginx/sites-enabled/default
```

### 6.2 测试配置

```bash
sudo nginx -t
```

如果出现错误，请根据提示修复。

### 6.3 重载 Nginx

```bash
sudo systemctl reload nginx
```

### 6.4 Nginx 配置说明

| 请求路径 | 转发后路径 | 目标服务 |
|----------|------------|----------|
| `http://www.chinaaupairs.com/*` | 自动重定向到 HTTPS | - |
| `https://www.chinaaupairs.com/miniprogram/api/*` | `/api/*` | 后端 API |
| `https://www.chinaaupairs.com/miniprogram/admin/*` | `/admin/*` | 管理后台 |
| `https://www.chinaaupairs.com/miniprogram/uploads/*` | `/uploads/*` | 上传文件 |

---

## 七、SSL 证书配置（Let's Encrypt）

### 7.1 安装 certbot

```bash
# CentOS 安装 certbot
yum install -y epel-release
yum install -y certbot python3-certbot-nginx
```

### 7.2 获取 SSL 证书

```bash
# 停止 nginx
sudo systemctl stop nginx

# 获取证书（会自动配置 nginx）
sudo certbot --nginx -d www.chinaaupairs.com
```

按照提示完成配置，certbot 会自动：
- 生成 SSL 证书（保存到 `/etc/letsencrypt/live/www.chinaaupairs.com/`）
- 修改 nginx 配置添加 443 端口
- 配置 HTTP → HTTPS 自动重定向

### 7.3 验证 HTTPS 访问

```bash
# 启动 nginx
sudo systemctl start nginx

# 测试 HTTPS 访问
curl https://www.chinaaupairs.com

# 验证 HTTP 自动跳转到 HTTPS
curl -I http://www.chinaaupairs.com
# 应返回 301 重定向到 https://www.chinaaupairs.com/
```

### 7.4 配置自动续期

Let's Encrypt 证书有效期为 90 天，建议设置自动续期：

```bash
# 编辑 crontab
sudo crontab -e

# 添加以下行（每天凌晨 3 点检查续期）
0 3 * * * certbot renew --quiet --deploy-hook "systemctl reload nginx"
```

### 7.5 华为云安全组配置

确保服务器的安全组已开放 80 和 443 端口：

| 协议 | 端口 | 源 IP | 动作 |
|------|------|-------|------|
| TCP | 80 | 0.0.0.0/0 | 允许 |
| TCP | 443 | 0.0.0.0/0 | 允许 |

---

## 八、验证部署

### 8.1 检查服务状态

```bash
# 检查后端服务
curl http://localhost:3000/api/health

# 应该返回 {"status":"ok"}
```

### 8.2 检查访问

| 服务 | 访问地址 |
|------|----------|
| 管理后台 | https://www.chinaaupairs.com/miniprogram/admin |
| API 接口 | https://www.chinaaupairs.com/miniprogram/api/articles |

### 8.3 测试登录

访问管理后台，使用以下凭据登录：
- 用户名：`admin`
- 密码：`password`

---

## 九、常见问题处理

### 9.1 后端服务无法启动

```bash
# 查看错误日志
pm2 logs zhonghui-api

# 常见原因：
# 1. .env 文件未配置
# 2. 数据库连接失败
# 3. 端口被占用
```

### 9.2 端口被占用

```bash
# 查看端口占用
lsof -i:3000

# 杀死占用进程
kill -9 <PID>
```

### 9.3 权限问题

```bash
# CentOS 使用 nginx 用户
chown -R nginx:nginx /var/www/zhonghui
chmod -R 755 /var/www/zhonghui
```

### 9.4 图片上传失败

```bash
# 确保 uploads 目录存在且有写权限
mkdir -p /var/www/zhonghui/backend/uploads
chown -R nginx:nginx /var/www/zhonghui/backend/uploads
chmod -R 755 /var/www/zhonghui/backend/uploads
```

---

## 十、自动化部署（推荐）

### 10.1 脚本说明

项目提供了两个自动化部署脚本：

| 脚本 | 位置 | 功能 |
|------|------|------|
| deploy-local.sh | scripts/ | 本地打包并上传到服务器 |
| deploy-remote.sh | scripts/ | 在服务器上部署后端服务 |

### 10.2 使用步骤

#### 步骤一：配置服务器连接

编辑 `scripts/deploy-local.sh` 文件，修改以下配置：

```bash
SERVER_USER="root"                    # 服务器用户名
SERVER_HOST="www.chinaaupairs.com"    # 服务器地址
SERVER_PATH="/var/www/zhonghui"       # 远程服务器项目路径
```

#### 步骤二：本地打包并上传

```bash
# 进入脚本目录
cd scripts

# 执行部署脚本
./deploy-local.sh
```

脚本会：
1. 打包后端代码
2. 打包管理后台构建文件
3. 打包配置文件
4. 上传到远程服务器

#### 步骤三：服务器上部署

```bash
# 连接到服务器
ssh root@www.chinaaupairs.com

# 进入项目目录
cd /var/www/zhonghui

# 执行部署脚本
./deploy-remote.sh
```

部署脚本会：
1. 检查 MySQL、Node.js、PM2 环境
2. 创建数据库（如果不存在）
3. 导入初始数据
4. 创建 .env 文件（交互式输入 MySQL 密码）
5. 安装后端依赖
6. 创建上传目录
7. 启动后端服务（PM2）
8. 验证服务状态

---

## 十一、更新部署

### 11.1 更新后端代码

```bash
cd /var/www/zhonghui/backend
git pull

# 如果有新的依赖
npm install

# 重启服务
pm2 restart zhonghui-api
```

### 11.2 更新管理后台

```bash
# 本地重新构建
cd admin
npm run build

# 上传到服务器
scp -r ./dist/* user@server:/var/www/zhonghui/backend/admin/
```

### 11.3 重启所有服务

```bash
pm2 restart all
```

---

## 十二、服务管理命令

```bash
# 启动服务
pm2 start zhonghui-api

# 停止服务
pm2 stop zhonghui-api

# 重启服务
pm2 restart zhonghui-api

# 查看日志
pm2 logs zhonghui-api

# 监控状态
pm2 monit
```

---

## 十三、备份与恢复

### 13.1 备份数据库

```bash
mysqldump -u root -p zhonghui > backup_$(date +%Y%m%d).sql
```

### 13.2 恢复数据库

```bash
mysql -u root -p zhonghui < backup_20240330.sql
```

---

## 十四、安全建议

1. **防火墙配置**：只开放 80 和 443 端口，配置 firewalld
2. **SSL 证书**：配置 HTTPS（已配置 Let's Encrypt）
3. **定期备份**：每天自动备份数据库
4. **日志轮转**：配置 Nginx 和 PM2 日志轮转
5. **监控告警**：配置服务监控和告警
6. **敏感信息**：不要将 .env 文件提交到 Git

### 14.1 CentOS 防火墙配置

```bash
# 开放 HTTP 和 HTTPS 端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# 如果使用非标准端口
firewall-cmd --permanent --add-port=3000/tcp

# 重载防火墙
firewall-cmd --reload

# 查看开放端口
firewall-cmd --list-all
```

---

## 十五、部署检查清单

- [ ] Node.js 和 PM2 已安装
- [ ] MySQL 数据库已创建
- [ ] 后端代码已上传并安装依赖
- [ ] .env 文件已配置
- [ ] 数据库已初始化
- [ ] 后端服务已启动（PM2）
- [ ] 管理后台已构建并上传
- [ ] Nginx 配置已应用（含 HTTPS）
- [ ] SSL 证书已配置（Let's Encrypt）
- [ ] 华为云安全组已开放 80 和 443 端口
- [ ] 服务可以正常访问（HTTPS）

---

## 联系方式

如有任何问题，请联系项目维护者。
