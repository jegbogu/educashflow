import { signOut, useSession } from "next-auth/react";
import UserFormupdate from "./userformUpdate";
 import { useRouter } from "next/router";
 

export default function CheckOut({onClose, plan}){
  const router = useRouter()
const { data: session, status } = useSession();
  const userData = session?.user
 
  
   
    async function ConfirmationFnc(){
        
        const data = {
            packageName: plan.name,
             gameLimit: plan.gameLimit,
      validDays:plan.validDays,
      earningRate:plan.earningRate,
            price: plan.price,
            userData: userData,
        }
    const response = await fetch(
      "/api/comfirmPayment",
      {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
 let newPostData = await response.json();
   
    if (!response.ok) {
     alert("Something went wrong, please try again later")
    }else{
      
      alert("Your payment is under review. We will notify once it is confirmed")
      await signOut()
    router.push('/login')
    }
   } 
    





    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
 
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto my-10 max-h-[90vh] overflow-y-auto"> 
        {userData.email.includes("noemail")?
                " ":<div>
      <p className="text-center font-bold text-2xl">Check Out</p>
            <button  onClick={onClose} className="bg-red-500 text-white p-2 rounded-full">Close</button>
            <p className="text-center text-blue-900 text-lg mt-5">Make your payment to this account</p>
            <div className="border-2 gray box-shadow p-5 mt-3 rounded-md">
                <div className="text-center">
                <span className="font-bold">Account Number: </span> 0987654321
                </div>
                <div className="text-center">
                <span className="font-bold">Account Name: </span> John Doe
                </div>
               <div className="text-center mt-5">
                <span className="font-bold">Bank: </span> ABC Bank Plc.
               </div>
                
                
            </div>
            <div className="mt-5">
                Package: <span className="font-bold">{plan.name}</span>
            </div>
            <div className="flex justify-between mt-5">
                <p>Total</p>
                <p className="font-bold text-[1.2em]">{plan.price}</p>
            </div>
        </div>}
            
            {userData.email.includes("noemail")?<UserFormupdate/>:""}
            <div className="mt-5 flex justify-center">
                {userData.email.includes("noemail")?
                " ":
                <button className="bg-[#0f1632] p-3 rounded-md text-white" onClick={()=>{ConfirmationFnc()}}>After Payment Click To Confirm</button>
                }
            </div>
        </div>
        </div>
    )
}