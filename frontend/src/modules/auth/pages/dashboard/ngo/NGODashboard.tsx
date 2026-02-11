import { useEffect, useState } from "react";
import { HandHeart, Clock, CheckCircle, Search } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import BrowseDonations from "./BrowseDonation";
import ActiveDonations from "./ActiveDonations";
import DonationHistory from "./DonationHistory";
import MetricCard from "../../../../components/MetricCard";
import NotificationPanel from "../../../../components/NotificationPanel";
import { socket, stopSocketCycle } from "../../../../../socket";
import { logout } from "../../../../../utils/token";
import { toast } from "react-toastify";
import api from "../../../../../services/api";
import { useNavigate } from "react-router-dom";

const NGODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "browse" | "active" | "history"
  >("overview");

  const [stats, setStats] = useState({
    totalAccepted: 0,
    active: 0,
    completed: 0,
  });

  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem("ngo-notifications");
    return saved ? JSON.parse(saved) : [];
  });
  const [showPanel, setShowPanel] = useState(false);
  const [localNotificationsEnabled, setLocalNotificationsEnabled] = useState(
    () => localStorage.getItem("ngo-local-notifications") === "true",
  );
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(() => {
      if (typeof window === "undefined") return "default";
      if (!("Notification" in window)) return "denied";
      return Notification.permission;
    });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("ngo-notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("new-donation", (donation) => {
      setNotifications((p) => [
        {
          id: crypto.randomUUID?.() || Date.now().toString(),
          title: "New Donation",
          message: `${donation.foodName} (${donation.quantity})`,
          restaurantName: donation.restaurantName,
          createdAt: new Date().toISOString(),
        },
        ...p,
      ]);
      toast.info("New donation available");

      if (
        localNotificationsEnabled &&
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("New Donation Available", {
          body: `${donation.foodName} (${donation.quantity})`,
        });
      }
    });

    return () => {
      socket.off("new-donation");
    };
  }, []);

  useEffect(() => {
    api.get("/donation/ngo/history").then((res) => {
      const d = res.data.donations;
      setStats({
        totalAccepted: d.length,
        active: d.filter((x: any) => x.status === "ACCEPTED").length,
        completed: d.filter((x: any) => x.status === "PICKED_UP").length,
      });
    });
  }, []);

  const handleLogout = async () => {
    stopSocketCycle(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if API call fails, clear local data
    } finally {
      logout();
      navigate("/");
    }
  };

  const enableLocalNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Local notifications are not supported in this browser");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      localStorage.setItem("ngo-local-notifications", "true");
      setLocalNotificationsEnabled(true);
      toast.success("Local notifications enabled");
    } else {
      localStorage.setItem("ngo-local-notifications", "false");
      setLocalNotificationsEnabled(false);
      toast.info("Local notifications are disabled");
    }
  };

  return (
    <Navbar
      title="NGO Dashboard"
      tabs={[
        { key: "overview", label: "Overview" },
        { key: "browse", label: "Browse" },
        { key: "active", label: "Active" },
        { key: "history", label: "History" },
      ]}
      activeTab={activeTab}
      onTabChange={(k) => setActiveTab(k as any)}
      showNotificationBell
      notificationCount={notifications.length}
      onBellClick={() => setShowPanel((p) => !p)}
      rightSlot={
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          Logout
        </button>
      }
    >
      {showPanel && (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <NotificationPanel 
            notifications={notifications} 
            onClose={() => setShowPanel(false)}
            localNotificationsEnabled={localNotificationsEnabled}
            notificationPermission={notificationPermission}
            onEnableLocalNotifications={enableLocalNotifications}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "browse" && "Browse Donations"}
            {activeTab === "active" && "Active Pickups"}
            {activeTab === "history" && "Donation History"}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {activeTab === "overview" &&
              "Track your impact and manage donations"}
            {activeTab === "browse" &&
              "Find available food donations from restaurants"}
            {activeTab === "active" && "Manage your ongoing pickups"}
            {activeTab === "history" && "View your completed pickups"}
          </p>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <MetricCard
                label="Total Accepted"
                value={stats.totalAccepted}
                icon={<HandHeart className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <MetricCard
                label="Active Pickups"
                value={stats.active}
                icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <MetricCard
                label="Completed"
                value={stats.completed}
                icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab("browse")}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors text-sm sm:text-base"
                >
                  <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Browse Donations
                </button>
                <button
                  onClick={() => setActiveTab("active")}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm sm:text-base"
                > View Active</button>
              </div>
            </div>
          </>
        )}

        {activeTab === "browse" && <BrowseDonations />}
        {activeTab === "active" && <ActiveDonations />}
        {activeTab === "history" && <DonationHistory />}
      </div>
    </Navbar>
  );
};

export default NGODashboard;
