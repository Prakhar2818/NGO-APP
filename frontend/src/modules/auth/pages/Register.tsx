import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import api from "../../../services/api.js";
import { registerSchema } from "../../../validations/auth.validation.js";

type Role = "NGO" | "RESTAURANT";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "NGO",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await registerSchema.validate(form, {
        abortEarly: false,
      });

      const res = await api.post("/auth/register", form);

      toast.success("Registration successful. Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        toast.error(err.errors[0]);
        return;
      }
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 font-mono">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transition hover:shadow-purple-200"
      >
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-2">
          Create Account
        </h2>
        <p className="text-center text-xl text-gray-500 mb-6">Register</p>

        <div className="mb-3">
          <label className="block text-m font-semibold text-purple-600 mb-2">
            Full Name
          </label>
          <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-m font-semibold text-purple-600 mb-2">
            Email
          </label>
          <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
            <input
              name="email"
              placeholder="Email"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-m font-semibold text-purple-600 mb-2">
            Password
          </label>
          <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-m font-semibold text-purple-600 mb-2">
            Select Role
          </label>

          <div className="relative">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full appearance-none bg-white border border-purple-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
            >
              <option value="NGO">NGO</option>
              <option value="RESTAURANT">Restaurant</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none">
              ▼
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white  py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p className="text-center mt-3 text-sm text-red-600">{message}</p>
        )}

        <p className="text-center text-m mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
