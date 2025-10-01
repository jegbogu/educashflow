// app/components/CouponForm.jsx (or anywhere under /components)
// "use client" is required because we use state & events
"use client";

import { useState } from "react";

export default function CouponForm({ onCreate, onCreateBulk, onClose}) {
  // form state
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [gameLimit, setGameLimit] = useState("1");
  const [expiryDays, setExpiryDays] = useState("30");
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        code: code.trim(),
        description: description.trim(),
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
   setDescription("")
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    
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
            placeholder="Enter coupon code..."
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

      {/* Description */}
      <div>
        <label className="block text-[15px] font-semibold mb-2">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this coupon..."
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
        <select
          value={gameLimit}
          onChange={(e) => setGameLimit(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="1">1 Game</option>
          <option value="3">3 Games</option>
          <option value="5">5 Games</option>
          <option value="10">10 Games</option>
          <option value="9999">Unlimited</option>
        </select>
      </div>

      {/* Expiry (Days) */}
      <div>
        <label className="block text-[15px] font-semibold mb-2">
          Expiry (Days)
        </label>
        <select
          value={expiryDays}
          onChange={(e) => setExpiryDays(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="7">7 Days</option>
          <option value="14">14 Days</option>
          <option value="30">30 Days</option>
          <option value="60">60 Days</option>
          <option value="90">90 Days</option>
        </select>
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
  );
}
