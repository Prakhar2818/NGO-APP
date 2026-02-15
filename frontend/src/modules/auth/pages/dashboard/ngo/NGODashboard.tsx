import { useEffect, useMemo, useState } from "react";
import { HandHeart, Clock, CheckCircle, Search, Users, TrendingUp } from "lucide-react";
import DashboardLayout from "../../../../components/DashboardLayout";
import DashboardOverview from "../../../../components/DashboardOverview";
import BrowseDonations from "./BrowseDonation";
import ActiveDonations from "./ActiveDonations";
import DonationHistory from "./DonationHistory";
import NotificationPanel from "../../../../components/NotificationPanel";
import { socket, stopSocketCycle } from "../../../../../socket";
import { logout } from "../../../../../utils/token";
import { toast } from "react-toastify";
import api from "../../../../../services/api";
import { useNavigate } from "react-router-dom";
import LineTrendChart from "../../../../components/charts/LineTrendChart";
import StackedTrendBars from "../../../../components/charts/StackedTrendBars";
import DonutBreakdownChart from "../../../../components/charts/DonutBreakdownChart";

interface NgoDonation {
  _id: string;
  status: "ACCEPTED" | "PICKED_UP" | "PENDING";
  acceptedAt?: string;
  pickedUpAt?: string;
}

const NGODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "browse" | "active" | "history"
  >("overview");

  const [stats, setStats] = useState({
    totalAccepted: 0,
    active: 0,
    completed: 0,
    pending: 0
  });

  const handleTabChange = (key: string) => {
    setActiveTab(key as "overview" | "browse" | "active" | "history");
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: <Users size={20} /> },
    { key: "browse", label: "Browse", icon: <Search size={20} /> },
    { key: "active", label: "Active", icon: <Clock size={20} /> },
    { key: "history", label: "History", icon: <TrendingUp size={20} /> },
  ];

  const [ngoDonations, setNgoDonations] = useState<NgoDonation[]>([]);

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
      const d = res.data.donations as NgoDonation[];
      setNgoDonations(d);
      setStats({
        totalAccepted: d.length,
        active: d.filter((x: any) => x.status === "ACCEPTED").length,
        completed: d.filter((x: any) => x.status === "PICKED_UP").length,
        pending: d.filter((x: any) => x.status === "PENDING").length,
      });
    });
  }, []);

  const acceptancePickupTrend = useMemo(() => {
    const bucketMap = new Map<
      string,
      { label: string; accepted: number; pickedUp: number }
    >();

    for (const donation of ngoDonations) {
      if (donation.acceptedAt) {
        const acceptedLabel = new Date(donation.acceptedAt).toISOString().slice(0, 10);
        const acceptedBucket = bucketMap.get(acceptedLabel) || {
          label: acceptedLabel,
          accepted: 0,
          pickedUp: 0,
        };
        acceptedBucket.accepted += 1;
        bucketMap.set(acceptedLabel, acceptedBucket);
      }

      if (donation.pickedUpAt) {
        const pickupLabel = new Date(donation.pickedUpAt).toISOString().slice(0, 10);
        const pickupBucket = bucketMap.get(pickupLabel) || {
          label: pickupLabel,
          accepted: 0,
          pickedUp: 0,
        };
        pickupBucket.pickedUp += 1;
        bucketMap.set(pickupLabel, pickupBucket);
      }
    }

    return Array.from(bucketMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [ngoDonations]);

  const acceptancePickupMix = useMemo(
    () => [
      { name: "Active Pickups", value: stats.active, color: "#f59e0b" },
      { name: "Picked Up", value: stats.completed, color: "#10b981" },
    ],
    [stats],
  );

  const handleLogout = async () => {
    stopSocketCycle(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if API call fails, clear local data
    } finally {
      logout();
      navigate("/login");
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
    <DashboardLayout
      title="NGO Dashboard"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      showNotificationBell
      notificationCount={notifications.length}
      onBellClick={() => setShowPanel((p) => !p)}
      userName="NGO User"
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
        {activeTab === "overview" && (
          <DashboardOverview stats={stats} />
        )}

        {activeTab === "browse" && <BrowseDonations />}
        {activeTab === "active" && <ActiveDonations />}
        {activeTab === "history" && <DonationHistory />}
      </div>
    </DashboardLayout>
  );
};

export default NGODashboard;
