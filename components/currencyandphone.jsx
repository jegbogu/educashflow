import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CurrencyAndPhone({ userData }) {
  const [phone, setPhone] = useState("");
  const [countryData, setCountryData] = useState(null);
  const [currency, setCurrency] = useState("-- Select A Currency --");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [afterOkAction, setAfterOkAction] = useState(null);

  const router = useRouter();

  function showCustomAlert(message, action = null) {
    setAlertMessage(message);
    setAfterOkAction(() => action);
    setShowAlert(true);
  }

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
  // FORM SUBMIT
  // =========================
  async function ConfirmationFnc() {
    if (isSubmitting) return;

    if (currency === "-- Select A Currency --") {
      showCustomAlert("Please select a currency");
      return;
    }

    if (!phone || phone.length < 7) {
      showCustomAlert("Please enter a valid phone number");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = {
        currency,
        phone,
        countryData,
        userData,
      };

      const response = await fetch("/api/currencyandphone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const newPostData = await response.json();

      if (!response.ok) {
        showCustomAlert(
          newPostData.message || "Something went wrong"
        );

        setIsSubmitting(false);
        return;
      }

      // success alert
      showCustomAlert(
        "Thank you for the update. You will need to login again to continue.",
        async () => {
          await logout();
        }
      );

    } catch (error) {
      console.error(error);

      showCustomAlert("Something went wrong");

      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
        <form className="space-y-6 bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-2xl mx-auto my-10 max-h-[90vh] overflow-y-auto">
          
          <h3 className="text-sm text-gray-700 text-center">
            Please note that this cannot be changed on this account
            and it will affect your coupon purchase and earning,
            so choose wisely.
          </h3>

          {/* Currency */}
          <div className="space-y-2">
            <label
              htmlFor="currency"
              className="font-semibold"
            >
              Choose your preferred currency
            </label>

            <select
              id="currency"
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="-- Select A Currency --">
                -- Select A Currency --
              </option>

              <option value="Naira">Naira</option>
              <option value="Dollar">Dollar</option>
            </select>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="font-semibold">
              Phone Number
            </label>

            <p className="text-sm text-gray-700">
              Just type your country code without +
              eg: 234
            </p>

            <PhoneInput
              country="ng"
              placeholder="234 812 345 6789"
              value={phone}
              enableSearch={true}
              onChange={(value, country) => {
                setPhone(value);
                setCountryData(country);
              }}
              containerClass="w-full"
              inputClass="!w-full !border !rounded-md !py-2"
              buttonClass="!border"
            />
          </div>

          {/* Country Preview */}
          {countryData && (
            <div className="text-xs text-gray-600">
              Country: {countryData.name}
              <br />
              Dial Code: +{countryData.dialCode}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={ConfirmationFnc}
              disabled={isSubmitting}
              className="w-full bg-secondary text-white border-2 border-gray-200 p-2 rounded-md sm:w-1/2 mt-5 hover:bg-white hover:text-secondary hover:border-secondary transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Processing..."
                : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Custom Alert */}
      {showAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            
            <p className="mb-6 text-gray-800">
              {alertMessage}
            </p>

            <button
              onClick={async () => {
                setShowAlert(false);

                if (afterOkAction) {
                  await afterOkAction();
                }
              }}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-white hover:text-secondary border border-secondary transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}