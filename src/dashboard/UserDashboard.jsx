import { useEffect, useState } from "react";
import { logout } from "../utils/logout";
import { markAttendance, getMyAttendance } from "../api/attendance";
import api from "../api/axios";
import ScanQR from "../components/ScanQR";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [sessionId, setSessionId] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // 🔹 Fetch profile & attendance
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get("/auth/me");
        setUser(profileRes.data);

        const attendanceRes = await getMyAttendance();
        setAttendance(attendanceRes || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // 🔹 Countdown timer
  useEffect(() => {
    if (!sessionExpiry) return;

    const interval = setInterval(() => {
      const diff = new Date(sessionExpiry) - new Date();

      if (diff <= 0) {
        clearInterval(interval);
        setSessionId(null);
        setSessionExpiry(null);
        setTimeLeft(null);
        setStatus("⏱ QR session expired. Please scan again.");
      } else {
        setTimeLeft(Math.floor(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // 🔹 Auto-clear status
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(""), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const handleSessionValidated = (sid, expiresAt) => {
    setSessionId(sid);
    setSessionExpiry(expiresAt);
    setStatus("✅ QR scanned successfully. You can mark attendance.");
  };

  const handleMarkAttendance = () => {
    if (!sessionId || loading) return;

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await markAttendance(
            pos.coords.latitude,
            pos.coords.longitude,
            sessionId
          );

          setStatus("✅ Attendance marked successfully");
          setSessionId(null);

          const data = await getMyAttendance();
          setAttendance(data || []);
        } catch (err) {
          setStatus(
            err.response?.data?.message || "❌ Failed to mark attendance"
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        alert("Could not get your location");
      }
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">User Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Profile */}
        <section className="bg-slate-800 p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-blue-400">Profile</h2>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
        </section>

        {/* QR Scanner */}
        <section className="bg-slate-800 p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-blue-400">
            Scan Attendance QR
          </h2>

          {!sessionId ? (
            <ScanQR
              onSessionValidated={handleSessionValidated}
              sessionId={sessionId}
            />
          ) : (
            <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded font-medium">
              ⏳ Expires in{" "}
              {Math.floor((timeLeft || 0) / 60)}:
              {((timeLeft || 0) % 60).toString().padStart(2, "0")}
            </span>
          )}
        </section>

        {/* Mark Attendance */}
        <section className="bg-slate-800 p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-blue-400">Mark Attendance</h2>
            <p className="text-sm text-slate-400">
              Scan QR → Location check → Submit
            </p>
          </div>

          <button
            onClick={handleMarkAttendance}
            disabled={!sessionId || loading}
            className={`px-4 py-2 rounded text-white transition ${
              !sessionId || loading
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Marking..." : "Mark Attendance"}
          </button>
        </section>

        {/* Status */}
        {status && (
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-slate-700 rounded">
              {status}
            </span>
          </div>
        )}

        {/* Attendance History */}
        <section className="bg-slate-800 p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-blue-400">
            Attendance History
          </h2>

          {attendance.length === 0 ? (
            <p className="text-slate-400">No records yet</p>
          ) : (
            attendance.map((a) => (
              <div
                key={a.id}
                className="border border-slate-700 rounded p-2 mb-2 flex justify-between text-slate-300"
              >
                <span>{a.date}</span>
                <span>{new Date(a.time).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
