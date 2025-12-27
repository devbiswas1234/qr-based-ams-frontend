import api from "./axios";

export const getAllAttendance = () => {
  return api.get("/attendance/all");
};
