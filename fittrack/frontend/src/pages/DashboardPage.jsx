import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { workoutService } from "../services/workoutService";
import { useAuth } from "../hooks/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await workoutService.getDashboard();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Welcome back, {user?.username}! 👋</h1>

      <div className="grid grid-cols-3 mb-4">
        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-value">{stats?.total_workouts || 0}</div>
          <div className="stat-label">Total Workouts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats?.total_logs || 0}</div>
          <div className="stat-label">Exercises Logged</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-value">
            {stats?.recent_workouts?.length || 0}
          </div>
          <div className="stat-label">Recent Workouts</div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h2>Recent Workouts</h2>
          {stats?.recent_workouts?.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {stats.recent_workouts.map((session) => (
                <li key={session.id} className="session-item">
                  <div className="session-header">
                    <span className="session-date">
                      📅 {session.session_date}
                    </span>
                    <span className="session-exercises">
                      {session.logs?.length || 0} exercises
                    </span>
                  </div>
                  {session.notes && (
                    <div
                      className="text-muted"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {session.notes}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">
              No workouts yet. Start your first workout!
            </p>
          )}
        </div>

        <div className="card">
          <h2>Quick Actions</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <Link
              to="/workout"
              className="btn btn-primary btn-block text-center"
            >
              Start New Workout
            </Link>
            <Link
              to="/exercises"
              className="btn btn-secondary btn-block text-center"
            >
              Browse Exercises
            </Link>
            <Link
              to="/history"
              className="btn btn-secondary btn-block text-center"
            >
              View History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
