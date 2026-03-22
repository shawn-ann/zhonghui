const pool = require('../config/db');

class ContactSubmissionModel {
  static async create(name, birthday, intendedPrograms, highestEducation) {
    const [result] = await pool.execute(
      'INSERT INTO contact_submissions (name, birthday, intended_programs, highest_education) VALUES (?, ?, ?, ?)',
      [name, birthday, intendedPrograms, highestEducation]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    return rows;
  }
}

module.exports = ContactSubmissionModel;