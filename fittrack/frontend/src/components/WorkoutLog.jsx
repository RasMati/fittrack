import React from "react";

const WorkoutLog = ({ log = {} }) => {
  const exercise = log.exercise || log.exercise_name || {};

  return (
    <div className="log-item">
      <div className="log-details">
        <span className="log-exercise">{exercise.name || "Exercise"}</span>
        <span className="log-stats">
          <span>{log.sets} sets</span>
          <span>{log.reps} reps</span>
          {log.weight > 0 && <span>{log.weight} lbs</span>}
        </span>
      </div>
      {log.notes && <div className="text-muted">{log.notes}</div>}
    </div>
  );
};

export default WorkoutLog;
