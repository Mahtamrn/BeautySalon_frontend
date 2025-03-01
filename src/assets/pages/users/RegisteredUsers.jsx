import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_UR;

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

  const handleBlockUser = async (userId, isBlocked) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/users/block`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, is_blocked: !isBlocked }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      setUsers(
        users.map((usr) =>
          usr.id === userId ? { ...usr, is_blocked: !isBlocked } : usr
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Error updating user status. Please try again.");
    }
  };

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
                className="border-b border-[#C9A594] py-2 text-sm text-[#5D4037] flex justify-between items-center"
              >
                <span>
                  {usr.name} - {usr.email}
                </span>
                {!usr.is_admin && (
                  <button
                    onClick={() => handleBlockUser(usr.id, usr.is_blocked)}
                    className={`ml-2 text-xs px-2 py-1 rounded transition ${
                      usr.is_blocked
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {usr.is_blocked ? "Unblock" : "Block"}
                  </button>
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
