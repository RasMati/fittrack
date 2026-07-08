const pool = require("../config/database");
const bcrypt = require("bcrypt");
const logger = require("../config/logger");

class User {
  static #memoryUsers = new Map();
  static #memoryUsersById = new Map();
  static #nextMemoryId = 1;
  static #useMemoryFallback = false;

  static shouldUseMemoryFallback(error) {
    const message = error?.message || "";
    return (
      error?.code === "ECONNREFUSED" ||
      error?.code === "ENOTFOUND" ||
      error?.code === "28P01" ||
      error?.code === "3D000" ||
      error?.code === "42P01" ||
      message.includes("does not exist") ||
      message.includes("connect ECONNREFUSED") ||
      message.includes("password authentication failed")
    );
  }

  static createMemoryUser({ username, email, password }) {
    const existingUser = this.findMemoryByEmail(email);
    if (existingUser) {
      const duplicateError = new Error("User already exists");
      duplicateError.code = "23505";
      throw duplicateError;
    }

    const user = {
      id: this.#nextMemoryId++,
      username,
      email,
      password_hash: bcrypt.hashSync(
        password,
        parseInt(process.env.BCRYPT_ROUNDS || 10),
      ),
      created_at: new Date().toISOString(),
    };

    this.#memoryUsers.set(email.toLowerCase(), user);
    this.#memoryUsersById.set(user.id, user);
    return user;
  }

  static findMemoryByEmail(email) {
    return this.#memoryUsers.get(email.toLowerCase()) || null;
  }

  static findMemoryById(id) {
    return this.#memoryUsersById.get(id) || null;
  }

  static async create({ username, email, password }) {
    if (this.#useMemoryFallback) {
      return this.createMemoryUser({ username, email, password });
    }

    let client;
    try {
      client = await pool.connect();
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
      if (this.shouldUseMemoryFallback(error)) {
        this.#useMemoryFallback = true;
        logger.warn("Falling back to in-memory user store");
        return this.createMemoryUser({ username, email, password });
      }
      logger.error(`Error creating user: ${error.message}`);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  static async findByEmail(email) {
    if (this.#useMemoryFallback) {
      return this.findMemoryByEmail(email);
    }

    let client;
    try {
      client = await pool.connect();
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await client.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      if (this.shouldUseMemoryFallback(error)) {
        this.#useMemoryFallback = true;
        logger.warn("Falling back to in-memory user store");
        return this.findMemoryByEmail(email);
      }
      logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  static async findById(id) {
    if (this.#useMemoryFallback) {
      return this.findMemoryById(id);
    }

    let client;
    try {
      client = await pool.connect();
      const query =
        "SELECT id, username, email, created_at FROM users WHERE id = $1";
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      if (this.shouldUseMemoryFallback(error)) {
        this.#useMemoryFallback = true;
        logger.warn("Falling back to in-memory user store");
        return this.findMemoryById(id);
      }
      logger.error(`Error finding user by ID: ${error.message}`);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
