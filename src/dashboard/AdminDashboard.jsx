import { useEffect, useState } from "react";
import { logout } from "../utils/logout";
import { getAllAttendance } from "../api/attendance";
import AttendanceChart from "../components/AttendanceChart";
import QRCode from "react-qr-code";
import api from "../api/axios";

export default function AdminDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

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

  // Prepare chart data
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

  // Generate QR session
  const handleGenerateQR = async () => {
    try {
      const res = await api.post("/attendance/session/generate");
      setSessionId(res.data.sessionId);
      setExpiresAt(new Date(res.data.expiresAt));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate session");
    }
  };

  // Countdown logic
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const diff = Math.floor((expiresAt - new Date()) / 1000);
      if (diff <= 0) {
        setSecondsLeft(0);
        setSessionId(null);
        setExpiresAt(null);
        clearInterval(interval);
      } else {
        setSecondsLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-400">
          Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Generate QR */}
      <section className="bg-slate-800 p-4 rounded-lg shadow mb-6 text-center">
        <button
          onClick={handleGenerateQR}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Generate Attendance QR
        </button>

        {sessionId && (
          <div className="mt-4 flex flex-col items-center">
            <div className="bg-white p-3 rounded">
              <QRCode value={String(sessionId)} size={180} />
            </div>

            <p className="mt-2 text-slate-300">
              Session ID: <span className="text-blue-400">{sessionId}</span>
            </p>

            <p className="mt-1 text-red-400 font-semibold">
              {secondsLeft} second{secondsLeft !== 1 ? "s" : ""} left
            </p>
          </div>
        )}
      </section>

      {/* Chart */}
      <section className="bg-slate-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-3 text-blue-400">
          Daily Attendance Chart
        </h2>
        <AttendanceChart data={chartData} />
      </section>

      {/* Attendance Table */}
      <section className="bg-slate-800 p-4 rounded-lg shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-3 text-blue-400">
          All Attendance Records
        </h2>

        {attendance.length === 0 ? (
          <p className="text-slate-400">No attendance records found.</p>
        ) : (
          <table className="min-w-full border border-slate-700 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="border border-slate-700 px-4 py-2">User</th>
                <th className="border border-slate-700 px-4 py-2">Email</th>
                <th className="border border-slate-700 px-4 py-2">
                  Date & Time
                </th>
                <th className="border border-slate-700 px-4 py-2">Latitude</th>
                <th className="border border-slate-700 px-4 py-2">Longitude</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((a) => {
                const date = a.timestamp ? new Date(a.timestamp) : null;
                const dateStr =
                  date && !isNaN(date) ? date.toLocaleString() : "N/A";

                return (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-700 transition"
                  >
                    <td className="border border-slate-700 px-4 py-2">
                      {a.User?.name || "—"}
                    </td>
                    <td className="border border-slate-700 px-4 py-2">
                      {a.User?.email || "—"}
                    </td>
                    <td className="border border-slate-700 px-4 py-2">
                      {dateStr}
                    </td>
                    <td className="border border-slate-700 px-4 py-2">
                      {a.lat}
                    </td>
                    <td className="border border-slate-700 px-4 py-2">
                      {a.lng}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
