import api from "./axios";

// Admin: create QR session
export const generateSession = async () => {
  const res = await api.post("/attendance/session");
  return res.data;
};

// Student: scan QR
export const scanSession = async (sessionId) => {
  const res = await api.post("/attendance/scan", { sessionId });
  return res.data;
};

// Student: mark attendance
export const markAttendance = async (latitude, longitude) => {
  const res = await api.post("/attendance/mark", {
    latitude,
    longitude,
  });
  return res.data;
};

// User attendance
export const getMyAttendance = async () => {
  const res = await api.get("/attendance/my");
  return res.data;
};

// Admin attendance
export const getAllAttendance = async () => {
  const res = await api.get("/attendance/all");
  return res.data;
};
