const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const uploadDir = process.env.UPLOAD_DIR || './uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create upload directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from upload directory
app.use('/uploads', express.static(uploadDir));

// Serve static files from admin directory (React build output)
app.use('/admin', express.static(path.join(__dirname, '../admin/dist')));
app.use('/admin', express.static(path.join(__dirname, '../admin/dist/assets')));

// SPA fallback - 让 React Router 处理路由
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/dist/index.html'));
});

// API routes
const carouselRouter = require('./api/carousel');
const caseStudyRouter = require('./api/caseStudy');
const qaArticleRouter = require('./api/qaArticle');
const contactSubmissionRouter = require('./api/contactSubmission');
const adminRouter = require('./api/admin');
const articlesRouter = require('./api/articles');
const homeMenuRouter = require('./api/homeMenu');

// 微信小程序路由
const wechatContactRouter = require('./wechat/contact');

// 小程序专用接口（返回HTML内容）- 放在API路由之前
const wechatArticleRouter = require('./wechat/article');
app.use('/wechat/articles', wechatArticleRouter);

// API routes
app.use('/api/carousel', carouselRouter);
app.use('/api/case-studies', caseStudyRouter);
app.use('/api/qa-articles', qaArticleRouter);
app.use('/api/contact', contactSubmissionRouter);
app.use('/api/admin', adminRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/home-menus', homeMenuRouter);

// 微信小程序路由
app.use('/wechat', wechatContactRouter);

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});



// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;