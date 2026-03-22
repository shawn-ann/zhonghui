const pool = require('../config/db');

class CarouselModel {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM carousel_images ORDER BY order_num ASC');
    return rows;
  }

  static async create(imageUrl, title, orderNum, content) {
    const [result] = await pool.execute(
      'INSERT INTO carousel_images (image_url, title, order_num, content) VALUES (?, ?, ?, ?)',
      [imageUrl, title, orderNum, content]
    );
    return result.insertId;
  }

  static async update(id, imageUrl, title, orderNum, content) {
    await pool.execute(
      'UPDATE carousel_images SET image_url = ?, title = ?, order_num = ?, content = ? WHERE id = ?',
      [imageUrl, title, orderNum, content, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM carousel_images WHERE id = ?', [id]);
  }
}

module.exports = CarouselModel;