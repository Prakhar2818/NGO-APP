import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import DonationCard from "../../../../components/DonationCard";
import NotFound from "../../../../../assets/not-found.png";

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
    <div>
      {history.length === 0 ? (
        <div className="flex justify-center items-center md:h-120 h-150 w-full">
          <img className="h-70" src={NotFound} alt="" />
        </div>
      ) : (
        history.map((d) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
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
          </div>
        ))
      )}
    </div>
  );
};

export default DonationHistory;
