import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CurrencyAndPhone({userData}) {
  const [phone, setPhone] = useState("");
  const [countryData, setCountryData] = useState(null);
  const [currency, setCurrency] = useState("-- Select A Currency --");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

   async function ConfirmationFnc(e) {
    e.preventDefault()
      if (isSubmitting) return; // Prevent clicking twice
  
      setIsSubmitting(true);
  
      const data = {
         currency: currency,
         phone: phone,
         countryData:countryData,
         userData:userData
      };
  
      const response = await fetch("/api/currencyandphone", {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      let newPostData = await response.json();
      
  
      if (!response.ok) {
        alert(newPostData.message||"Something went wrong");
        setIsSubmitting(false); // Allow user to retry if request fails
      } else {
        alert("Thank you for the update, please you will have to login again to continue. Thank you");
        moveIt()
        async function moveIt(){
        
        await signOut();
        router.push("/login");
        }
        
      }
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">

      <form className="space-y-6 bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-2xl mx-auto my-10 max-h-[90vh] overflow-y-auto">
             
        <h3 className="text-sm text-gray-700 text-center">
          Please note that this cannot be changed on this account and it will affect your coupon purchase and earning, so choose wisely.
        </h3>

      
        <div className="space-y-2">
          <label htmlFor="currency" className="font-semibold">
            Choose your preferred currency
          </label>

          <select
            id="currency"
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="#">-- Select A Currency --</option>
            <option value="Naira">Naira</option>
            <option value="Dollar">Dollar</option>
          </select>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="font-semibold">
            Phone Number
          </label>
          <p className="text-sm text-gray-700">Just type your country code without + eg: 234</p>
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

        {/* Debug / Example output */}
        {countryData && (
          <div className="text-xs text-gray-600">
            Country: {countryData.name} <br />
            Dial Code: +{countryData.dialCode}
          </div>
        )}
        <div className="flex justify-center">
              <button 
              type="button" 
              onClick={ConfirmationFnc}
              className=" w-full bg-secondary text-white border-2 border-gray-200 p-2 rounded-md sm:w-1/2 mt-5 hover:bg-white hover:text-secondary hover:border-secondary transition">{isSubmitting? "Processing....": "Submit"}</button>
        </div>
      
      </form>
    </div>
  );
}
