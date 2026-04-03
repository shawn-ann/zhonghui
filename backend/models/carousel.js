const pool = require('../config/db');

class CarouselModel {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM carousel_images ORDER BY order_num ASC');
    return rows;
  }

  static async create(imageUrl, title, articleUrl, orderNum) {
    const [result] = await pool.execute(
      'INSERT INTO carousel_images (image_url, title, article_url, order_num) VALUES (?, ?, ?, ?)',
      [imageUrl, title, articleUrl, orderNum]
    );
    return result.insertId;
  }

  static async update(id, imageUrl, title, articleUrl, orderNum) {
    await pool.execute(
      'UPDATE carousel_images SET image_url = ?, title = ?, article_url = ?, order_num = ? WHERE id = ?',
      [imageUrl, title, articleUrl, orderNum, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM carousel_images WHERE id = ?', [id]);
  }
}

module.exports = CarouselModel;