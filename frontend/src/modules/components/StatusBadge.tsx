interface Props {
  status: "PENDING" | "ACCEPTED" | "PICKED_UP";
}

const styles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  PICKED_UP: "bg-green-100 text-green-700",
};

const StatusBadge: React.FC<Props> = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-sm font-mono font-semibold ${styles[status]}`}
  >
    {status.replace("_", " ")}
  </span>
);

export default StatusBadge;
