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

  const schemaPath = path.join(__dirname, "../../../database/ddl.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  const schemaPool = new Pool(poolConfig);

  try {
    await schemaPool.query(schemaSql);
    console.log(`✅ Initialized PostgreSQL schema for ${databaseName}`);
  } catch (error) {
    if (!error?.message?.includes("already exists")) {
      console.error(
        "❌ Failed to initialize PostgreSQL schema:",
        error.message,
      );
    }
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
