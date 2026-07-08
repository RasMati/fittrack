import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand">
          🏋️ FitTrack
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/">Dashboard</Link>
              <Link to="/exercises">Exercises</Link>
              <Link to="/workout">Workout</Link>
              <Link to="/history">History</Link>
              <span style={{ color: "#d1d5db" }}>👤 {user?.username}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                style={{
                  background: "#3b82f6",
                  padding: "0.25rem 1rem",
                  borderRadius: "4px",
                  color: "white",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
