const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const workoutController = require("../controllers/workoutController");

router.use(authenticate);

router.get("/exercises", workoutController.getExercises);
router.get("/sessions", workoutController.getSessions);
router.post("/sessions", workoutController.createSession);
router.post("/sessions/:sessionId/logs", workoutController.addLog);
router.delete("/sessions/:id", workoutController.deleteSession);
router.get("/dashboard", workoutController.getDashboard);

module.exports = router;
