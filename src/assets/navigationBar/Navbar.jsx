import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    <nav className="bg-[#8D6E63] text-white py-3 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Beauty Salon</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/services" className="hover:underline">
              Services
            </Link>
          </li>
          {user?.is_admin && (
            <>
              <li>
                <Link to="/users" className="hover:underline">
                  Registered Users
                </Link>
              </li>
              <li>
                <Link to="/work-schedule" className="hover:underline">
                  Work Schedule
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
