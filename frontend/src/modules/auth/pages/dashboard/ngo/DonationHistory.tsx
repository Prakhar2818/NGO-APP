import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import DonationCard from "../../../../components/DonationCard";

const DonationHistory: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    api.get("/donation/ngo/history").then((res) => {
      setHistory(
        res.data.donations.filter((d: any) => d.status === "PICKED_UP"),
      );
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {history.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No donation history found.
        </div>
      ) : (
        history.map((d) => (
          <DonationCard
            key={d._id}
            foodName={d.foodName}
            quantity={d.quantity}
            restaurantName={d.restaurant?.name}
            address={d.restaurant?.address}
            status="PICKED_UP"
            tags={[d.status, "Completed"]}
            footerText={`Picked at: ${new Date(d.pickedUpAt).toLocaleString()}`}
            expiryTime={d.expiryTime}
          />
        ))
      )}
    </div>
  );
};

export default DonationHistory;
