import api from "./api";

export const workoutService = {
  async getExercises(params = {}) {
    const response = await api.get("/workouts/exercises", { params });
    return response.data;
  },

  async getSessions(params = {}) {
    const response = await api.get("/workouts/sessions", { params });
    return response.data;
  },

  async createSession(data) {
    const response = await api.post("/workouts/sessions", data);
    return response.data;
  },

  async addLog(sessionId, data) {
    const response = await api.post(
      `/workouts/sessions/${sessionId}/logs`,
      data,
    );
    return response.data;
  },

  async deleteSession(id) {
    const response = await api.delete(`/workouts/sessions/${id}`);
    return response.data;
  },

  async getDashboard() {
    const response = await api.get("/workouts/dashboard");
    return response.data;
  },
};
