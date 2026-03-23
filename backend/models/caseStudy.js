const pool = require('../config/db');

class CaseStudyModel {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM case_studies ORDER BY publish_date DESC');
    return rows;
  }

  static async getPaginated(page = 1, pageSize = 10) {
    // 确保参数是数字类型
    const pageNum = parseInt(page) || 1;
    const sizeNum = parseInt(pageSize) || 10;
    const offset = (pageNum - 1) * sizeNum;
    // 使用 query 而不是 execute，因为 execute 对 LIMIT/OFFSET 参数支持有问题
    const [rows] = await pool.query(
      'SELECT * FROM case_studies ORDER BY publish_date DESC LIMIT ? OFFSET ?',
      [sizeNum, offset]
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM case_studies WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(title, content, imageUrl, publishDate) {
    // 如果没有提供发布日期，使用当前日期和时间
    const currentDate = publishDate || new Date();
    // 确保参数不是 undefined
    const safeTitle = title || null;
    const safeContent = content || null;
    const safeImageUrl = imageUrl || null;
    const [result] = await pool.execute(
      'INSERT INTO case_studies (title, content, image_url, publish_date) VALUES (?, ?, ?, ?)',
      [safeTitle, safeContent, safeImageUrl, currentDate]
    );
    return result.insertId;
  }

  static async update(id, title, content, imageUrl) {
    // 只更新必要字段，不更新发布日期
    // 确保参数不是 undefined
    const safeTitle = title || null;
    const safeContent = content || null;
    const safeImageUrl = imageUrl || null;
    await pool.execute(
      'UPDATE case_studies SET title = ?, content = ?, image_url = ? WHERE id = ?',
      [safeTitle, safeContent, safeImageUrl, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM case_studies WHERE id = ?', [id]);
  }

  static async incrementViewCount(id) {
    await pool.execute('UPDATE case_studies SET view_count = view_count + 1 WHERE id = ?', [id]);
  }
}

module.exports = CaseStudyModel;