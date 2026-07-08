import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <section className="landing-hero">
        <div className="landing-panel">
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "0.8rem",
            }}
          >
            Fitness, simplified
          </p>
          <h1>
            Build stronger habits with a workout experience you’ll actually
            enjoy.
          </h1>
          <p>
            Track workouts, explore your exercise library, and stay motivated
            with a calm, beautiful dashboard designed to make progress feel
            effortless.
          </p>
          <div className="landing-actions">
            <Link to="/register" className="btn btn-primary">
              Create account
            </Link>
            <Link
              to="/login"
              className="btn btn-secondary"
              style={{ color: "#111827" }}
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="landing-card">
          <h3 style={{ marginBottom: "0.75rem" }}>Why people love FitTrack</h3>
          <ul
            style={{ paddingLeft: "1rem", color: "#475569", lineHeight: "1.7" }}
          >
            <li>Clean, motivating dashboard experience</li>
            <li>Built-in exercise library for quick planning</li>
            <li>Simple workout logging and history tracking</li>
            <li>Made to feel calm, modern, and motivating</li>
          </ul>
        </div>
      </section>

      <section className="landing-grid">
        <div className="landing-feature">
          <h3>⚡ Fast setup</h3>
          <p>
            Start quickly with a smooth sign-up flow and an experience that
            feels effortless.
          </p>
        </div>
        <div className="landing-feature">
          <h3>📈 Progress at a glance</h3>
          <p>
            See your recent workouts and training activity in one beautiful
            overview.
          </p>
        </div>
        <div className="landing-feature">
          <h3>💡 Habit-focused</h3>
          <p>
            Stay inspired with a simple product designed to support consistency
            over complexity.
          </p>
        </div>
      </section>

      <section className="card about-section">
        <div className="about-content">
          <div>
            <h3>About FitTrack</h3>
            <p className="text-muted">
              FitTrack is a modern workout companion that helps you stay focused
              on your goals, enjoy your training routine, and keep every session
              organized.
            </p>
          </div>
          <div className="about-highlights">
            <span>🏋️ Daily training</span>
            <span>📚 Exercise library</span>
            <span>🌟 Beautiful UI</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
