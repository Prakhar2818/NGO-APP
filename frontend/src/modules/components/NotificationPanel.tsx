import { Notification } from "../../types/notification.types.js";

interface Props {
  notifications: Notification[];
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NotificationPanel: React.FC<Props> = ({ notifications }) => {
  if (notifications.length === 0) {
    return <div className="p-4 text-gray-500 text-sm">No notifications</div>;
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="px-4 py-3 border-b last:border-b-0 hover:bg-purple-50"
        >
          <p className="font-semibold text-purple-700">{n.title}</p>

          <p className="text-sm text-gray-700">{n.message}</p>

          <p className="text-sm text-gray-600">🍽️ {n.restaurantName}</p>

          <p className="text-xs text-gray-400 mt-1">
            {formatDate(n.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
