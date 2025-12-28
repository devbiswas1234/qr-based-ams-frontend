import { useEffect, useState } from "react";
import { logout } from "../utils/logout";
import { getAllAttendance } from "../api/attendance";
import AttendanceChart from "../components/AttendanceChart";
import GenerateQR from "../admin/GenerateQR";

export default function AdminDashboard() {
  const [attendance, setAttendance] = useState([]);

  // Fetch all attendance
  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const data = await getAllAttendance();
        setAttendance(data || []);
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      }
    };
    fetchAllAttendance();
  }, []);

  // Prepare chart data (SAFE)
  const chartData = attendance.reduce((acc, curr) => {
    if (!curr.timestamp) return acc;

    const date = new Date(curr.timestamp);
    if (isNaN(date)) return acc;

    const dateStr = date.toLocaleDateString();

    const found = acc.find(d => d.date === dateStr);
    if (found) found.count++;
    else acc.push({ date: dateStr, count: 1 });

    return acc;
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <GenerateQR />
      {/* Chart */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Daily Attendance Chart</h2>
        <AttendanceChart data={chartData} />
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">All Attendance Records</h2>

        {attendance.length === 0 ? (
          <p className="text-gray-500">No attendance records found.</p>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Date & Time</th>
                <th className="border px-4 py-2">Latitude</th>
                <th className="border px-4 py-2">Longitude</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => {
                const date = a.timestamp ? new Date(a.timestamp) : null;
                const dateStr =
                  date && !isNaN(date)
                    ? date.toLocaleString()
                    : "N/A";

                return (
                  <tr key={a.id}>
                    <td className="border px-4 py-2">{a.User?.name || "—"}</td>
                    <td className="border px-4 py-2">{a.User?.email || "—"}</td>
                    <td className="border px-4 py-2">{dateStr}</td>
                    <td className="border px-4 py-2">{a.lat}</td>
                    <td className="border px-4 py-2">{a.lng}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
