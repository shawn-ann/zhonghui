const pool = require('../config/db');

class ArticleModel {
  static async getAll(articleType = null) {
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];
    
    if (articleType) {
      query += ' AND article_type = ?';
      params.push(articleType);
    }
    
    query += ' ORDER BY publish_date DESC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getPaginated(page = 1, pageSize = 10, articleType = null, keyword = null) {
    // 确保参数是数字类型
    const pageNum = parseInt(page) || 1;
    const sizeNum = parseInt(pageSize) || 10;
    const offset = (pageNum - 1) * sizeNum;
    
    // 构建查询条件
    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    
    if (articleType) {
      whereClause += ' AND article_type = ?';
      queryParams.push(articleType);
    }
    
    if (keyword && keyword.trim() !== '') {
      whereClause += ' AND title LIKE ?';
      queryParams.push(`%${keyword}%`);
    }
    
    // 获取总记录数
    const countQuery = `SELECT COUNT(*) as total FROM articles ${whereClause}`;
    const [countResult] = await pool.query(countQuery, queryParams);
    const totalCount = countResult[0].total;
    
    // 获取分页数据
    const dataQuery = `SELECT * FROM articles ${whereClause} ORDER BY publish_date DESC LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(dataQuery, [...queryParams, sizeNum, offset]);
    
    return { data: rows, total: totalCount };
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(title, content, imageUrl, articleType, publishDate) {
    // 如果没有提供发布日期，使用当前日期和时间
    const currentDate = publishDate || new Date();
    // 确保参数不是 undefined
    const safeTitle = title || null;
    const safeContent = content || null;
    const safeImageUrl = imageUrl || null;
    const [result] = await pool.execute(
      'INSERT INTO articles (title, content, image_url, article_type, publish_date) VALUES (?, ?, ?, ?, ?)',
      [safeTitle, safeContent, safeImageUrl, articleType, currentDate]
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
      'UPDATE articles SET title = ?, content = ?, image_url = ? WHERE id = ?',
      [safeTitle, safeContent, safeImageUrl, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM articles WHERE id = ?', [id]);
  }

  static async incrementViewCount(id) {
    await pool.execute('UPDATE articles SET view_count = view_count + 1 WHERE id = ?', [id]);
  }
}

module.exports = ArticleModel;