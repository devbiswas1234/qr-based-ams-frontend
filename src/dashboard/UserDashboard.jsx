import { useEffect, useState, useRef } from "react";
import { logout } from "../utils/logout";
import { markAttendance, getMyAttendance, scanSession } from "../api/attendance";
import api from "../api/axios";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [markedToday, setMarkedToday] = useState(false);
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const qrScanInterval = useRef(null);

  // Fetch profile & attendance
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get("/auth/me");
        setUser(profileRes.data);

        const attendanceRes = await getMyAttendance();
        setAttendance(attendanceRes);

        const today = new Date().toLocaleDateString();
        setMarkedToday(attendanceRes.some(a => new Date(a.timestamp).toLocaleDateString() === today));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // HTML5 QR Scanner
  const startScanner = async () => {
    setScanning(true);
    setStatus("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", true);
      videoRef.current.play();

      qrScanInterval.current = setInterval(scanFrame, 300);
    } catch (err) {
      console.error(err);
      setStatus("❌ Could not access camera");
      setScanning(false);
    }
  };

  const stopScanner = () => {
    clearInterval(qrScanInterval.current);
    qrScanInterval.current = null;

    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setScanning(false);
  };

  const scanFrame = async () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = window.jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      stopScanner();
      handleScanSuccess(code.data);
    }
  };

  const handleScanSuccess = async (sessionId) => {
    setLoading(true);
    try {
      await markAttendance(user.latitude, user.longitude, sessionId); // pass lat, lng, sessionId
      setStatus("✅ Attendance marked successfully");
      const data = await getMyAttendance();
      setAttendance(data);
      setMarkedToday(true);
    } catch (err) {
      setStatus(err.response?.data?.message || "❌ Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">User Dashboard</h1>
        <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Logout</button>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Profile */}
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        {/* QR Scanner */}
        <div className="bg-white rounded-lg shadow p-5 mb-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Scan QR to Mark Attendance</h2>
          {!scanning && !markedToday && (
            <button
              onClick={startScanner}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 mb-2"
            >Start Scanner</button>
          )}
          <video ref={videoRef} className="w-full max-w-md mb-2" />
          <canvas ref={canvasRef} className="hidden" />
          {status && <p className="text-center font-medium">{status}</p>}
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Attendance History</h2>
          {attendance.length === 0 ? (
            <p className="text-gray-500 text-center">No attendance records yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {attendance.map(a => (
                <div key={a.id} className="border rounded-lg p-4 bg-gray-50">
                  <p><strong>Date:</strong> {new Date(a.timestamp).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date(a.timestamp).toLocaleTimeString()}</p>
                  <p className="text-sm text-gray-600">📍 {a.lat}, {a.lng}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
