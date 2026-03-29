// contact.js
const pool = require('../config/db');

class ContactSubmissions {
  // 创建新的联系表单
  static async create(contactData) {
    const { name, birthday, projects, otherProject, education, conditions, englishLevel, englishScore, childcareExp, city, contact } = contactData;
    
    const query = `
      INSERT INTO contact_submissions (name, birthday, intended_programs, other_project, highest_education, conditions, english_level, english_score, childcare_exp, city, contact)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const [result] = await pool.query(query, [name, birthday, projects, otherProject, education, conditions, englishLevel, englishScore, childcareExp, city, contact]);
      return { id: result.insertId, ...contactData };
    } catch (error) {
      throw new Error('Failed to create contact: ' + error.message);
    }
  }

  // 获取联系表单列表（带分页）
  static async getPaginated(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    
    const countQuery = 'SELECT COUNT(*) as total FROM contact_submissions';
    const listQuery = `
      SELECT * FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const [countResult] = await pool.query(countQuery);
      const [contacts] = await pool.query(listQuery, [pageSize, offset]);
      
      return {
        contacts,
        total: countResult[0].total,
        page,
        pageSize,
        totalPages: Math.ceil(countResult[0].total / pageSize)
      };
    } catch (error) {
      throw new Error('Failed to get contacts: ' + error.message);
    }
  }

  // 根据ID获取联系表单
  static async getById(id) {
    const query = 'SELECT * FROM contact_submissions WHERE id = ?';
    
    try {
      const [result] = await pool.query(query, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error('Failed to get contact: ' + error.message);
    }
  }

  // 删除联系表单
  static async delete(id) {
    const query = 'DELETE FROM contact_submissions WHERE id = ?';
    
    try {
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to delete contact: ' + error.message);
    }
  }
}

module.exports = ContactSubmissions;
