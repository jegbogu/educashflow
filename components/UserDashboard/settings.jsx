import React, { useState } from "react";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";

export default function Settings({ userData, onUpdate, onBack }) {
  const [formData, setFormData] = useState({
    username: userData.username || "",
    email: userData.email || "",
    fullName: userData.fullName || "",
    membership: userData.membership || "",
    level: userData.level || 0,
    points: userData.points || 0,
    amountMade: userData.amountMade || 0,
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onUpdate(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-5">
      {/* Header Section */}

      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
        Account Settings
      </h1>

      {/* Main Content */}
      <div className="max-w-5xl py-10 ">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Account Info Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div className="p-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              {/* Membership */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Membership
                </label>
                <input
                  type="text"
                  name="membership"
                  value={formData.membership}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Level
                </label>
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Points */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Amount Made */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Amount Made ($)
                </label>
                <input
                  type="number"
                  name="amountMade"
                  value={formData.amountMade}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Password Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-500" />
              Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-1 relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-purple-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="p-1 relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-purple-600"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end border-t border-gray-200 pt-6">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
