import { useRouter } from "next/router"

export default function Buycouponbanner(){
    const router = useRouter()
    return(
        <div className="border-yellow-400 border rounded-md mt-5 p-5 bg-yellow-100">
        <p className="text-center">
          Playing without a coupon limits your earnings. Buy one to unlock full
          rewards and earn faster
        </p>

        <button className="bg-black text-white rounded-lg pt-2 pb-2 pl-4 pr-4 mt-5 ml-[45%]" onClick={()=>{router.push('/coupons')}}>
          Buy coupon
        </button>
      </div>
    )
}