import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const decodeToken = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload;
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    };

    const userData = decodeToken(token);
    if (!userData) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    setUser(userData);

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          userData.is_admin
            ? "http://localhost:3000/appointments"
            : "http://localhost:3000/appointments/me",
          {
            headers: { Authorization: " Bearer ${token} " },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch appointments");
        }
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/appointments/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ${token}",
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
      const response = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: "DELETE",
        headers: { " Authorization": "Bearer ${token} " },
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        {user ? (
          <>
            <p className="text-lg">
              Welcome, <span className="font-semibold">{user.email}</span>!
            </p>
            <p className="text-md mt-2">
              Role:{" "}
              <span className="font-semibold">
                {user.is_admin ? "Admin" : "Customer"}
              </span>
            </p>

            <h3 className="text-xl font-bold mt-4">
              {user.is_admin ? "All Appointments" : "My Appointments"}
            </h3>

            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <ul className="mt-2 text-left">
                {appointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="border-b py-2 text-sm flex flex-col"
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
                            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                          >
                            Confirm
                          </button>
                        )}
                        {appointment.status !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(appointment.id, "cancelled")
                            }
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ) : (
                      appointment.status === "pending" && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 mt-2 rounded hover:bg-red-600 transition"
                        >
                          Cancel Appointment
                        </button>
                      )
                    )}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
