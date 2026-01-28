import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";
import {
  setToken,
  setRole,
  setProfileCompleted,
  getProfileCompleted,
  getRole,
} from "../../../utils/token.js";
import { toast } from "react-toastify";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: "ADMIN" | "NGO" | "RESTAURANT";
  profileCompleted: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<LoginResponse>("/auth/login", form);

      setToken(res.data.token);
      setRole(res.data.role);
      setProfileCompleted(res.data.profileCompleted);

      toast.success("Login Successful");

      const profileCompleted = getProfileCompleted();
      const role = getRole();

      if (!profileCompleted) {
        navigate("/complete-registration", { replace: true });
        return;
      }

      if (role === "ADMIN") navigate("/admin");
      else if (role === "NGO") navigate("/ngo");
      else navigate("/restaurant");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 font-mono">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transition hover:shadow-purple-200"
      >
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-xl text-gray-500 mb-8">
          Login to continue
        </p>

        <div className="mb-5">
          <label className="block text-m font-semibold text-purple-600 mb-2">
            Email
          </label>
          <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
            <input
              name="email"
              placeholder="Enter your email"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-m font-semibold text-purple-600 mb-2">
            Password
          </label>
          <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white  py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]">
          Login
        </button>

        <div className="flex justify-between mt-5 text-m">
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-purple-600 cursor-pointer hover:underline"
          >
            Forgot Password?
          </span>
          <span
            onClick={() => navigate("/register")}
            className="text-purple-600 cursor-pointer hover:underline"
          >
            Create Account
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
