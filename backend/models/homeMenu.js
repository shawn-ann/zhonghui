const pool = require('../config/db');

class HomeMenuModel {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM home_menus ORDER BY order_num ASC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM home_menus WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(title, iconUrl, content, orderNum) {
    const [result] = await pool.execute(
      'INSERT INTO home_menus (title, icon_url, content, order_num) VALUES (?, ?, ?, ?)',
      [title, iconUrl, content, orderNum]
    );
    return result.insertId;
  }

  static async update(id, title, iconUrl, content, orderNum) {
    await pool.execute(
      'UPDATE home_menus SET title = ?, icon_url = ?, content = ?, order_num = ? WHERE id = ?',
      [title, iconUrl, content, orderNum, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM home_menus WHERE id = ?', [id]);
  }
}

module.exports = HomeMenuModel;