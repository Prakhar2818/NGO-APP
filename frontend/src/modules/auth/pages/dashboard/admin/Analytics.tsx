import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import api from "../../../../../services/api";

const Analytics: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendType, setTrendType] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [summaryRes, trendsRes] = await Promise.all([
          api.get("/admin/analytics/summary"),
          api.get(`/admin/analytics/trends?type=${trendType}`),
        ]);
        setSummary(summaryRes.data);
        setTrends(trendsRes.data.trends || []);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [trendType]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Pending",
      ACCEPTED: "Accepted",
      PICKED_UP: "Picked Up",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "ACCEPTED":
        return "bg-blue-500";
      case "PICKED_UP":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const maxTrendValue = Math.max(...trends.map((t) => t.count), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Donations</p>
              <p className="text-3xl font-bold text-gray-900">
                {summary?.totalDonations || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {summary?.statusBreakdown?.map((item: any) => (
          <div key={item._id} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{getStatusLabel(item._id)}</p>
                <p className="text-3xl font-bold text-gray-900">{item.count}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(
                  item._id
                )} bg-opacity-20`}
              >
                {item._id === "PICKED_UP" ? (
                  <TrendingUp className={getStatusColor(item._id).replace("bg", "text")} size={24} />
                ) : (
                  <TrendingDown className={getStatusColor(item._id).replace("bg", "text")} size={24} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Donation Trends</h3>
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

        {trends.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            No trend data available
          </div>
        ) : (
          <div className="space-y-3">
            {trends.map((trend, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-500">
                  {trend._id}
                </div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-lg transition-all duration-500"
                      style={{
                        width: `${(trend.count / maxTrendValue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right">
                  <span className="font-medium text-gray-900">{trend.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Calendar size={16} />
            <span className="text-sm">Daily Average</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {trends.length > 0
              ? (trends.reduce((acc, t) => acc + t.count, 0) / trends.length).toFixed(1)
              : "0"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp size={16} />
            <span className="text-sm">Best Day</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {trends.length > 0
              ? trends.reduce((max, t) => (t.count > max.count ? t : max), trends[0])._id
              : "-"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingDown size={16} />
            <span className="text-sm">Lowest Day</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {trends.length > 0
              ? trends.reduce((min, t) => (t.count < min.count ? t : min), trends[0])._id
              : "-"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp size={16} />
            <span className="text-sm">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {summary?.totalDonations
              ? Math.round(
                  ((summary.statusBreakdown?.find((s: any) => s._id === "PICKED_UP")?.count || 0) /
                    summary.totalDonations) *
                    100
                )
              : 0}
            %
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
