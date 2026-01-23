import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { setToken, setRole } from "../../utils/token";

import { toast } from "react-toastify"

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      setToken(res.data.token);
      setRole(res.data.role)

      toast.success("Login Successfull")

      // ✅ ROLE-BASED REDIRECT
      const role = res.data.role;
      if (role === "ADMIN") navigate("/admin");
      else if (role === "NGO") navigate("/ngo");
      else navigate("/restaurant");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow w-96"
      >
        <h2 className="text-xl mb-4 text-center">Login</h2>

        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
          required
        />

        <button className="bg-blue-600 text-white w-full p-2">
          Login
        </button>

        {message && (
          <p className="text-center text-red-600 mt-3">{message}</p>
        )}

        <div className="flex justify-between">
          <p
            onClick={() => navigate("/forgot-password")}
            className="text-center text-sm mt-4 text-blue-600 cursor-pointer"
          >
            Forgot Password?
          </p>

          <p
            onClick={() => navigate("/register")}
            className="text-center text-sm mt-4 text-blue-600 cursor-pointer"
          >
            Create Account
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
