const WorkoutSession = require("../models/WorkoutSession");
const WorkoutLog = require("../models/WorkoutLog");
const Exercise = require("../models/Exercise");
const logger = require("../config/logger");

const getExercises = async (req, res) => {
  try {
    const { category, muscle_group, search } = req.query;
    const exercises = await Exercise.findAll({
      category,
      muscle_group,
      search,
    });
    res.json({
      success: true,
      data: exercises,
      count: exercises.length,
    });
  } catch (error) {
    logger.error(`Get exercises error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const { limit = 30, startDate, endDate } = req.query;
    const sessions = await WorkoutSession.findByUser(req.user.id, {
      limit: parseInt(limit),
      startDate,
      endDate,
    });
    res.json({
      success: true,
      data: sessions,
      count: sessions.length,
    });
  } catch (error) {
    logger.error(`Get sessions error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout sessions",
    });
  }
};

const createSession = async (req, res) => {
  try {
    const { session_date, notes } = req.body;

    const session = await WorkoutSession.create({
      user_id: req.user.id,
      session_date: session_date || new Date().toISOString().split("T")[0],
      notes,
    });

    logger.info(`Session created by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: "Workout session created",
      data: session,
    });
  } catch (error) {
    logger.error(`Create session error: ${error.message}`);

    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "You already have a session for this date",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create workout session",
    });
  }
};

const addLog = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { exercise_id, sets, reps, weight, notes } = req.body;

    const session = await WorkoutSession.findById(sessionId, req.user.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Workout session not found",
      });
    }

    const exercise = await Exercise.findById(exercise_id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    const log = await WorkoutLog.create({
      session_id: sessionId,
      exercise_id,
      sets,
      reps,
      weight: weight || 0,
      notes,
    });

    logger.info(`Log added to session ${sessionId}`);

    res.status(201).json({
      success: true,
      message: "Exercise log added",
      data: log,
    });
  } catch (error) {
    logger.error(`Add log error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to add exercise log",
    });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await WorkoutSession.delete(id, req.user.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Workout session not found",
      });
    }

    logger.info(`Session deleted by user ${req.user.id}: ${id}`);

    res.json({
      success: true,
      message: "Workout session deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete session error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete workout session",
    });
  }
};

const getDashboard = async (req, res) => {
  try {
    const sessions = await WorkoutSession.findByUser(req.user.id);
    const totalWorkouts = sessions.length;
    const totalLogs = sessions.reduce(
      (acc, session) => acc + session.logs.length,
      0,
    );
    const recentWorkouts = sessions.slice(0, 5);

    res.json({
      success: true,
      data: {
        total_workouts: totalWorkouts,
        total_logs: totalLogs,
        recent_workouts: recentWorkouts,
      },
    });
  } catch (error) {
    logger.error(`Dashboard error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard stats",
    });
  }
};

module.exports = {
  getExercises,
  getSessions,
  createSession,
  addLog,
  deleteSession,
  getDashboard,
};
