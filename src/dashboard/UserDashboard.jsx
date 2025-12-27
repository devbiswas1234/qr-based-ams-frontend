import { useEffect, useState } from "react";
import api from "../api/axios";
import { logout } from "../utils/logout";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get("/auth/me");
        setUser(profileRes.data);

        const attendanceRes = await api.get("/attendance/my");
        setAttendance(attendanceRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const markAttendance = async () => {
    try {
      await api.post("/attendance/mark", {
        latitude: 12.9716,
        longitude: 77.5946,
      });
      setStatus("✅ Attendance marked successfully");

      const res = await api.get("/attendance/my");
      setAttendance(res.data);
    } catch (err) {
      setStatus(err.response?.data?.message || "❌ Failed to mark attendance");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">User Dashboard</h1>
        <button
          onClick={logout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Attendance Action */}
        <div className="bg-white rounded-lg shadow p-5 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Today’s Attendance</h2>
            <p className="text-sm text-gray-600">
              Click the button to mark today’s attendance
            </p>
          </div>
          <button
            onClick={markAttendance}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Mark Attendance
          </button>
        </div>

        {status && (
          <p className="mb-4 text-center font-medium">{status}</p>
        )}

        {/* Attendance History */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Attendance History</h2>

          {attendance.length === 0 ? (
            <p className="text-gray-500 text-center">
              No attendance records yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {attendance.map((a) => (
                <div
                  key={a.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <p><strong>Date:</strong> {a.date}</p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(a.time).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 {a.latitude}, {a.longitude}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
