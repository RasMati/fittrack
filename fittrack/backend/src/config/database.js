const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const databaseName = (process.env.DB_NAME || "fittrack").trim();

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: databaseName,
  max: 20,
  idleTimeoutMillis: 30000,
};

const pool = new Pool(poolConfig);

async function initializeDatabase() {
  const adminPool = new Pool({
    ...poolConfig,
    database: "postgres",
  });

  try {
    await adminPool.query("SELECT 1");
    const existingDb = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [databaseName],
    );

    if (existingDb.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`✅ Created PostgreSQL database: ${databaseName}`);
    }
  } catch (error) {
    if (error?.code !== "42P04") {
      console.error(
        "❌ Failed to ensure PostgreSQL database exists:",
        error.message,
      );
    }
  } finally {
    await adminPool.end();
  }

  const schemaPool = new Pool(poolConfig);

  try {
    await schemaPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        muscle_group VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workout_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_date DATE NOT NULL DEFAULT CURRENT_DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_date UNIQUE(user_id, session_date)
      );

      CREATE TABLE IF NOT EXISTS workout_logs (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
        exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
        sets INTEGER NOT NULL CHECK (sets > 0),
        reps INTEGER NOT NULL CHECK (reps > 0),
        weight DECIMAL(8,2) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON workout_sessions(user_id, session_date);
      CREATE INDEX IF NOT EXISTS idx_workout_logs_session ON workout_logs(session_id);
      CREATE INDEX IF NOT EXISTS idx_workout_logs_exercise ON workout_logs(exercise_id);
    `);

    const exerciseCountResult = await schemaPool.query(
      "SELECT COUNT(*)::int AS count FROM exercises",
    );

    if (exerciseCountResult.rows[0].count === 0) {
      const seedPath = path.join(__dirname, "../../../database/seed.sql");
      const seedSql = fs.readFileSync(seedPath, "utf8");
      await schemaPool.query(seedSql);
      console.log(`✅ Seeded exercise library for ${databaseName}`);
    }

    console.log(`✅ Initialized PostgreSQL schema for ${databaseName}`);
  } catch (error) {
    console.error("❌ Failed to initialize PostgreSQL schema:", error.message);
  } finally {
    await schemaPool.end();
  }
}

initializeDatabase().catch((error) => {
  console.error("❌ Database initialization failed:", error.message);
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Database error:", err);
});

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;
