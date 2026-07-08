import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.16 },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-shell">
      <section className="landing-hero reveal">
        <div className="landing-panel">
          <p className="eyebrow">Fitness, simplified</p>
          <h1>
            Train smarter with a workout experience that feels motivating from
            day one.
          </h1>
          <p>
            FitTrack brings your workouts, exercise library, and progress into
            one calm, modern place so staying consistent feels natural and
            rewarding.
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
          <h3>Why FitTrack stands out</h3>
          <ul>
            <li>Clean dashboard for tracking your progress</li>
            <li>Exercise library for planning stronger sessions</li>
            <li>Simple workout history to keep motivation high</li>
            <li>A polished experience that feels good to use</li>
          </ul>
        </div>
      </section>

      <section className="landing-stats reveal">
        <div className="stat-card landing-stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-value">Daily focus</div>
          <div className="stat-label">
            Keep your goals visible and your routine consistent.
          </div>
        </div>
        <div className="stat-card landing-stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">Exercise library</div>
          <div className="stat-label">
            Discover workouts that match your training style.
          </div>
        </div>
        <div className="stat-card landing-stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">Progress tracking</div>
          <div className="stat-label">
            See your recent sessions and build momentum over time.
          </div>
        </div>
      </section>

      <section className="landing-section reveal">
        <div className="section-heading">
          <p className="eyebrow">Built for consistency</p>
          <h2>Everything you need to stay on track.</h2>
        </div>
        <div className="landing-grid">
          <div className="landing-feature">
            <h3>⚡ Fast and simple</h3>
            <p>
              Jump in quickly, log your workout, and keep moving without
              friction.
            </p>
          </div>
          <div className="landing-feature">
            <h3>📊 Clear progress view</h3>
            <p>
              Review sessions, notes, and your recent activity in one place.
            </p>
          </div>
          <div className="landing-feature">
            <h3>💡 Motivating experience</h3>
            <p>
              A beautiful interface that makes workouts feel easier to return
              to.
            </p>
          </div>
        </div>
      </section>

      <section className="card about-section reveal">
        <div className="about-content">
          <div>
            <p className="eyebrow">About FitTrack</p>
            <h3>Designed for people who want to train with purpose.</h3>
            <p className="text-muted">
              FitTrack is a modern workout companion that helps you organize
              your routine, explore new exercises, and stay inspired through
              every session.
            </p>
          </div>
          <div className="about-highlights">
            <span>🏋️ Workout tracking</span>
            <span>📚 Exercise discovery</span>
            <span>🌟 Beautiful product experience</span>
          </div>
        </div>
      </section>

      <section className="cta-section reveal">
        <h2>Ready to start your next session?</h2>
        <p>
          Create your account and turn your fitness goals into a routine you’ll
          actually enjoy.
        </p>
        <Link to="/register" className="btn btn-primary">
          Get started today
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
