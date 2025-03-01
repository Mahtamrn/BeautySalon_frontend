import { useEffect, useState } from "react";
const API_BASE_URL = "http://localhost:5000";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookAppointment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to book an appointment.");
      return;
    }

    if (!selectedService && !date && !time) {
      alert("Please select a date and time.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_id: selectedService.id,
          date,
          time,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      alert("Appointment booked successfully!");
      setSelectedService(null);
      setDate("");
      setTime("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7E8DA] flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold text-[#5D4037] mb-6">Our Services</h2>
      {loading ? (
        <p className="text-[#8D6E63]">Loading services...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-4 rounded-lg shadow-md text-center"
            >
              <h3 className="text-xl font-semibold text-[#5D4037]">
                {service.name}
              </h3>
              <p className="text-sm text-[#8D6E63]">{service.description}</p>
              <p className="text-lg font-bold text-[#5D4037] mt-2">
                ${service.price}
              </p>
              <button
                onClick={() => setSelectedService(service)}
                className="mt-4 px-4 py-2 bg-[#8D6E63] text-white rounded-lg hover:bg-[#BFA197] transition"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedService && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-[#5D4037]">
              Book {selectedService.name}
            </h3>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-4 px-4 py-2 border border-[#C9A594] rounded-lg focus:outline-none"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-[#C9A594] rounded-lg focus:outline-none"
            />
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleBookAppointment}
                className="px-4 py-2 bg-[#8D6E63] text-white rounded-lg hover:bg-[#BFA197] transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
