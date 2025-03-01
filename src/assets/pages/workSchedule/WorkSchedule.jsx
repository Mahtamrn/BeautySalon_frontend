import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const WorkSchedule = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [newHours, setNewHours] = useState({
    day: "",
    open_time: "",
    close_time: "",
    max_appointments_per_slot: 5,
  });

  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/working-hours`);
        if (!response.ok) {
          throw new Error("Failed to fetch working hours");
        }
        const data = await response.json();
        setWorkingHours(data);
      } catch (error) {
        console.error("Error fetching working hours:", error);
      }
    };

    fetchWorkingHours();
  }, []);

  const handleSetWorkingHours = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/working-hours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHours),
      });

      if (!response.ok) {
        throw new Error("Failed to update working hours");
      }

      alert("Working hours updated!");
      setNewHours({
        day: "",
        open_time: "",
        close_time: "",
        max_appointments_per_slot: 5,
      });
    } catch (error) {
      console.error("Error updating working hours:", error);
      alert("Error updating working hours.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7E8DA]">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-[#5D4037] mb-4">
          Work Schedule
        </h2>

        <div className="flex flex-col gap-2">
          <select
            value={newHours.day}
            onChange={(e) => setNewHours({ ...newHours, day: e.target.value })}
            className="border px-2 py-1 rounded"
          >
            <option value="">Select a Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>

          <input
            type="time"
            value={newHours.open_time}
            onChange={(e) =>
              setNewHours({ ...newHours, open_time: e.target.value })
            }
            className="border px-2 py-1 rounded"
          />
          <input
            type="time"
            value={newHours.close_time}
            onChange={(e) =>
              setNewHours({ ...newHours, close_time: e.target.value })
            }
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            value={newHours.max_appointments_per_slot}
            onChange={(e) =>
              setNewHours({
                ...newHours,
                max_appointments_per_slot: e.target.value,
              })
            }
            className="border px-2 py-1 rounded"
          />

          <button
            onClick={handleSetWorkingHours}
            className="bg-[#8D6E63] text-white px-4 py-2 rounded hover:bg-[#BFA197] transition"
          >
            Save
          </button>
        </div>

        <h3 className="text-xl font-bold mt-4 text-[#5D4037]">
          Current Working Hours
        </h3>
        <ul className="mt-2 text-left">
          {workingHours.map((wh) => (
            <li
              key={wh.id}
              className="border-b border-[#C9A594] py-2 text-sm text-[#5D4037]"
            >
              {wh.day}: {wh.open_time} - {wh.close_time} (Max:{" "}
              {wh.max_appointments_per_slot})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkSchedule;
