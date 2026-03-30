const pool = require('../config/db');

class CarouselModel {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM carousel_images ORDER BY order_num ASC');
    return rows;
  }

  static async create(imageUrl, title, orderNum) {
    const [result] = await pool.execute(
      'INSERT INTO carousel_images (image_url, title, order_num) VALUES (?, ?, ?)',
      [imageUrl, title, orderNum]
    );
    return result.insertId;
  }

  static async update(id, imageUrl, title, orderNum) {
    await pool.execute(
      'UPDATE carousel_images SET image_url = ?, title = ?, order_num = ? WHERE id = ?',
      [imageUrl, title, orderNum, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM carousel_images WHERE id = ?', [id]);
  }
}

module.exports = CarouselModel;