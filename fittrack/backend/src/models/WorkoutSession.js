const pool = require("../config/database");
const logger = require("../config/logger");

class WorkoutSession {
  static async findByUser(userId, options = {}) {
    const client = await pool.connect();
    try {
      let query = `
                SELECT ws.*, 
                       COALESCE(
                           json_agg(
                               json_build_object(
                                   'id', wl.id,
                                   'sets', wl.sets,
                                   'reps', wl.reps,
                                   'weight', wl.weight,
                                   'notes', wl.notes,
                                   'created_at', wl.created_at,
                                   'exercise', json_build_object(
                                       'id', e.id,
                                       'name', e.name,
                                       'category', e.category,
                                       'muscle_group', e.muscle_group
                                   )
                               ) ORDER BY wl.created_at
                           ) FILTER (WHERE wl.id IS NOT NULL), '[]'
                       ) as logs
                FROM workout_sessions ws
                LEFT JOIN workout_logs wl ON ws.id = wl.session_id
                LEFT JOIN exercises e ON wl.exercise_id = e.id
                WHERE ws.user_id = $1
            `;

      const values = [userId];
      let paramIndex = 2;

      if (options.startDate) {
        query += ` AND ws.session_date >= $${paramIndex++}`;
        values.push(options.startDate);
      }
      if (options.endDate) {
        query += ` AND ws.session_date <= $${paramIndex++}`;
        values.push(options.endDate);
      }

      query += ` GROUP BY ws.id ORDER BY ws.session_date DESC`;

      if (options.limit) {
        query += ` LIMIT $${paramIndex++}`;
        values.push(options.limit);
      }
      if (options.offset) {
        query += ` OFFSET $${paramIndex++}`;
        values.push(options.offset);
      }

      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      logger.error(`Error finding sessions: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id, userId) {
    const client = await pool.connect();
    try {
      const query = `
                SELECT ws.*, 
                       COALESCE(
                           json_agg(
                               json_build_object(
                                   'id', wl.id,
                                   'sets', wl.sets,
                                   'reps', wl.reps,
                                   'weight', wl.weight,
                                   'notes', wl.notes,
                                   'created_at', wl.created_at,
                                   'exercise', json_build_object(
                                       'id', e.id,
                                       'name', e.name,
                                       'category', e.category,
                                       'muscle_group', e.muscle_group
                                   )
                               ) ORDER BY wl.created_at
                           ) FILTER (WHERE wl.id IS NOT NULL), '[]'
                       ) as logs
                FROM workout_sessions ws
                LEFT JOIN workout_logs wl ON ws.id = wl.session_id
                LEFT JOIN exercises e ON wl.exercise_id = e.id
                WHERE ws.id = $1 AND ws.user_id = $2
                GROUP BY ws.id
            `;

      const result = await client.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error finding session: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  static async create({ user_id, session_date, notes }) {
    const client = await pool.connect();
    try {
      const query = `
                INSERT INTO workout_sessions (user_id, session_date, notes)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
      const result = await client.query(query, [
        user_id,
        session_date || new Date().toISOString().split("T")[0],
        notes,
      ]);
      logger.info(`Session created for user ${user_id}`);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error creating session: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id, userId) {
    const client = await pool.connect();
    try {
      const query =
        "DELETE FROM workout_sessions WHERE id = $1 AND user_id = $2 RETURNING id";
      const result = await client.query(query, [id, userId]);
      logger.info(`Session deleted: ${id}`);
      return result.rowCount > 0;
    } catch (error) {
      logger.error(`Error deleting session: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = WorkoutSession;
