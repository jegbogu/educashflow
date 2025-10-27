import { useState } from "react";
import CouponForm from "./couponform";

export default function Couponssectionone() {
  const [couponModal, setCouponModal] = useState(false);
  return (
    <div className=" bg-white rounded-md">
      {couponModal && <CouponForm onClose={() => setCouponModal(false)} />}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-bold">Coupon Generator</p>
          <p>Create and manage promotional coupon codes</p>
        </div>
        <div>
          <button
            className="bg-blue-900 p-3 text-white rounded-xl"
            onClick={() => setCouponModal(true)}
          >
            Generate new coupon
          </button>
        </div>
      </div>
    </div>
  );
}
