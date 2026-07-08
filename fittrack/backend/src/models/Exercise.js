const pool = require("../config/database");
const logger = require("../config/logger");

class Exercise {
  static #memoryExercises = [
    { id: 1, name: "Push Ups", category: "Strength", muscle_group: "Chest" },
    { id: 2, name: "Squats", category: "Strength", muscle_group: "Legs" },
    { id: 3, name: "Plank", category: "Core", muscle_group: "Core" },
  ];

  static #useMemoryFallback = false;

  static shouldUseMemoryFallback(error) {
    const message = error?.message || "";
    return (
      error?.code === "ECONNREFUSED" ||
      error?.code === "3D000" ||
      error?.code === "28P01" ||
      message.includes("does not exist") ||
      message.includes("connect ECONNREFUSED")
    );
  }

  static async findAll(filters = {}) {
    if (this.#useMemoryFallback) {
      let exercises = [...this.#memoryExercises];
      if (filters.category) {
        exercises = exercises.filter(
          (exercise) => exercise.category === filters.category,
        );
      }
      if (filters.muscle_group) {
        exercises = exercises.filter(
          (exercise) => exercise.muscle_group === filters.muscle_group,
        );
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        exercises = exercises.filter((exercise) =>
          exercise.name.toLowerCase().includes(search),
        );
      }
      return exercises.sort((a, b) => a.name.localeCompare(b.name));
    }

    let client;
    try {
      client = await pool.connect();
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
      if (this.shouldUseMemoryFallback(error)) {
        this.#useMemoryFallback = true;
        logger.warn("Falling back to in-memory exercises");
        return this.findAll(filters);
      }
      logger.error(`Error finding exercises: ${error.message}`);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  static async findById(id) {
    if (this.#useMemoryFallback) {
      return (
        this.#memoryExercises.find((exercise) => exercise.id === Number(id)) ||
        null
      );
    }

    let client;
    try {
      client = await pool.connect();
      const query = "SELECT * FROM exercises WHERE id = $1";
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      if (this.shouldUseMemoryFallback(error)) {
        this.#useMemoryFallback = true;
        logger.warn("Falling back to in-memory exercises");
        return this.findById(id);
      }
      logger.error(`Error finding exercise: ${error.message}`);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}

module.exports = Exercise;
