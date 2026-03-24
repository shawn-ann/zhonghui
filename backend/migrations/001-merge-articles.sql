-- 1. 创建新的文章表
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    article_type ENUM('case', 'qa') NOT NULL,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 从 case_studies 表迁移数据到 articles 表
INSERT INTO articles (title, content, image_url, article_type, publish_date, view_count)
SELECT title, content, image_url, 'case' as article_type, publish_date, view_count
FROM case_studies;

-- 3. 从 qa_articles 表迁移数据到 articles 表
-- 假设 qa_articles 表存在且结构类似
INSERT INTO articles (title, content, image_url, article_type, publish_date, view_count)
SELECT title, content, image_url, 'qa' as article_type, publish_date, view_count
FROM qa_articles;

-- 4. 保留原表作为备份（可选）
-- DROP TABLE IF EXISTS case_studies;
-- DROP TABLE IF EXISTS qa_articles;