import { Pen } from "lucide-react";

const AdReview = ({ adValues }: any) => {
    return (
        <div className="text-sm mb-3">
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Transaction Type
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className={adValues.transactionType === "Buy" ? "text-[#606C82] font-semibold" : "text-red font-semibold"}>
                    {adValues.transactionType}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Asset
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {adValues.asset}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Limits
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    <span className="mr-2">Min: {adValues.limits.min}</span>
                    <span>Max: {adValues.limits.max}</span>
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Pricing Type
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {adValues.pricingType}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Amount
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {adValues.amount}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Your Price
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {adValues.price}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Margin
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {adValues.margin}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Upper Limit
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {adValues.priceLimits.upper}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Lower Limit
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {adValues.priceLimits.lower}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Currency
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold">
                    {adValues.currency}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-1">
                    <span className="text-[#606C82] font-light mr-2">
                        Duration
                    </span>
                    <Pen size={14} className="inline curser-pointer -mt-1" color="#606C82"  />
                </p> 
                <p className="text-[#515B6E] font-semibold text-bold">
                    {adValues.duration.days}days, {adValues.duration.hours}hrs, {adValues.duration.minutes}mins
                </p>
            </div>
            <div>
                <span className="text-xs text-[#606C82]">
                    I agree to the platform's Terms and Conditions.
                </span>
            </div>
        </div>
    )
};

export default AdReview;