// app/components/CouponForm.jsx (or anywhere under /components)
// "use client" is required because we use state & events
"use client";

import { useState } from "react";
import CouponTable from "./coupontable";
import { couponPlans } from "@/config/couponConfig";

export default function CouponForm({ onCreate, onCreateBulk, onClose}) {
  // form state
  const [code, setCode] = useState("");
  const [cost, setCost] = useState("");
  const [pack, setPack] = useState("");
  const [rate, setRate] = useState("")
  const [description, setDescription] = useState("");
  const [gameLimit, setGameLimit] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [autoExpire, setAutoExpire] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function generateCode() {
    // 6 blocks of 4, alphanumeric (e.g., X7KQ-9M2A-…)
    const block = () =>
      Math.random().toString(36).toUpperCase().slice(2, 6).padEnd(4, "X");
    setCode(`${block()}-${block()}-${block()}`);
  }

  function validate() {
    const e = {};
    if (!code.trim()) e.code = "Please enter or generate a coupon code.";
    if (description.length > 200) e.description = "Max 200 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

function findPackage(pack) {
  if (!pack) {
    setDescription("");
    setGameLimit("");
    setExpiryDays("");
    setRate("")
    return; // stop here if no package
  }

  const foundPlan = couponPlans.find((el) => el.name === pack);

  if (foundPlan) {
    setDescription(foundPlan.features);
    setGameLimit(foundPlan.gameLimit);
    setExpiryDays(foundPlan.validDays);
    setCost(foundPlan.price);
    setRate(foundPlan.earningRate)
  } else {
    // optional: reset if not found
    setDescription("");
    setGameLimit("");
    setExpiryDays("");
    setCost("")
    setRate("")
  }
}
 
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        code: code.trim(),
        cost:cost.trim(),
        rate: Number(rate),
        pack: pack.trim(),
        description: description,
        gameLimit: Number(gameLimit),
        expiryDays: Number(expiryDays),
        autoExpire,
      };


        const response = await fetch(
      "api/couponform",
      {
        body: JSON.stringify(payload),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
   
     
    let newPostData = await response.json();
   
    if (!response.ok) {
     alert(newPostData.message)
    }else{
      
     alert(newPostData.message)
     
   setCode(" ")
   setDescription("") ;
    setGameLimit("");
    setExpiryDays("");
    setCost("")
      setRate("")

    }
  


    
      // if parent provides a callback, use it; otherwise just log
      if (typeof onCreate === "function") {
        await onCreate(payload);
      } else {
        console.log("Create coupon payload:", payload);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateBulk() {
    if (typeof onCreateBulk === "function") {
      await onCreateBulk();
    } else {
      console.log("Create Multiple Coupon clicked");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
 
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto my-10 max-h-[90vh] overflow-y-auto">
    <form
      onSubmit={handleSubmit}
      className="max-w-xl w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
    >
      {/* Coupon Code + Generate */}
      <div>
        <div className="flex justify-between">
          <p className="text-lg">Generate New Coupon</p>
          <p onClick={onClose} className="bg-red-700 p-2 text-white rounded-[30px] cursor-pointer">Close</p>
        </div>
        <label className="block text-[15px] font-semibold mb-2">
          Coupon Code
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder=" "
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={generateCode}
            className="shrink-0 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
          >
            Generate
          </button>
        </div>
        {errors.code && (
          <p className="text-sm text-red-600 mt-2">{errors.code}</p>
        )}
      </div>
      <div>
        <label className="block text-[15px] font-semibold mb-2">
          Pack
        </label>
        <select 
        name="pack" 
        id="pack" 
        value={pack}
        onChange={(e) => {setPack(e.target.value); findPackage(e.target.value) }}
       

        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" >
          <option value="">Select a pack</option>
          {couponPlans.map((el)=>(
            <option>
              {el.name}
            </option>
          ))}
        </select>
      </div>

      {/* Features */}
      <div>
        <label className="block text-[15px] font-semibold mb-2">
          Features
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Choose a pack, the feacture would be seen here"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Optional</span>
          <span>{description.length}/200</span>
        </div>
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Game Limit */}
      <div>
        <label className="block text-[15px] font-semibold mb-2">
          Game Limit
        </label>
         <input type="text" name="" id="" value={gameLimit}  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 "/>
      </div>

      {/* Expiry (Days) */}
      <div>
        <label className="block text-[15px] font-semibold mb-2">
          Expiry (Days)
        </label>
               <input type="text" name="" id="" value={expiryDays}  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"/>
      </div>
      {/* cost*/}
      <div>
        <label className="block text-[15px] font-semibold mb-2">
          Cost
        </label>
               <input type="text" name="" id="" value={cost}  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"/>
      </div>
      {/*rate*/}
      <div>
        <label className="block text-[15px] font-semibold mb-2">
          Earning Rate
        </label>
               <input type="text" name="" id="" value={rate}  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"/>
      </div>

      {/* Auto-expire toggle */}
      <div className="flex items-start justify-between rounded-2xl bg-gray-50 px-4 py-4">
        <div>
          <p className="text-[15px] font-semibold">Auto-expire if not activated</p>
          <p className="text-sm text-gray-500">
            Automatically expire if not used within the time limit
          </p>
        </div>

        <button
          type="button"
          aria-pressed={autoExpire}
          onClick={() => setAutoExpire((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            autoExpire ? "bg-purple-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
              autoExpire ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleCreateBulk}
          className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold hover:bg-gray-50"
        >
          Create Multiple Coupon
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
    </div>
    </div>
  );
}
