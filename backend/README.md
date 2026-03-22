# 后端服务说明

## 环境要求

- Node.js 18.0.0 或更高版本
- MySQL 5.7 或更高版本

## 安装 Node.js

### Windows 系统
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载最新的 LTS 版本安装包
3. 运行安装包并按照提示完成安装
4. 安装完成后，打开命令提示符，运行 `node -v` 确认安装成功

### macOS 系统
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载最新的 LTS 版本安装包
3. 运行安装包并按照提示完成安装
4. 安装完成后，打开终端，运行 `node -v` 确认安装成功

### Linux 系统
1. 使用包管理器安装 Node.js：
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_lts.x | bash -
   yum install -y nodejs
   ```
2. 安装完成后，运行 `node -v` 确认安装成功

## 安装依赖

1. 进入 backend 目录：
   ```bash
   cd backend
   ```

2. 安装项目依赖：
   ```bash
   npm install
   ```

## 配置数据库

1. 确保 MySQL 服务已启动
2. 运行数据库初始化脚本：
   ```bash
   mysql -u root -p < config/init.sql
   ```
3. 修改 `.env` 文件中的数据库配置，确保与您的 MySQL 配置匹配

## 启动服务

### 开发环境

```bash
npm run dev
```

服务将在 `http://localhost:3000` 上运行

### 生产环境

```bash
npm start
```

## API 端点

- `GET /api/health` - 健康检查
- `GET /api/carousel` - 获取轮播图片
- `POST /api/carousel` - 创建轮播图片
- `PUT /api/carousel/:id` - 更新轮播图片
- `DELETE /api/carousel/:id` - 删除轮播图片
- `GET /api/case-studies` - 获取案例分享
- `GET /api/case-studies/:id` - 获取案例分享详情
- `POST /api/case-studies` - 创建案例分享
- `PUT /api/case-studies/:id` - 更新案例分享
- `DELETE /api/case-studies/:id` - 删除案例分享
- `GET /api/qa-articles` - 获取问答文章
- `GET /api/qa-articles/:id` - 获取问答文章详情
- `POST /api/qa-articles` - 创建问答文章
- `PUT /api/qa-articles/:id` - 更新问答文章
- `DELETE /api/qa-articles/:id` - 删除问答文章
- `POST /api/contact` - 提交联系表单
- `GET /api/contact` - 获取联系表单提交
- `POST /api/admin/login` - 管理员登录
- `POST /api/upload` - 上传文件

## 管理后台

管理后台位于 `admin` 目录，可通过浏览器访问 `http://localhost:3000/admin` 进行访问

## 注意事项

- 确保 MySQL 服务已启动
- 确保 `.env` 文件中的配置正确
- 开发环境下，服务会自动重启以响应代码变化
- 生产环境下，建议使用进程管理工具（如 PM2）来管理服务