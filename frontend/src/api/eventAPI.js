import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Event APIs
export const eventAPI = {
  getAll: () => api.get("/events"),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post("/events", data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getByCategory: (category) => api.get(`/events/category/${category}`),
  getUpcoming: () => api.get("/events/upcoming"),
};

// Registration APIs
export const registrationAPI = {
  registerForEvent: (data) => api.post("/registrations", data),
  getAll: () => api.get("/registrations"),
  getById: (id) => api.get(`/registrations/${id}`),
  getByEvent: (eventId) => api.get(`/registrations/event/${eventId}`),
  update: (id, data) => api.put(`/registrations/${id}`, data),
  cancel: (id) => api.delete(`/registrations/${id}`),
  getByUserEmail: (email) => api.get(`/registrations/user/${email}`),
};

export default api;
