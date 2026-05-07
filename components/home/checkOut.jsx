import { signOut, useSession } from "next-auth/react";
import UserFormupdate from "./userformUpdate";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CheckOut({ onClose, plan }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userData = session?.user;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // LOGOUT FUNCTION
  // =========================
  async function logout() {
    try {
      // backend logout
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userData?.id,
        }),
      });

      // next-auth logout
      await signOut({
        callbackUrl: "/login",
      });

    } catch (error) {
      console.error("Logout failed:", error);

      // fallback logout
      await signOut({
        callbackUrl: "/login",
      });
    }
  }

  // =========================
  // CONFIRM PAYMENT
  // =========================
  async function ConfirmationFnc() {
    try {
      if (isSubmitting) return;

      setIsSubmitting(true);

      const isNaira = userData?.spaceOne?.includes("Naira");

      const price = isNaira
        ? plan.priceNaira
        : plan.priceDollar;

      const data = {
        packageName: plan.name,
        gameLimit: plan.gameLimit,
        validDays: plan.validDays,
        earningRate: plan.earningRate,
        price: price,
        userData: userData,
      };

      const response = await fetch("/api/comfirmPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const newPostData = await response.json();

      if (!response.ok) {
        alert(
          newPostData.message ||
            "Something went wrong, please try again later"
        );

        setIsSubmitting(false);
        return;
      }

      alert(
        "Your payment is under review. We will notify you once it is confirmed."
      );

      // logout after payment request
      await logout();

    } catch (error) {
      console.error(error);

      alert("Something went wrong");

      setIsSubmitting(false);
    }
  }

  const isNoEmail = userData?.email?.includes("noemail");

  const isDollar = userData?.spaceOne?.includes("Dollar");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-2xl mx-auto my-10 max-h-[90vh] overflow-y-auto">
        
        {!isNoEmail ? (
          <>
            <p className="text-center font-bold text-2xl">
              Check Out
            </p>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-3 py-2 rounded-md"
              >
                Close
              </button>
            </div>

            <p className="text-center text-blue-900 text-lg mt-5">
              Make your payment to this account
            </p>

            {/* PAYMENT ACCOUNT */}
            <div className="border p-5 mt-3 rounded-md flex flex-col gap-6 md:flex-row md:justify-center">
              
              {isDollar ? (
                <div className="text-center bg-blue-300 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-5 w-full md:w-[320px]">
                  
                  <h3 className="text-lg font-semibold">
                    Payment In Dollars
                  </h3>

                  <div className="font-bold mt-3">
                    Account Number:
                  </div>

                  <p>2047740387</p>

                  <div className="font-bold mt-3">
                    Account Name:
                  </div>

                  <p>EDUQUIZZ GLOBAL LIMITED</p>

                  <div className="font-bold mt-3">
                    Bank:
                  </div>

                  <p>First Bank Plc.</p>
                </div>
              ) : (
                <div className="text-center bg-orange-300 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-5 w-full md:w-[320px]">
                  
                  <h3 className="text-lg font-semibold">
                    Payment In Naira
                  </h3>

                  <div className="font-bold mt-3">
                    Account Number:
                  </div>

                  <p>2047740103</p>

                  <div className="font-bold mt-3">
                    Account Name:
                  </div>

                  <p>EDUQUIZZ GLOBAL LIMITED</p>

                  <div className="font-bold mt-3">
                    Bank:
                  </div>

                  <p>First Bank Plc.</p>
                </div>
              )}
            </div>

            {/* PACKAGE */}
            <div className="mt-5">
              Package:{" "}
              <span className="font-bold">
                {plan.name}
              </span>
            </div>

            {/* TOTAL */}
            <div className="flex justify-between mt-5">
              <p>Total</p>

              <p className="font-bold text-[1.2em]">
                {isDollar
                  ? plan.priceDollar
                  : plan.priceNaira}
              </p>
            </div>
          </>
        ) : (
          <UserFormupdate />
        )}

        {/* BUTTON */}
        {!isNoEmail && (
          <div className="mt-5 flex justify-center">
            <button
              disabled={isSubmitting}
              onClick={ConfirmationFnc}
              className={`bg-[#0f1632] p-3 rounded-md text-white transition ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting
                ? "Processing..."
                : "After Payment Click To Confirm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}