import React, { useState, useEffect } from "react";
import { workoutService } from "../services/workoutService";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchExercises();
  }, [search, category]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const response = await workoutService.getExercises(params);
      if (response.success) {
        setExercises(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    ...new Set(exercises.map((e) => e.category).filter(Boolean)),
  ];

  if (loading) {
    return <div className="loading">Loading exercises...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Exercise Library</h1>

      <div
        className="card"
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
      >
        <div
          className="form-group"
          style={{ flex: 1, minWidth: "200px", marginBottom: 0 }}
        >
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div
          className="form-group"
          style={{ minWidth: "150px", marginBottom: 0 }}
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setSearch("");
            setCategory("");
          }}
        >
          Clear
        </button>
      </div>

      <div className="card">
        <p className="text-muted mb-2">Showing {exercises.length} exercises</p>
        {exercises.length > 0 ? (
          <div>
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-item">
                <span className="exercise-name">{exercise.name}</span>
                <div className="exercise-tags">
                  {exercise.category && (
                    <span className="tag">{exercise.category}</span>
                  )}
                  {exercise.muscle_group && (
                    <span className="tag">{exercise.muscle_group}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No exercises found</p>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage;
