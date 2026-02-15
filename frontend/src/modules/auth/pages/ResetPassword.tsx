import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import api from "../../../services/api.js";
import { resetPasswordSchema } from "../../../validations/auth.validation.js";

interface ResetForm {
  email: string;
  otp: string;
  newPassword: string;
}

const ResetPassword: React.FC = () => {
  const [form, setForm] = useState<ResetForm>({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await resetPasswordSchema.validate(form, {
        abortEarly: false,
      });
      const res = await api.post("/auth/reset-password", form);
      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        toast.error(err.errors[0]);
        return;
      }
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 font-mono">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transition hover:shadow-purple-200"
      >
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-5">
          Reset Password
        </h2>

        <p className="text-center text-xl text-gray-500 mb-6">
          Enter OTP to reset password
        </p>

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
            OTP
          </label>
          <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
            <input
              name="otp"
              placeholder="OTP"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-m font-semibold text-purple-600 mb-2">
            New Password
          </label>
          <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white  py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]">
          Reset Password
        </button>

        {message && <p className="text-center mt-3">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
