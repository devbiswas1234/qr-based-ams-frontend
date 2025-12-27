import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const res = await api.get("/attendance/all");
        setRecords(res.data);
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAttendance();
  }, []);

  if (loading) return <p>Loading attendance...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">All Attendance Records (Admin)</h1>

      <div className="space-y-2">
        {records.map((att) => (
          <div key={att.id} className="bg-white p-3 rounded shadow">
            <p><strong>User:</strong> {att.User.name} ({att.User.email})</p>
            <p><strong>Date:</strong> {att.date}</p>
            <p><strong>Time:</strong> {new Date(att.time).toLocaleTimeString()}</p>
            <p><strong>Lat/Lng:</strong> {att.latitude}, {att.longitude}</p>
          </div>
        ))}
        {records.length === 0 && <p>No attendance records yet.</p>}
      </div>
    </div>
  );
}
