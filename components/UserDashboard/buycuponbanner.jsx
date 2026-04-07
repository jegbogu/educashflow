import { useRouter } from "next/router";

export default function Buycouponbanner() {
  const router = useRouter();

  return (
    <div className="border-yellow-400 border rounded-md mt-5 p-5 bg-yellow-100">
      <p className="text-center text-sm sm:text-base">
        Playing without a coupon limits your earnings. Buy one to unlock full
        rewards and earn faster
      </p>

      <div className="flex justify-center mt-5">
        <button
          className="bg-black text-white rounded-lg py-2 px-4 hover:bg-gray-800 transition"
          onClick={() => router.push("/coupons")}
        >
          Buy coupon
        </button>
      </div>
    </div>
  );
}