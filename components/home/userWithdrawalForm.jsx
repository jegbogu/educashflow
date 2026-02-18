import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/icons/spinner";
import { useSession } from "next-auth/react";
import { quizConfig } from "@/config/quizConfig";

export default function UserWithdrawalForm({onClose}) {
  const router = useRouter();
  const { data: session } = useSession();
  const userData = session?.user;

  const [loading, setLoading] = useState(false);
  const [finalMessage, setFinalMessage] = useState(null);

  const [errors, setErrors] = useState({});

  const accountNameRef = useRef();
  const accountNumberRef = useRef();
  const bankNameRef = useRef();
  const amountRef = useRef();

//Withdrawals
 const withdrawalNeededDollar = quizConfig.minimumAmount-userData?.amountMade

 const withdrawalNeededNaira = quizConfig.minimumAmountNaira-userData?.amountMade
  const PendingWithdrawal = (Math.abs(quizConfig.minimumAmount-userData?.amountMade)).toFixed(2)

 let minimumInCurrency;
  if(userData?.spaceOne.includes("Naira")){
    minimumInCurrency = <div>
  {quizConfig.minimumAmountNaira> userData?.amountMade?<div className={styles.withdrawalNeeded}>{`₦${withdrawalNeededNaira} more needed`}</div>:`₦${PendingWithdrawal} Available in your account for withdrawal`}
    </div>
  }else{
   minimumInCurrency = <div>
{quizConfig.minimumAmount> userData?.amountMade?<div className={styles.withdrawalNeeded}>{`$${withdrawalNeededDollar} more needed`}</div>:`$${PendingWithdrawal} Available in your account for withdrawal`} 
    </div>
  }




  async function submitHandler(event) {
    event.preventDefault();
    setLoading(true);
    setFinalMessage(null);

    const enteredAccountName = accountNameRef.current.value.trim();
    const enteredAccountNumber = accountNumberRef.current.value.trim();
    const enteredBankName = bankNameRef.current.value.trim();
    const enteredAmount = amountRef.current.value.trim();

    let formErrors = {};

    if (enteredAccountName.length < 3) {
      formErrors.accountName = "Account Name must be at least 3 characters";
    }

    if (enteredAccountNumber.length < 6) {
      formErrors.accountNumber = "Account Number must be valid";
    }

    if (enteredBankName.length < 3) {
      formErrors.bankName = "Bank Name must be at least 3 characters";
    }

    if (!enteredAmount || Number(enteredAmount) <= 0) {
      formErrors.amount = "Enter a valid withdrawal amount";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    const data = {
      accountName: enteredAccountName,
      accountNumber: enteredAccountNumber,
      bankName: enteredBankName,
      amount: enteredAmount,
      userData: userData,
    };

    try {
      const response = await fetch("/api/userWithdrawalForm", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        setFinalMessage(
          <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
            {result.message}
          </p>
        );
        setLoading(false);
      } else {
        setFinalMessage(
          <p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100 text-green-700">
            {result.message}
          </p>
        );
        setLoading(false);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (error) {
      setFinalMessage(
        <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
          Something went wrong. Please try again.
        </p>
      );
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
         <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-2xl mx-auto my-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={onClose}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-blue-500"
            >
              Close
            </button>
      <h1 className="text-center text-2xl font-bold text-gray-800">
        Withdraw Funds
      </h1>


      <form className="mt-6 space-y-5" onSubmit={submitHandler}>
        
        {/* Account Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Name
          </label>
          <input
            type="text"
            ref={accountNameRef}
            className="mt-1 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:ring-2 focus:ring-secondary"
            placeholder="Enter account name"
          />
          {errors.accountName && (
            <p className="text-red-600 text-sm mt-1">{errors.accountName}</p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Number
          </label>
          <input
            type="text"
            ref={accountNumberRef}
            className="mt-1 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:ring-2 focus:ring-secondary"
            placeholder="Enter account number"
          />
          {errors.accountNumber && (
            <p className="text-red-600 text-sm mt-1">
              {errors.accountNumber}
            </p>
          )}
        </div>

        {/* Bank Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            ref={bankNameRef}
            className="mt-1 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:ring-2 focus:ring-secondary"
            placeholder="Enter bank name"
          />
          {errors.bankName && (
            <p className="text-red-600 text-sm mt-1">{errors.bankName}</p>
          )}
        </div>

        {/* Amount */}
        <div>
            <p className="text-sm text-red-500 font-bold mb-5 bg-yellow-400 p-3">Minimum you can withdraw is {userData?.spaceOne.includes("Naira")? `₦${quizConfig.minimumAmountNaira}`: `$${minimumAmount}`} </p>

            <p>{minimumInCurrency}</p>
          <label className="block text-sm font-medium text-gray-700">
            Amount to Withdraw
          </label>
          <input
            type="number"
            ref={amountRef}
            className="mt-1 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:ring-2 focus:ring-secondary"
            placeholder="Enter amount"
          />
          {errors.amount && (
            <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded-md w-full mt-4 transition flex items-center justify-center 
            ${
              loading
                ? "bg-secondary/70 cursor-not-allowed"
                : "bg-secondary hover:bg-secondary/90 text-white"
            }`}
        >
          {loading ? <Spinner className="w-5 h-5" /> : "Submit Withdrawal"}
        </button>

        <div>{finalMessage}</div>
      </form>
    </div>
    </div>
  );
}
