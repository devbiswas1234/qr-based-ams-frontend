import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { generateSession } from "../api/attendance";

export default function GenerateQR() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(0);

  const handleGenerate = async () => {
    try {
      const data = await generateSession();
      setSession(data);
      setError("");

      // set initial remaining seconds
      const diff =
        new Date(data.expiresAt).getTime() - new Date().getTime();
      setRemaining(Math.floor(diff / 1000));
    } catch (err) {
      setError("Failed to generate QR");
    }
  };

  // ⏱ TIMER LOGIC
  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      const diff =
        new Date(session.expiresAt).getTime() -
        new Date().getTime();

      if (diff <= 0) {
        setRemaining(0);
        setSession(null); // auto expire QR
        clearInterval(timer);
      } else {
        setRemaining(Math.floor(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">
        Generate Attendance QR
      </h2>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate QR (valid 3 min)
      </button>

      {error && (
        <p className="text-red-600 mt-3">{error}</p>
      )}

      {session && (
        <div className="mt-6 flex flex-col items-center">
          <QRCode
            value={session.sessionId.toString()}
            size={220}
          />

          <p className="mt-3 text-gray-600">
            Expires in <b>{remaining}</b> seconds
          </p>

          <p className="text-sm text-gray-400">
            {new Date(session.expiresAt).toLocaleTimeString()}
          </p>
        </div>
      )}

      {!session && remaining === 0 && (
        <p className="mt-4 text-red-500 font-semibold">
          QR expired. Generate a new one.
        </p>
      )}
    </div>
  );
}
