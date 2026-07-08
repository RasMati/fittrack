const pool = require("../config/database");
const logger = require("../config/logger");

class Exercise {
  static async findAll(filters = {}) {
    const client = await pool.connect();
    try {
      let query = "SELECT * FROM exercises";
      const values = [];
      const conditions = [];

      if (filters.category) {
        conditions.push(`category = $${values.length + 1}`);
        values.push(filters.category);
      }
      if (filters.muscle_group) {
        conditions.push(`muscle_group = $${values.length + 1}`);
        values.push(filters.muscle_group);
      }
      if (filters.search) {
        conditions.push(`name ILIKE $${values.length + 1}`);
        values.push(`%${filters.search}%`);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY name ASC";

      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      logger.error(`Error finding exercises: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const query = "SELECT * FROM exercises WHERE id = $1";
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error finding exercise: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Exercise;
