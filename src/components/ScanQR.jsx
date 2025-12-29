import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";
import api from "../api/axios";

export default function ScanQR({ onSessionValidated, sessionId }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    // If session is already active, don’t initialize scanner
    if (sessionId) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        try {
          const sessionId = decodedText.trim();

          const res = await api.post("/attendance/session/scan", { sessionId });

          onSessionValidated(sessionId, res.data.expiresAt);

          // Stop scanner after successful scan
          scanner.clear().catch(() => {});
        } catch (err) {
          alert(err.response?.data?.message || "Invalid or expired QR");
        }
      },
      (err) => {
        // silent scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onSessionValidated, sessionId]);

  return <div id="qr-reader" className="w-full max-w-sm mx-auto" />;
}
