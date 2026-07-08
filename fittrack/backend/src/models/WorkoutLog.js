const pool = require("../config/database");
const logger = require("../config/logger");

class WorkoutLog {
  static async create({ session_id, exercise_id, sets, reps, weight, notes }) {
    const client = await pool.connect();
    try {
      const query = `
                INSERT INTO workout_logs (session_id, exercise_id, sets, reps, weight, notes)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
      const result = await client.query(query, [
        session_id,
        exercise_id,
        sets,
        reps,
        weight || 0,
        notes,
      ]);
      logger.info(`Log created for session ${session_id}`);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error creating log: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id, userId) {
    const client = await pool.connect();
    try {
      const query = `
                DELETE FROM workout_logs wl
                USING workout_sessions ws
                WHERE wl.id = $1 
                AND wl.session_id = ws.id 
                AND ws.user_id = $2
                RETURNING wl.id
            `;
      const result = await client.query(query, [id, userId]);
      logger.info(`Log deleted: ${id}`);
      return result.rowCount > 0;
    } catch (error) {
      logger.error(`Error deleting log: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = WorkoutLog;
