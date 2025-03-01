import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_UR;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! Redirecting to login...");
      navigate("/");
      return;
    }

    const decodeToken = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded token:", payload);
        return payload;
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    };

    const userData = decodeToken(token);
    if (!userData) {
      console.error("Failed to decode token! Redirecting to login...");
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      console.log("User is null, waiting for data...");
      return;
    }

    console.log(
      "Fetching appointments for:",
      user.is_admin ? "Admin" : "Customer"
    );

    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const response = await fetch(
          user.is_admin
            ? `${API_BASE_URL}/appointments`
            : `${API_BASE_URL}/appointments/me`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid token or unauthorized request");
        }

        const data = await response.json();
        setAppointments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, appointments]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_BASE_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (!user || !user.is_admin) return;

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
      }
    };

    fetchUsers();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status } : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: { " Authorization": `Bearer ${token} ` },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleRemoveFavorite = async (serviceId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ service_id: serviceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove from favorites");
      }

      setFavorites(favorites.filter((fav) => fav.id !== serviceId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
      alert("Error removing from favorites. Please try again.");
    }
  };

  if (!user) {
    return (
      <p className="text-[#8D6E63] flex items-center justify-center min-h-screen">
        Loading user data...
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7E8DA]">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-[#5D4037] mb-4">Dashboard</h2>
        {user ? (
          <>
            <p className="text-lg text-[#8D6E63]">
              Welcome, <span className="font-semibold">{user.email}</span>!
            </p>
            <p className="text-md mt-2 text-[#BFA197]">
              Role:{" "}
              <span className="font-semibold">
                {user.is_admin ? "Admin" : "Customer"}
              </span>
            </p>

            <h3 className="text-xl font-bold mt-4 text-[#5D4037]">
              {user.is_admin ? "All Appointments" : "My Appointments"}
            </h3>

            {loading ? (
              <p className="text-[#8D6E63]">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="text-[#8D6E63]">No appointments found.</p>
            ) : (
              <ul className="mt-2 text-left">
                {appointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="border-b border-[#C9A594] py-2 text-sm flex flex-col text-[#5D4037]"
                  >
                    <span>
                      {appointment.service_name} - {appointment.date} (
                      {appointment.time})
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        appointment.status === "confirmed"
                          ? "text-green-600"
                          : appointment.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {appointment.status}
                    </span>

                    {user.is_admin ? (
                      <div className="mt-2 flex gap-2">
                        {appointment.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(appointment.id, "confirmed")
                            }
                            className="text-xs bg-[#8D6E63] text-white px-2 py-1 rounded hover:bg-[#BFA197] transition"
                          >
                            Confirm
                          </button>
                        )}
                        {appointment.status !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(appointment.id, "cancelled")
                            }
                            className="text-xs bg-[#C9A594] text-white px-2 py-1 rounded hover:bg-[#8D6E63] transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ) : (
                      appointment.status === "pending" && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="text-xs bg-[#C9A594] text-white px-2 py-1 mt-2 rounded hover:bg-[#8D6E63] transition"
                        >
                          Cancel Appointment
                        </button>
                      )
                    )}
                  </li>
                ))}
              </ul>
            )}
            <h3 className="text-xl font-bold mt-4 text-[#5D4037]">
              Favorite Services
            </h3>
            {favorites.length === 0 ? (
              <p className="text-[#8D6E63]">No favorites added.</p>
            ) : (
              <ul className="mt-2 text-left">
                {favorites.map((fav) => (
                  <li
                    key={fav.id}
                    className="border-b border-[#C9A594] py-2 text-sm text-[#5D4037]"
                  >
                    {fav.name} - ${fav.price}
                    <button
                      onClick={() => handleRemoveFavorite(fav.id)}
                      className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-[#8D6E63] text-white rounded-lg hover:bg-[#BFA197] transition"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-[#8D6E63]">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
