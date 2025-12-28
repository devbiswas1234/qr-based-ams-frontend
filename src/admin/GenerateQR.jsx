import { useState } from "react";
import QRCode from "react-qr-code";
import { generateSession } from "../api/attendance";

export default function GenerateQR() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      const data = await generateSession();
      setSession(data);
      setError("");
    } catch (err) {
      setError("Failed to generate QR");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">Generate Attendance QR</h2>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate QR (Valid 3 min)
      </button>

      {error && <p className="text-red-600 mt-3">{error}</p>}

      {session && (
        <div className="mt-6 flex flex-col items-center">
          <QRCode value={session.sessionId.toString()} size={200} />
          <p className="text-sm text-gray-600 mt-2">
            Expires at: {new Date(session.expiresAt).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
