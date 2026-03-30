-- Migration: Convert admin password to MD5
-- Date: 2026-03-30
-- Description: 将 admin_users 表中的密码转换为 MD5 加密

-- 当前密码是 "password"，MD5 值为 "5f4dcc3b5aa765d61d8327deb882cf99"
UPDATE admin_users SET password = '5f4dcc3b5aa765d61d8327deb882cf99' WHERE username = 'admin';

-- 验证结果
SELECT id, username, password FROM admin_users;
