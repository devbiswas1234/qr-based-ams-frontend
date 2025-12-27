import { useEffect, useState } from "react";
import { getAllAttendance } from "../api/attendance";

export default function AdminAttendanceTable() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllAttendance()
      .then((res) => setRecords(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Error loading attendance");
      });
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Attendance</h2>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Latitude</th>
            <th className="border p-2">Longitude</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No attendance found
              </td>
            </tr>
          ) : (
            records.map((rec) => (
              <tr key={rec.id}>
                <td className="border p-2">{rec.User?.name}</td>
                <td className="border p-2">{rec.User?.email}</td>
                <td className="border p-2">{rec.date}</td>
                <td className="border p-2">
                  {new Date(rec.time).toLocaleTimeString()}
                </td>
                <td className="border p-2">{rec.latitude}</td>
                <td className="border p-2">{rec.longitude}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
