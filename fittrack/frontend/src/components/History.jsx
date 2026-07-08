import React from "react";

const History = ({ sessions = [], onDelete = () => {} }) => {
  if (sessions.length === 0) {
    return <p className="text-muted">No workout history available.</p>;
  }

  return (
    <div>
      {sessions.map((session) => (
        <div key={session.id} className="card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3>{session.session_date}</h3>
              {session.notes && <p className="text-muted">{session.notes}</p>}
              <div className="text-muted">
                {session.logs?.length || 0} exercises
              </div>
            </div>
            <div>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(session.id)}
              >
                Delete
              </button>
            </div>
          </div>
          {session.logs && session.logs.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              {session.logs.map((log, i) => (
                <div key={i} className="log-item">
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
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default History;
