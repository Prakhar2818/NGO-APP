import { useEffect, useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import api from "../../../../../services/api";
import NotFound from "../../../../../assets/not-found.png";

interface Donation {
  _id: string;
  foodName: string;
  quantity: number;
  foodType: string;
  status: "PENDING" | "ACCEPTED" | "PICKED_UP";
  restaurantId: {
    name: string;
    restaurantName: string;
    email: string;
  };
  ngoId?: {
    name: string;
    organizationName: string;
    email: string;
  };
  createdAt: string;
  expiryTime: string;
  pickupAddress: string;
}

const AllDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchDonations = async () => {
    try {
      const res = await api.get("/admin/donations");
      setDonations(res.data.donations || []);
      setFilteredDonations(res.data.donations || []);
    } catch (error) {
      console.error("Failed to fetch donations:", error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    let filtered = donations;

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.restaurantId.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.ngoId?.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((d) => d.foodType === typeFilter);
    }

    setFilteredDonations(filtered);
  }, [searchTerm, statusFilter, typeFilter, donations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "PICKED_UP":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PICKED_UP">Picked Up</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      {/* Donations Table */}
      {filteredDonations.length === 0 ? (
        <div className="flex justify-center items-center md:h-120 h-150 w-full">
          <img className="h-70" src={NotFound} alt="" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Food
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Restaurant
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    NGO
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDonations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {donation.foodName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {donation.quantity} meals • {donation.foodType}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">
                        {donation.restaurantId.restaurantName ||
                          donation.restaurantId.name}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {donation.ngoId ? (
                        <p className="text-sm text-gray-900">
                          {donation.ngoId.organizationName ||
                            donation.ngoId.name}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          donation.status
                        )}`}
                      >
                        {donation.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        {formatDate(donation.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {donations.filter((d) => d.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Accepted</p>
          <p className="text-2xl font-bold text-blue-600">
            {donations.filter((d) => d.status === "ACCEPTED").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Picked Up</p>
          <p className="text-2xl font-bold text-green-600">
            {donations.filter((d) => d.status === "PICKED_UP").length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllDonations;
