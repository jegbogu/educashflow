import { signOut, useSession } from "next-auth/react";
import UserFormupdate from "./userformUpdate";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CheckOut({ onClose, plan }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userData = session?.user;

  const [isSubmitting, setIsSubmitting] = useState(false); // BUTTON LOCK STATE

  async function ConfirmationFnc() {
    if (isSubmitting) return; // Prevent clicking twice

    setIsSubmitting(true);

    const data = {
      packageName: plan.name,
      gameLimit: plan.gameLimit,
      validDays: plan.validDays,
      earningRate: plan.earningRate,
      price: plan.price,
      userData: userData,
    };

    const response = await fetch("/api/comfirmPayment", {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let newPostData = await response.json();

    if (!response.ok) {
      alert("Something went wrong, please try again later");
      setIsSubmitting(false); // Allow user to retry if request fails
    } else {
      alert("Your payment is under review. We will notify once it is confirmed");
      await signOut();
      router.push("/login");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto my-10 max-h-[90vh] overflow-y-auto">
        {userData.email.includes("noemail") ? (
          " "
        ) : (
          <div>
            <p className="text-center font-bold text-2xl md:text-red-900">Check Out</p>

            <button
              onClick={onClose}
              className="bg-red-500 text-white p-2 rounded-full"
            >
              Close
            </button>

            <p className="text-center text-blue-900 text-lg mt-5">
              Make your payment to this account
            </p>

             <div className="border-2 gray box-shadow p-5 mt-3 rounded-md flex flex-col gap-6 md:flex-row md:justify-center">
  
  <div className="text-center bg-blue-300 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-5 w-full md:w-[320px]">
    <h3 className="text-lg font-semibold">Payment In Dollars</h3>

    <div className="font-bold mt-3">Account Number:</div>
    2047740387

    <div className="font-bold mt-3">Account Name:</div>
    EDUQUIZZ GLOBAL LIMITED

    <div className="font-bold mt-3">Bank:</div>
    First Bank Plc.
  </div>

  <div className="text-center bg-orange-300 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-5 w-full md:w-[320px]">
    <h3 className="text-lg font-semibold">Payment In Naira</h3>

    <div className="font-bold mt-3">Account Number:</div>
    2047740103

    <div className="font-bold mt-3">Account Name:</div>
    EDUQUIZZ GLOBAL LIMITED

    <div className="font-bold mt-3">Bank:</div>
    First Bank Plc.
  </div>

</div>


            <div className="mt-5">
              Package: <span className="font-bold">{plan.name}</span>
            </div>

            <div className="flex justify-between mt-5">
              <p>Total</p>
              <p className="font-bold text-[1.2em]">{plan.price}</p>
            </div>
          </div>
        )}

        {userData.email.includes("noemail") ? <UserFormupdate /> : ""}

        <div className="mt-5 flex justify-center">
          {userData.email.includes("noemail") ? (
            " "
          ) : (
            <button
              disabled={isSubmitting}
              onClick={ConfirmationFnc}
              className={`bg-[#0f1632] p-3 rounded-md text-white transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Processing..." : "After Payment Click To Confirm"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
