import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import DonationCard from "../../../../components/DonationCard";
import { toast } from "react-toastify";

interface Donation {
  _id: string;
  foodName: string;
  quantity: number;
  foodType: string;
  expiryTime: string;
  restaurant: {
    name: string;
    address: string;
  };
}

type FoodTypeFilter = "all" | "veg" | "non-veg" | "both";

const BrowseDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [foodTypeFilter, setFoodTypeFilter] = useState<FoodTypeFilter>("all");

  useEffect(() => {
    api.get("/donation/browse").then((res) => {
      setDonations(res.data.donations);
      setFilteredDonations(res.data.donations);
    });
  }, []);

  useEffect(() => {
    if (foodTypeFilter === "all") {
      setFilteredDonations(donations);
    } else {
      setFilteredDonations(
        donations.filter((d) => d.foodType === foodTypeFilter)
      );
    }
  }, [foodTypeFilter, donations]);

  const acceptDonation = async (id: string) => {
    await api.post(`/donation/${id}/accept`);
    toast.success("Donation accepted");
    setDonations((prev) => prev.filter((d) => d._id !== id));
    setFilteredDonations((prev) => prev.filter((d) => d._id !== id));
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filter by Food Type:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFoodTypeFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                foodTypeFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFoodTypeFilter("veg")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                foodTypeFilter === "veg"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Vegetarian
            </button>
            <button
              onClick={() => setFoodTypeFilter("non-veg")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                foodTypeFilter === "non-veg"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Non-Vegetarian
            </button>
            <button
              onClick={() => setFoodTypeFilter("both")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                foodTypeFilter === "both"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Both
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredDonations.length} donation{filteredDonations.length !== 1 ? "s" : ""}
      </div>

      {/* Donations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDonations.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No donations found for the selected filter.
          </div>
        ) : (
          filteredDonations.map((d) => (
            <DonationCard
              key={d._id}
              foodName={d.foodName}
              quantity={d.quantity}
              restaurantName={d.restaurant.name}
              address={d.restaurant.address}
              actionLabel="Accept"
              onAction={() => acceptDonation(d._id)}
              expiryTime={d.expiryTime}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseDonations;
