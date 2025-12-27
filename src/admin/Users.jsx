import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">All Users (Admin)</h1>

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="bg-white p-3 rounded shadow">
            <p><strong>Name:</strong> {u.name}</p>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Role:</strong> {u.role}</p>
            <p><strong>Joined:</strong> {new Date(u.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
        {users.length === 0 && <p>No users found.</p>}
      </div>
    </div>
  );
}
