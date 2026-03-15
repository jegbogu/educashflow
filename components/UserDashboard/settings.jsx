import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
export default function Settings({ userData }) {

  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: userData.username || "",
    email: userData.email || "",
    
    password: "",
    confirmPassword: "",
  });
  const { data: session, status } = useSession();
 
  const userDat = session?.user;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch("/api/userUpdateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          profileData: {
            id: userDat.id,
          
            password: formData.password
          }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Profile updated successfully");

      setFormData({
        ...formData,
        password: "",
        confirmPassword: ""
      });
      await signOut()
      await router.push('/login')

    } catch (error) {

      console.error(error);
      alert("Something went wrong");

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-5">

      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
        Account Settings
      </h1>

      <div className="max-w-5xl py-10">

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Profile */}
          <section>

            <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>

                <input
                  type="text"
                  value={formData.username}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>


              {/* Email */} <div> <label className="block text-sm font-medium text-gray-600 mb-1"> Email </label> <input type="email" name="email" value={formData.email.includes('noemail')?"Please click on the notification bell to update your email":formData.email} disabled className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed" /> </div>


              

            </div>

          </section>


          {/* Password */}
          <section>

            <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-500" />
              Security
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="relative">

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  New Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>

              </div>


              <div className="relative">

                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm Password
                </label>

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>

              </div>

            </div>

          </section>


          <div className="flex justify-end border-t border-gray-200 pt-6">

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}