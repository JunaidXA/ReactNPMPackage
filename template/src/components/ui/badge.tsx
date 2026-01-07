import React from "react";
import { cn } from "@/lib/utils";
import { BadgeProps } from "../types";

const Badge: React.FC<BadgeProps> = ({ variant, value, className, icon }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "id":
        return "bg-[#FEF1EB] !text-[#FF0000]";
      case "inactive":
        return "bg-[#FF0000] rounded-md !text-white";
      case "active":
        return "bg-[#3EB780] rounded-md !text-white";
      case "unpaid":
        return "bg-[#FF0000] !text-white";
      case "paid":
        return "bg-[#3eb780] rounded-md !text-white";
      case "cancelled":
        return "bg-[#FF0000] rounded-md !text-white";
      case "success":
        return "bg-[#3eb780] rounded-md !text-white";
      case "refunded":
        return "bg-[#FF0000] rounded-md !text-white";
      case "pending":
        return "bg-primary rounded-md !text-white";
      case "deleted":
        return "bg-[#FF0000] rounded-md !text-white";
      case "product-item":
        return "bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full";
      default:
        return "border-primary-600 bg-primary-600 text-white";
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[5px] border px-1.5 py-1.25 font-bold text-xsm leading-none",
        getVariantClasses(),
        className
      )}
    >
      {icon || <i className="ti ti-point-filled text-[12px]"></i>}
      <span className="pr-1">{value}</span>
    </div>
  );
};

export default Badge;
