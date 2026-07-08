import React from "react";

const Dashboard = ({ stats = {} }) => {
  const { total_workouts = 0, total_logs = 0, recent_workouts = [] } = stats;

  return (
    <div>
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
        <h2>Recent Workouts</h2>
        {recent_workouts.length === 0 ? (
          <p className="text-muted">No recent workouts</p>
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
