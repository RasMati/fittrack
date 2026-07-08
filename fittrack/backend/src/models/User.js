const pool = require("../config/database");
const bcrypt = require("bcrypt");
const logger = require("../config/logger");

class User {
  static async create({ username, email, password }) {
    const client = await pool.connect();
    try {
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_ROUNDS || 10),
      );

      const query = `
                INSERT INTO users (username, email, password_hash)
                VALUES ($1, $2, $3)
                RETURNING id, username, email, created_at
            `;

      const result = await client.query(query, [
        username,
        email,
        hashedPassword,
      ]);
      logger.info(`User created: ${username}`);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByEmail(email) {
    const client = await pool.connect();
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await client.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const query =
        "SELECT id, username, email, created_at FROM users WHERE id = $1";
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error finding user by ID: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
