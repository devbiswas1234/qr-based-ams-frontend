import { useEffect, useState } from "react";
import api from "../api/axios";
import AttendanceChart from "../components/AttendanceChart";
import { logout } from "../utils/logout";


export default function AdminDashboard() {
  const [attendance, setAttendance] = useState([]);

  // 1️⃣ FETCH ATTENDANCE
  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const res = await api.get("/attendance/all");
        setAttendance(res.data);
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      }
    };

    fetchAllAttendance();
  }, []);

  // 2️⃣ 👉 ADD THIS BLOCK **HERE**
  const chartData = attendance.reduce((acc, curr) => {
    const found = acc.find(d => d.date === curr.date);
    if (found) found.count++;
    else acc.push({ date: curr.date, count: 1 });
    return acc;
  }, []);

  // 3️⃣ JSX RENDER
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Admin Dashboard
      </h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Daily Attendance Chart
        </h2>

        <AttendanceChart data={chartData} />
      </div>
      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
        Logout
      </button>
    </div>
  );
}
