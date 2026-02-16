import { useEffect, useMemo, useState } from "react";
import { Building2, Calendar, HandHeart, Leaf, Users } from "lucide-react";
import api from "../../../../../services/api";
import LineTrendChart from "../../../../components/charts/LineTrendChart";
import StackedTrendBars from "../../../../components/charts/StackedTrendBars";
import DonutBreakdownChart from "../../../../components/charts/DonutBreakdownChart";

type TrendType = "daily" | "weekly" | "monthly";
type DonationStatus = "PENDING" | "ACCEPTED" | "PICKED_UP";

interface Donation {
  _id: string;
  quantity: number;
  status: DonationStatus;
  ngoId?: { _id?: string } | string | null;
  restaurantId?: {
    _id?: string;
    name?: string;
    restaurantName?: string;
  } | string | null;
  createdAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
}

interface User {
  _id: string;
  role: "NGO" | "RESTAURANT";
}

interface BucketSummary {
  label: string;
  total: number;
  pending: number;
  accepted: number;
  pickedUp: number;
}

const ALL_RESTAURANTS = "ALL_RESTAURANTS";

const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const getBucketLabel = (dateString: string, trendType: TrendType) => {
  const date = new Date(dateString);

  if (trendType === "monthly") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  if (trendType === "weekly") {
    const weekNo = getWeekNumber(date);
    return `${date.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  }

  return date.toISOString().slice(0, 10);
};

const getRestaurantMeta = (donation: Donation) => {
  if (!donation.restaurantId) {
    return { id: "UNKNOWN", name: "Unknown Restaurant" };
  }

  if (typeof donation.restaurantId === "string") {
    return { id: donation.restaurantId, name: "Restaurant" };
  }

  return {
    id: donation.restaurantId._id || "UNKNOWN",
    name: donation.restaurantId.restaurantName || donation.restaurantId.name || "Restaurant",
  };
};

const Analytics: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [ngos, setNgos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendType, setTrendType] = useState<TrendType>("daily");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(ALL_RESTAURANTS);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [donationsRes, usersRes] = await Promise.all([
          api.get("/admin/donations"),
          api.get("/admin/users"),
        ]);
        setDonations((donationsRes.data.donations || []) as Donation[]);
        const users = (usersRes.data.users || []) as User[];
        setNgos(users.filter((u) => u.role === "NGO"));
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const restaurants = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const donation of donations) {
      const meta = getRestaurantMeta(donation);
      map.set(meta.id, meta);
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [donations]);

  const filteredDonations = useMemo(() => {
    if (selectedRestaurantId === ALL_RESTAURANTS) return donations;

    return donations.filter((d) => getRestaurantMeta(d).id === selectedRestaurantId);
  }, [donations, selectedRestaurantId]);

  const totals = useMemo(() => {
    const totalDonations = filteredDonations.length;
    const foodSavedKg = filteredDonations.reduce((acc, d) => acc + (d.quantity || 0), 0);
    const mealImpact = foodSavedKg * 2;

    const engagedNgoIds = new Set(
      filteredDonations
        .map((d) => (typeof d.ngoId === "string" ? d.ngoId : d.ngoId?._id))
        .filter(Boolean),
    );

    const ngoEngagement = ngos.length > 0 ? (engagedNgoIds.size / ngos.length) * 100 : 0;

    return {
      totalDonations,
      foodSavedKg,
      mealImpact,
      engagedNgoCount: engagedNgoIds.size,
      ngoCount: ngos.length,
      ngoEngagement,
    };
  }, [filteredDonations, ngos]);

  const trendData = useMemo(() => {
    const bucketMap = new Map<string, BucketSummary>();

    for (const donation of filteredDonations) {
      let dateString: string | null = null;
      
      if (donation.status === "PENDING") {
        dateString = donation.createdAt;
      } else if (donation.status === "ACCEPTED" && donation.acceptedAt) {
        dateString = donation.acceptedAt;
      } else if (donation.status === "PICKED_UP" && donation.pickedUpAt) {
        dateString = donation.pickedUpAt;
      } else {
        dateString = donation.createdAt;
      }

      if (!dateString) continue;

      const label = getBucketLabel(dateString, trendType);
      const existing = bucketMap.get(label) || {
        label,
        total: 0,
        pending: 0,
        accepted: 0,
        pickedUp: 0,
      };

      existing.total += 1;
      if (donation.status === "PENDING") existing.pending += 1;
      if (donation.status === "ACCEPTED") existing.accepted += 1;
      if (donation.status === "PICKED_UP") existing.pickedUp += 1;
      bucketMap.set(label, existing);
    }

    return Array.from(bucketMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredDonations, trendType]);

  const statusBreakdown = useMemo(() => {
    const pending = filteredDonations.filter((d) => d.status === "PENDING").length;
    const accepted = filteredDonations.filter((d) => d.status === "ACCEPTED").length;
    const pickedUp = filteredDonations.filter((d) => d.status === "PICKED_UP").length;

    return [
      { name: "Pending", value: pending, color: "#f59e0b" },
      { name: "Accepted", value: accepted, color: "#3b82f6" },
      { name: "Picked Up", value: pickedUp, color: "#10b981" },
    ];
  }, [filteredDonations]);

  const restaurantComparison = useMemo(() => {
    const map = new Map<
      string,
      { name: string; total: number; pickedUp: number; foodSavedKg: number }
    >();

    for (const donation of donations) {
      const { id, name } = getRestaurantMeta(donation);
      const bucket = map.get(id) || { name, total: 0, pickedUp: 0, foodSavedKg: 0 };
      bucket.total += 1;
      bucket.foodSavedKg += donation.quantity || 0;
      if (donation.status === "PICKED_UP") bucket.pickedUp += 1;
      map.set(id, bucket);
    }

    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [donations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Analytics Scope</p>
            <p className="text-base font-semibold text-gray-900">Restaurant-wise view</p>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-gray-500" />
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={ALL_RESTAURANTS}>All Restaurants</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Donations</p>
            <Calendar size={18} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.totalDonations}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Food Saved (kg)</p>
            <Leaf size={18} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.foodSavedKg}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Meal Impact</p>
            <HandHeart size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.mealImpact}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">NGO Engagement</p>
            <Users size={18} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(totals.ngoEngagement)}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {totals.engagedNgoCount}/{totals.ngoCount} NGOs engaged
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Contribution Trends</h3>
          <div className="flex gap-2">
            {(["daily", "weekly", "monthly"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTrendType(type)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  trendType === type
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {trendData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No trend data available
          </div>
        ) : (
          <LineTrendChart
            data={trendData}
            xKey="label"
            series={[{ dataKey: "total", name: "Total Donations", color: "#7c3aed" }]}
          />
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Status Trend</h3>
          {trendData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No status data available
            </div>
          ) : (
            <StackedTrendBars
              data={trendData}
              xKey="label"
              series={[
                { dataKey: "pending", name: "Pending", color: "#f59e0b" },
                { dataKey: "accepted", name: "Accepted", color: "#3b82f6" },
                { dataKey: "pickedUp", name: "Picked Up", color: "#10b981" },
              ]}
            />
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Donation Status Mix</h3>
          {statusBreakdown.every((item) => item.value === 0) ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No status breakdown available
            </div>
          ) : (
            <DonutBreakdownChart data={statusBreakdown} />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          Top Restaurants Contribution
        </h3>
        {restaurantComparison.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No restaurant comparison data available
          </div>
        ) : (
          <StackedTrendBars
            data={restaurantComparison}
            xKey="name"
            stackId="restaurant"
            series={[
              { dataKey: "total", name: "Total Donations", color: "#8b5cf6" },
              { dataKey: "pickedUp", name: "Picked Up", color: "#10b981" },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default Analytics;
