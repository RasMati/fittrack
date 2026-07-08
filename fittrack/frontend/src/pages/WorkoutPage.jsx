import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { workoutService } from "../services/workoutService";
import { toast } from "react-toastify";

const WorkoutPage = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exercise_id: "",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await workoutService.getExercises();
      if (response.success) {
        setExercises(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
    }
  };

  const createSession = async () => {
    setLoading(true);
    try {
      const response = await workoutService.createSession({
        session_date: sessionDate,
        notes: notes,
      });
      if (response.success) {
        setSessionId(response.data.id);
        toast.success("Workout session created!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const addLog = async (e) => {
    e.preventDefault();
    if (!sessionId) {
      toast.warning("Please create a session first");
      return;
    }

    setLoading(true);
    try {
      const response = await workoutService.addLog(sessionId, {
        exercise_id: parseInt(formData.exercise_id),
        sets: parseInt(formData.sets),
        reps: parseInt(formData.reps),
        weight: parseFloat(formData.weight) || 0,
        notes: formData.notes,
      });
      if (response.success) {
        setLogs([...logs, response.data]);
        setFormData({
          exercise_id: "",
          sets: "",
          reps: "",
          weight: "",
          notes: "",
        });
        toast.success("Exercise logged!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log exercise");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!sessionId) {
    return (
      <div>
        <h1 className="mb-4">Start New Workout</h1>
        <div className="card">
          <div className="form-group">
            <label>Session Date</label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today?"
              rows="3"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={createSession}
            disabled={loading}
          >
            {loading ? "Creating..." : "Start Workout"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="mb-4">Workout Session</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/history")}
        >
          View History
        </button>
      </div>

      <div className="card">
        <p>
          <strong>Date:</strong> {sessionDate}
        </p>
        {notes && (
          <p>
            <strong>Notes:</strong> {notes}
          </p>
        )}
        <p>
          <strong>Exercises Logged:</strong> {logs.length}
        </p>
      </div>

      <div className="card">
        <h2>Log Exercise</h2>
        <form onSubmit={addLog}>
          <div className="form-group">
            <label>Exercise</label>
            <select
              name="exercise_id"
              value={formData.exercise_id}
              onChange={handleChange}
              required
            >
              <option value="">Select exercise...</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.category || "General"})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3">
            <div className="form-group">
              <label>Sets</label>
              <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                placeholder="e.g., 3"
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Reps</label>
              <input
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                placeholder="e.g., 10"
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Weight (lbs)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 135"
                step="0.5"
                min="0"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any notes about this set?"
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Logging..." : "Log Exercise"}
          </button>
        </form>
      </div>

      {logs.length > 0 && (
        <div className="card">
          <h2>Logged Exercises</h2>
          {logs.map((log, index) => {
            const exercise = exercises.find((e) => e.id === log.exercise_id);
            return (
              <div key={index} className="log-item">
                <div className="log-details">
                  <span className="log-exercise">
                    {exercise?.name || "Unknown"}
                  </span>
                  <span className="log-stats">
                    <span>{log.sets} sets</span>
                    <span>{log.reps} reps</span>
                    {log.weight > 0 && <span>{log.weight} lbs</span>}
                  </span>
                </div>
                {log.notes && (
                  <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {log.notes}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkoutPage;
