const pool = require('../config/db');

class AdminUserModel {
  static async getByUsername(username) {
    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    return rows[0];
  }

  static async create(username, password) {
    const [result] = await pool.execute(
      'INSERT INTO admin_users (username, password) VALUES (?, ?)',
      [username, password]
    );
    return result.insertId;
  }

  static async updatePassword(username, newPassword) {
    const [result] = await pool.execute(
      'UPDATE admin_users SET password = ? WHERE username = ?',
      [newPassword, username]
    );
    return result.affectedRows;
  }
}

module.exports = AdminUserModel;