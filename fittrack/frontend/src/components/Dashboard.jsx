import React from "react";

const Dashboard = ({ stats = {} }) => {
  const { total_workouts = 0, total_logs = 0, recent_workouts = [] } = stats;

  return (
    <div>
      <div className="card hero-panel">
        <div>
          <p
            className="text-muted"
            style={{ marginBottom: "0.35rem", color: "rgba(255,255,255,0.8)" }}
          >
            Today’s momentum
          </p>
          <h2>Welcome back to your fitness journey.</h2>
          <p>
            Track progress, stay consistent, and keep every session moving
            forward.
          </p>
        </div>
        <div className="hero-pill">🔥 Consistency beats intensity</div>
      </div>

      <div className="grid grid-cols-3 mb-4">
        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-value">{total_workouts}</div>
          <div className="stat-label">Total Workouts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{total_logs}</div>
          <div className="stat-label">Exercises Logged</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-value">{recent_workouts.length}</div>
          <div className="stat-label">Recent Workouts</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "0.75rem" }}>Recent Workouts</h2>
        {recent_workouts.length === 0 ? (
          <p className="text-muted">
            No recent workouts yet. Start one and it will show up here.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recent_workouts.map((s) => (
              <li key={s.id} className="session-item">
                <div className="session-header">
                  <span className="session-date">📅 {s.session_date}</span>
                  <span className="session-exercises">
                    {s.logs?.length || 0} exercises
                  </span>
                </div>
                {s.notes && <div className="text-muted">{s.notes}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
