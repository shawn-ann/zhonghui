const pool = require('../config/db');

class CaseStudyModel {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM case_studies ORDER BY publish_date DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM case_studies WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(title, content, imageUrl, publishDate) {
    // 如果没有提供发布日期，使用当前日期和时间
    const currentDate = publishDate || new Date();
    const [result] = await pool.execute(
      'INSERT INTO case_studies (title, content, image_url, publish_date) VALUES (?, ?, ?, ?)',
      [title, content, imageUrl, currentDate]
    );
    return result.insertId;
  }

  static async update(id, title, content, imageUrl, publishDate) {
    // 如果没有提供发布日期，使用当前日期和时间
    const currentDate = publishDate || new Date();
    await pool.execute(
      'UPDATE case_studies SET title = ?, content = ?, image_url = ?, publish_date = ? WHERE id = ?',
      [title, content, imageUrl, currentDate, id]
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