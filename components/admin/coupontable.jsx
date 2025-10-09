"use client";
import { useState } from "react";
import { Eye, Copy, Trash2, Calendar } from "lucide-react";

export default function CouponTable({ couponData }) {
  const [coupons, setCoupons] = useState(couponData);

  // Copy coupon code
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };

  // Add days to createdAt
  function addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  // Format to readable date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      weekday: "long", // Monday, Tuesday...
      day: "2-digit",
      month: "long",   // January, February...
      year: "numeric",
    });
  }

  // Delete coupon
  const deleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 text-sm mb-4">
        <span className="font-semibold cursor-pointer">
          All ({coupons.length})
        </span>
         
      </div>

      {/* Bulk actions */}
      <div className="flex items-center gap-2 mb-4">
        <select className="border rounded px-3 py-2 text-sm">
          <option>Bulk actions</option>
          <option>Delete</option>
         
        </select>
        <button className="px-3 py-2 bg-gray-100 border rounded text-sm">
          Apply
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Game Limit</th>
             
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="font-mono">•••••••</span>
                  <Eye className="w-4 h-4 text-gray-500 cursor-pointer" />
                  <Copy
                    className="w-4 h-4 text-gray-500 cursor-pointer"
                    onClick={() => copyCode(c.code)}
                  />
                </td>
                <td className="px-4 py-3">{c.pack || "-"}</td>
                <td className="px-4 py-3">#{c.gameLimit}</td>
                 
                <td className="px-4 py-3 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {formatDate(addDays(c.createdAt, c.expiryDays))}
                </td>
                <td className="px-4 py-3">
                  <Trash2
                    className="w-5 h-5 text-red-600 cursor-pointer"
                    onClick={() => deleteCoupon(c.code)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
