"use client";
import { useState } from "react";
import { Eye, Copy, Trash2, Calendar } from "lucide-react";

export default function CouponTable({couponData}) {
    console.log(couponData)
  // Dummy data (replace with backend API later)
  const [coupons, setCoupons] = useState( couponData);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };

  const deleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 text-sm mb-4">
        <span className="font-semibold cursor-pointer">All ({coupons.length})</span>
        <span className="text-blue-600 cursor-pointer">
          Active ({coupons.filter((c) => c.status === "Active").length})
        </span>
        <span className="text-blue-600 cursor-pointer">
          Expired ({coupons.filter((c) => c.status === "Expired").length})
        </span>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center gap-2 mb-4">
        <select className="border rounded px-3 py-2 text-sm">
          <option>Bulk actions</option>
          <option>Delete</option>
          <option>Activate</option>
          <option>Expire</option>
        </select>
        <button className="px-3 py-2 bg-gray-100 border rounded text-sm">Apply</button>
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
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Game Limit</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3"></th>
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
                <td className="px-4 py-3">{c.description || "-"}</td>
                <td className="px-4 py-3">#{c.gameLimit}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {c.expires}
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
