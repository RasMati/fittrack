import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          // Just check if token exists, we'll get user from localStorage
          const storedUser = authService.getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          authService.logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        authService.setAuthData(response.data.token, response.data.user);
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success("Welcome back!");
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authService.register(username, email, password);
      if (response.success) {
        authService.setAuthData(response.data.token, response.data.user);
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success("Account created successfully!");
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
