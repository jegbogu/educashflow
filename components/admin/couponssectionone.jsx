import { useState } from "react"
import CouponForm from "./couponform"

export default function Couponssectionone(){
    const [couponModal, setCouponModal] = useState(false)
    return(
        
        <div className=" bg-white p-3 rounded-md mt-5">
            {couponModal && <CouponForm onClose={()=>setCouponModal(false)} />}
        <div className=" mt-5 flex items-center justify-between">
            <div>
                <p className="font-bold">Coupon Generator</p>
                <p>Create and manage promotional coupon codes</p>
            </div>
            <div>
                <button className="bg-blue-900 p-2 text-white rounded-xl" onClick={()=>setCouponModal(true)}>
                    Generate new coupon
                </button>
            </div>

        </div>
        </div>
    )
}