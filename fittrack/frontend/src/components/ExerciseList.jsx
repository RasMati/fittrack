import React from "react";

const ExerciseList = ({ exercises = [] }) => {
  if (exercises.length === 0) {
    return <p className="text-muted">No exercises available.</p>;
  }

  return (
    <div>
      {exercises.map((ex) => (
        <div key={ex.id} className="exercise-item">
          <div className="exercise-name">{ex.name}</div>
          <div className="exercise-tags">
            {ex.category && <span className="tag">{ex.category}</span>}
            {ex.muscle_group && <span className="tag">{ex.muscle_group}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
