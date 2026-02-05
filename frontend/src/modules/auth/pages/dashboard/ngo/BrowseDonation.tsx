import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import DonationCard from "../../../../components/DonationCard";
import DonorMap from "../../../../components/DonorMap";
import NotFound from "../../../../../assets/not-found.png";

import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";

interface Donation {
  _id: string;
  foodName: string;
  quantity: number;
  foodType: string;
  expiryTime: string;
  location?: {
    coordinates: [number, number];
  };
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
  const [ngoPos, setNgoPos] = useState<[number, number] | null>(null);
  const [distanceById, setDistanceById] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setNgoPos([lat, lng]);

        api
          .get(`/donation/browse?lat=${lat}&lng=${lng}`)
          .then((res) => setDonations(res.data.donations))
          .catch(() => toast.error("Failed to load donations"))
          .finally(() => setIsLoading(false));
      },
      () => {
        toast.error("Location permission is required");
        setIsLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    if (foodTypeFilter === "all") {
      setFilteredDonations(donations);
    } else {
      setFilteredDonations(
        donations.filter((d) => d.foodType === foodTypeFilter),
      );
    }
  }, [foodTypeFilter, donations]);

  useEffect(() => {
    if (!ngoPos || donations.length === 0) {
      setDistanceById({});
      return;
    }

    const fetchDistances = async () => {
      try {
        const results = await Promise.all(
          donations.map(async (d) => {
            const coords = d.location?.coordinates;
            if (!coords || coords.length !== 2) return null;
            const [lng, lat] = coords;

            const { data } = await api.get("/donation/route", {
              params: {
                fromLat: ngoPos[0],
                fromLng: ngoPos[1],
                toLat: lat,
                toLng: lng,
              },
            });

            return { id: d._id, distance: data?.distance };
          }),
        );

        const distanceMap = Object.fromEntries(
          results.filter(Boolean).map((r) => [r!.id, r!.distance]),
        );
        setDistanceById(distanceMap);
      } catch {
        setDistanceById({});
      }
    };

    fetchDistances();
  }, [donations, ngoPos]);

  if (isLoading) {
    return <Loader />;
  }

  if (!ngoPos) return <p>Loading location...</p>;

  const acceptDonation = async (id: string) => {
    await api.post(`/donation/${id}/accept`);
    toast.success("Donation accepted");
    setDonations((prev) => prev.filter((d) => d._id !== id));
    setFilteredDonations((prev) => prev.filter((d) => d._id !== id));
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            Filter by Food Type:
          </span>
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
        Showing {filteredDonations.length} donation
        {filteredDonations.length !== 1 ? "s" : ""}
      </div>

      {/* Donations Grid */}
      <div className="">
        {filteredDonations.length === 0 ? (
          <div className="flex justify-center items-center md:h-120 h-150 w-full">
            <img className="h-70" src={NotFound} alt="" />
          </div>
        ) : (
          filteredDonations.map((d) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DonationCard
                key={d._id}
                foodName={d.foodName}
                quantity={d.quantity}
                restaurantName={d.restaurant.name}
                address={d.restaurant.address}
                distanceKm={distanceById[d._id]}
                actionLabel="Accept"
                onAction={() => acceptDonation(d._id)}
                expiryTime={d.expiryTime}
              />
            </div>
          ))
        )}
        <DonorMap
          donations={donations}
          ngoPos={ngoPos}
          distanceById={distanceById}
        />
      </div>
    </div>
  );
};

export default BrowseDonations;
