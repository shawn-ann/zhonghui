# AGENTS.md - 中汇项目开发指南

本文档为智能代理（AI Agent）提供项目开发规范和操作指南。

---

## 1. 项目概述

本项目是一个中汇企业官网系统，包含以下三个部分：

| 模块 | 目录 | 技术栈 | 外部访问路径 |
|------|------|--------|--------------|
| 后端服务 | `/backend` | Express.js + MySQL | https://www.chinaaupairs.com/miniprogram/api |
| 管理后台 | `/admin` | React + Vite | https://www.chinaaupairs.com/miniprogram/admin |
| 微信小程序 | `/miniprogram` | 微信小程序框架 | - |

### 1.1 URL 架构说明

系统部署在 `/miniprogram/` 子路径下，Nginx 负责路径转发：

| 外部访问路径 | 内部转发路径 | 说明 |
|--------------|--------------|------|
| `/miniprogram/api/*` | `/api/*` | 后端 API |
| `/miniprogram/admin/*` | `/admin/*` | 管理后台（React 静态文件） |
| `/miniprogram/uploads/*` | `/uploads/*` | 上传文件 |

---

## 2. 构建与运行命令

### 2.1 后端服务 (backend)

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置数据库
# 1. 确保 MySQL 服务已启动
# 2. 运行初始化脚本:
mysql -u root -p < config/init.sql
# 3. 修改 .env 文件中的数据库配置

# 开发环境（自动重启）
npm run dev

# 生产环境
npm start
```

### 2.2 管理后台 (admin)

管理后台为 React + Vite 应用，需要构建后部署：

```bash
# 进入管理后台目录
cd admin

# 安装依赖
npm install

# 开发环境
npm run dev

# 生产环境构建
npm run build
```

构建后的文件在 `dist` 目录，由后端服务托管：
- 访问地址: `http://localhost:3000/admin`
- 登录页面: `http://localhost:3000/admin/#/login`
- 生产访问: `https://www.chinaaupairs.com/miniprogram/admin`

### 2.3 微信小程序 (miniprogram)

使用微信开发者工具打开 `miniprogram` 目录进行开发调试。

### 2.4 测试命令

**注意**: 当前项目未配置单元测试框架，无自动化测试命令。

如需添加测试，建议：

```bash
# 安装 Jest
npm install --save-dev jest

# 添加测试脚本到 package.json
# "test": "jest",
# "test:watch": "jest --watch",
# "test:coverage": "jest --coverage"

# 运行单个测试文件
npm test -- --testPathPattern=filename.spec.js

# 或使用 Jest
npx jest path/to/test.spec.js
```

---

## 3. 代码风格指南

### 3.1 语言规范

- **后端**: 使用 JavaScript (ES6+)，采用 CommonJS 模块系统 (`require`/`module.exports`)
- **管理后台**: 原生 JavaScript (ES6+)
- **微信小程序**: 原生 JavaScript

### 3.2 导入/导出规范

**后端 (CommonJS)**:

```javascript
// 导入模块
const express = require('express');
const pool = require('../config/db');
const ArticleModel = require('../models/article');

// 导出路由
module.exports = router;
```

**命名导入**:

```javascript
const { QuillDeltaToHtmlConverter } = require('quill-delta-to-html');
```

### 3.3 格式化规范

- **缩进**: 2 空格
- **分号**: 必须使用分号
- **引号**: 单引号优先
- **逗号**: 尾随逗号（trailing comma）

```javascript
// Good
const app = express();
const { page, pageSize } = req.query;
const articles = await ArticleModel.getAll(articleType);

// Avoid
const app = express()
const { page, pageSize } = req.query
```

### 3.4 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `getArticleById`, `uploadDir` |
| 常量 | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `PORT` |
| 文件名 | kebab-case | `case-study.js`, `contact-submission.js` |
| 路由 | kebab-case | `/api/case-studies`, `/api/qa-articles` |
| 数据库表 | snake_case | `qa_articles`, `contact_submissions` |
| 数据库字段 | snake_case | `article_type`, `publish_date` |

### 3.5 类型规范

由于项目未使用 TypeScript，需遵循以下类型约定：

```javascript
// 明确变量类型意图
const articleId = parseInt(req.params.id, 10);  // 整数
const isPublished = Boolean(req.body.published); // 布尔值
const page = Number(req.query.page) || 1;         // 数字

// 数组和对象使用明确初始化
const articles = [];
const config = {};
```

### 3.6 错误处理规范

**后端 API 错误处理模式**:

```javascript
// 同步错误处理
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleModel.getById(id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error getting article:', error);
    res.status(500).json({ error: 'Failed to get article' });
  }
});
```

**关键点**:
- 所有 async 路由处理器必须使用 try-catch
- 返回具体错误信息时避免暴露敏感信息
- 使用适当的 HTTP 状态码 (200, 201, 400, 404, 500)
- 生产环境避免直接返回 error.stack

### 3.7 API 设计规范

**请求参数命名**:
- URL 参数: camelCase
- Query 参数: camelCase
- 请求体: snake_case (与数据库字段对应)

```javascript
// 路由定义
router.put('/:id', async (req, res) => {
  const { id } = req.params;              // URL 参数
  const { title, image_url } = req.body;   // 请求体 (snake_case)
});

// 响应返回
res.json({
  id: article.id,
  title: article.title,
  article_type: article.articleType,  // 转换为 snake_case
});
```

### 3.8 数据库操作规范

- 使用连接池 (`config/db.js`)
- 使用参数化查询防止 SQL 注入
- 异步操作必须使用 await

```javascript
// Good
const [rows] = await pool.execute(
  'SELECT * FROM articles WHERE id = ?',
  [id]
);

// Avoid
const query = `SELECT * FROM articles WHERE id = ${id}`;
```

### 3.9 中间件规范

- CORS: 使用 `cors` 中间件
- 请求体解析: `express.json()`, `express.urlencoded`
- 文件上传: 使用 `multer`

```javascript
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

### 3.10 日志规范

- 使用 `console.log` 进行开发调试
- 记录请求参数: `console.log('Request query:', req.query);`
- 记录错误: `console.error('Error message:', error);`

---

## 4. 目录结构

```
zhonghui/
├── backend/
│   ├── api/              # API 路由
│   │   ├── articles.js
│   │   ├── carousel.js
│   │   ├── caseStudy.js
│   │   ├── contactSubmission.js
│   │   ├── qaArticle.js
│   │   └── admin.js
│   ├── config/
│   │   └── db.js        # 数据库配置
│   ├── models/          # 数据模型
│   ├── wechat/         # 微信小程序专用接口
│   ├── uploads/         # 上传文件目录
│   ├── index.js         # 入口文件
│   └── .env             # 环境变量
├── admin/               # 管理后台 (静态文件)
├── miniprogram/         # 微信小程序
└── AGENTS.md           # 本文件
```

---

## 5. 常见任务指南

### 5.1 添加新 API 端点

1. 在 `backend/api/` 目录创建新路由文件
2. 在 `backend/index.js` 中引入并挂载路由
3. 遵循现有的错误处理模式

### 5.2 添加新数据库表

1. 在 `backend/config/init.sql` 中添加表结构
2. 在 `backend/models/` 中创建对应的数据模型
3. 更新 API 路由以支持新表的操作

### 5.3 添加新管理页面

1. 在 `admin/` 目录创建 HTML 文件
2. 在 `admin/js/` 目录创建对应的 JS 文件
3. 确保引用正确的 API 端点

---

## 6. 环境变量

后端 `.env` 文件配置项:

```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=zhonghui
UPLOAD_DIR=./uploads
```

---

## 7. 注意事项

1. **不要提交敏感信息**: 切勿将 `.env` 文件提交到 Git
2. **数据库初始化**: 每次部署时需运行 `config/init.sql`
3. **文件上传**: 确保 `uploads` 目录存在且有写权限
4. **端口占用**: 确保 3000 端口未被占用

---

## 8. 联系方式

如有疑问，请联系项目维护者。
