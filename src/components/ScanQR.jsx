import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function ScanQR({ onSuccess }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        onSuccess("✅ QR scanned successfully");
        scanner.clear(); // safe stop
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onSuccess]);

  return <div id="qr-reader" className="w-full" />;
}
