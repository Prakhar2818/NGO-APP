import DonationCard from "../../../../components/DonationCard";
import NotFound from "../../../../../assets/not-found.png";

const DonationHistory = ({ donations = [] }: any) => (
  <div>
    {donations.length === 0 ? (
      <div className="flex justify-center items-center md:h-120 h-150 w-full">
        <img className="h-70" src={NotFound} alt="" />
      </div>
    ) : (
      donations.map((d: any) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
          <DonationCard
            key={d._id}
            foodName={d.foodName}
            quantity={d.quantity}
            ngoName={d.ngo?.organizationName}
            status={d.status}
            tags={["Completed", "Picked Up"]}
            footerText={
              d.pickedUpAt
                ? `Picked up on: ${new Date(d.pickedUpAt).toLocaleDateString()}`
                : "Picked up"
            }
            expiryTime={d.expiryTime}
          />
        </div>
      ))
    )}
  </div>
);

export default DonationHistory;
