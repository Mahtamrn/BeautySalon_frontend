import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:5000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F7E8DA]">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#5D4037] text-center mb-4">
          Login
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-[#C9A594] rounded-lg focus:outline-none focus:ring focus:border-[#8D6E63] bg-[#F7E8DA] text-[#5D4037]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-[#C9A594] rounded-lg focus:outline-none focus:ring focus:border-[#8D6E63] bg-[#F7E8DA] text-[#5D4037]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#8D6E63] text-white py-2 rounded-lg hover:bg-[#BFA197] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
