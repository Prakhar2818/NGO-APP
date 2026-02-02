interface Notification {
  id?: string;
  title: string;
  message: string;
  restaurantName?: string;
  createdAt: string;
}
interface Props {
  notifications: Notification[];
  onClose?: () => void;
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

const NotificationPanel: React.FC<Props> = ({ notifications, onClose }) => {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm text-center">
        <p className="mb-2">No notifications</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-purple-600 hover:text-purple-700 text-xs font-medium"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b px-4 py-2 flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Notifications
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            X
          </button>
        )}
      </div>
      {notifications.map((n, index) => (
        <div
          key={n.id || index}
          className="px-4 py-3 border-b last:border-b-0 hover:bg-purple-50 transition-colors"
        >
          <p className="font-semibold text-purple-700">{n.title}</p>

          <p className="text-sm text-gray-700">{n.message}</p>

          {n.restaurantName && (
            <p className="text-sm text-gray-600">🍽️ {n.restaurantName}</p>
          )}

          <p className="text-xs text-gray-400 mt-1">
            {formatDate(n.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
