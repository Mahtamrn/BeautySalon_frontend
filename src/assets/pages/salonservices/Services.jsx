import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_UR;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState("");
  const [workingHours, setWorkingHours] = useState([]);
  const [showWorkingHours, setShowWorkingHours] = useState(false);

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

  useEffect(() => {
    services.forEach((service) => fetchReviews(service.id));
  }, [services]);

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

  const handleFavorite = async (serviceId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add favorites.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ service_id: serviceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to favorites");
      }

      alert("Service added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("Error adding to favorites. Please try again.");
    }
  };

  const fetchReviews = async (serviceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${serviceId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews((prevReviews) => ({ ...prevReviews, [serviceId]: data }));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleAddReview = async (serviceId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a review.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ service_id: serviceId, comment: newReview }),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      setNewReview("");
      fetchReviews(serviceId);
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Error adding review. Please try again.");
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
              <h4 className="text-md font-semibold text-[#5D4037] mt-2">
                Reviews
              </h4>
              {reviews[service.id] && reviews[service.id].length > 0 ? (
                <ul className="text-sm text-[#8D6E63]">
                  {reviews[service.id].map((review) => (
                    <li
                      key={review.id}
                      className="border-b border-[#C9A594] py-1"
                    >
                      <p className="text-xs">"{review.comment}"</p>
                      <p className="text-xs font-semibold">
                        - {review.user_name}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#BFA197]">No reviews yet.</p>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedService(service)}
                  className="mt-4 px-4 py-2 bg-[#8D6E63] text-white rounded-lg hover:bg-[#BFA197] transition"
                >
                  Book Appointment
                </button>
                {showWorkingHours && (
                  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
                      <h3 className="text-xl font-bold text-[#5D4037]">
                        Working Hours
                      </h3>
                      {workingHours.length === 0 ? (
                        <p className="text-[#8D6E63]">No working hours set.</p>
                      ) : (
                        <ul className="mt-2 text-left">
                          {workingHours.map((wh) => (
                            <li
                              key={wh.id}
                              className="border-b border-[#C9A594] py-2 text-sm text-[#5D4037]"
                            >
                              {wh.day}: {wh.open_time} - {wh.close_time} (Max{" "}
                              {wh.max_appointments_per_slot} per slot)
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        onClick={() => setShowWorkingHours(false)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => handleFavorite(service.id)}
                  className="mt-4 px-4 py-2 bg-[#C9A594] text-white rounded-lg hover:bg-[#8D6E63] transition"
                >
                  Add to Favorites
                </button>
              </div>
              <div className="mt-4">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="w-full px-2 py-1 border border-[#C9A594] rounded-lg focus:outline-none"
                  placeholder="Write a review..."
                ></textarea>
                <button
                  onClick={() => handleAddReview(service.id)}
                  className="mt-2 px-4 py-2 bg-[#8D6E63] text-white rounded-lg hover:bg-[#BFA197] transition"
                >
                  Submit Review
                </button>
              </div>
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
      <button
        onClick={() => setShowWorkingHours(true)}
        className="mt-2 px-4 py-2 bg-[#8D6E63] text-white rounded-lg hover:bg-[#BFA197] transition"
      >
        View Working Schedule
      </button>
    </div>
  );
};

export default Services;
