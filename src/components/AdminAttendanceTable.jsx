import { useEffect, useState } from "react";
import QRCode from "qrcode";
import api from "../api/axios";
import { logout } from "../utils/logout";

export default function AdminDashboard() {
  const [qrUrl, setQrUrl] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  // ⏱ Countdown timer
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(expiresAt) - new Date()) / 1000)
      );

      setTimeLeft(remaining);

      if (remaining === 0) {
        setQrUrl("");
        setSessionId(null);
        setExpiresAt(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // 🎯 Generate QR
  const generateQR = async () => {
    try {
      setLoading(true);

      const res = await api.post("/attendance/session/generate");

      const { sessionId, expiresAt } = res.data;

      // Encode only sessionId in QR
      const qrData = JSON.stringify({ sessionId });

      const qrImage = await QRCode.toDataURL(qrData);

      setQrUrl(qrImage);
      setSessionId(sessionId);
      setExpiresAt(expiresAt);
    } catch (err) {
      alert("Failed to generate QR");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Admin / Teacher Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Generate QR */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold mb-4">
            Generate Attendance QR
          </h2>

          {!qrUrl && (
            <button
              onClick={generateQR}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Generating..." : "Generate QR"}
            </button>
          )}

          {qrUrl && (
            <>
              <img
                src={qrUrl}
                alt="Attendance QR"
                className="mx-auto my-4 w-64 h-64"
              />

              <p className="text-gray-700">
                ⏳ Expires in{" "}
                <span className="font-bold text-red-600">
                  {timeLeft}s
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Session ID: {sessionId}
              </p>
            </>
          )}

          {!qrUrl && (
            <p className="text-sm text-gray-500 mt-4">
              Generate a QR for students to scan (valid for 180 seconds)
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
