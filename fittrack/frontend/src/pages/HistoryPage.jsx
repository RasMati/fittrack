import React, { useState, useEffect } from "react";
import { workoutService } from "../services/workoutService";
import { toast } from "react-toastify";

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await workoutService.getSessions({ limit: 50 });
      if (response.success) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this workout session?")
    ) {
      return;
    }

    setDeleting(id);
    try {
      const response = await workoutService.deleteSession(id);
      if (response.success) {
        setSessions(sessions.filter((s) => s.id !== id));
        toast.success("Workout session deleted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete session");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="loading">Loading workout history...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Workout History</h1>

      {sessions.length > 0 ? (
        <div>
          {sessions.map((session) => (
            <div key={session.id} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h3>{formatDate(session.session_date)}</h3>
                  {session.notes && (
                    <p className="text-muted">{session.notes}</p>
                  )}
                  <div style={{ marginTop: "0.5rem" }}>
                    <span className="text-muted">
                      {session.logs?.length || 0} exercises logged
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(session.id)}
                  disabled={deleting === session.id}
                  style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}
                >
                  {deleting === session.id ? "Deleting..." : "Delete"}
                </button>
              </div>

              {session.logs && session.logs.length > 0 && (
                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  {session.logs.map((log, index) => (
                    <div key={index} className="log-item">
                      <div className="log-details">
                        <span className="log-exercise">
                          {log.exercise?.name || "Unknown"}
                        </span>
                        <span className="log-stats">
                          <span>{log.sets} sets</span>
                          <span>{log.reps} reps</span>
                          {log.weight > 0 && <span>{log.weight} lbs</span>}
                        </span>
                      </div>
                      {log.notes && (
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {log.notes}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <p className="text-muted">No workout sessions found.</p>
          <a href="/workout" className="btn btn-primary mt-2">
            Start Your First Workout
          </a>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
