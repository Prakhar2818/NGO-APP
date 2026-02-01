import { useState } from "react";
import api from "../../../../../services/api.js";
import { createDonationSchema } from "../../../../../validations/createDonation.validation.js";
import { toast } from "react-toastify";
import * as yup from "yup";

interface CreateDonationform {
  foodName: string;
  quantity: string;
  expiryTime: string;
  pickupAddress: string;
  foodType: string;
}

const CreateDonation: React.FC = () => {
  const [form, setForm] = useState<CreateDonationform>({
    foodName: "",
    quantity: "",
    expiryTime: "",
    pickupAddress: "",
    foodType: "veg",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createDonationSchema.validate(form, {
        abortEarly: false,
      });

      await api.post("/donation/create-donation", {
        ...form,
        quantity: Number(form.quantity),
      });
      toast.success("Donation created successfully!");
      setForm({
        foodName: "",
        quantity: "",
        expiryTime: "",
        pickupAddress: "",
        foodType: "veg",
      });
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        toast.error(err.errors[0]);
        return;
      }
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6"
    >
      <h2 className="text-2xl font-bold text-purple-700 mb-6">
        Create New Donation
      </h2>

      <div className="space-y-5">
        {/* Food Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Rice and Curry, Sandwiches"
            value={form.foodName}
            onChange={(e) => handleChange("foodName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity (Number of Meals) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 50"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Food Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {[
              { value: "veg", label: "Vegetarian", icon: "🥗" },
              { value: "non-veg", label: "Non-Vegetarian", icon: "🍗" },
              { value: "both", label: "Both", icon: "🍽️" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex-1 cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${
                  form.foodType === option.value
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <input
                  type="radio"
                  name="foodType"
                  value={option.value}
                  checked={form.foodType === option.value}
                  onChange={(e) => handleChange("foodType", e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl block mb-1">{option.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Expiry Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={form.expiryTime}
            onChange={(e) => handleChange("expiryTime", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Address <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Enter complete address for pickup"
            value={form.pickupAddress}
            onChange={(e) => handleChange("pickupAddress", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
            rows={3}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating..." : "Create Donation"}
      </button>
    </form>
  );
};

export default CreateDonation;
