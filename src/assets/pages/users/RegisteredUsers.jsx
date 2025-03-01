import { useEffect, useState } from "react";
const API_BASE_URL = "http://localhost:5000";

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7E8DA]">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-[#5D4037] mb-4">
          Registered Users
        </h2>

        {loading ? (
          <p className="text-[#8D6E63]">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-[#8D6E63]">No users found.</p>
        ) : (
          <ul className="mt-2 text-left">
            {users.map((usr) => (
              <li
                key={usr.id}
                className="border-b border-[#C9A594] py-2 text-sm text-[#5D4037]"
              >
                {usr.name} - {usr.email}
                {usr.is_admin && (
                  <span className="ml-2 text-xs font-bold text-green-600">
                    (Admin)
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RegisteredUsers;
