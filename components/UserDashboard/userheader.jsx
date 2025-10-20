import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Coins,
  TrendingUp,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";

export default function Userheader({ userData }) {
  const [profileSettings, setProfileSetting] = useState(false);

  const router = useRouter();

  function toggleProfile() {
    setProfileSetting((prev) => !prev);
  }

  function logout() {
    signOut();
    router.replace("/login");
  }

  return (
    <div className="w-full">
      {/* HEADER BAR */}
      <div className="bg-white shadow-md mb-5">
        <div className=" flex flex-wrap justify-between items-center px-4 py-3 md:py-2 max-w-7xl mx-auto gap-3">
          {/* Left Logo */}
          <div className="flex-shrink-0">
            <p className="font-bold text-lg md:text-xl">Educash Flow</p>
          </div>

          {/* Right Section */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-end">
            {/* Level Badge */}
            <div className="bg-yellow-300 hidden sm:block px-2 py-1 rounded-full border text-yellow-900 font-medium text-sm md:text-base">
              Level {userData.level}
            </div>

            {/* Balance Badge */}
            <div className="bg-green-300 hidden sm:block px-2 py-1 rounded-full border text-green-900 font-medium text-sm md:text-base">
              ${userData.amountMade}
            </div>

            {/* Points - hidden on very small screens */}
            <p className="font-medium hidden sm:block">{userData.points} pts</p>

            

            {/* Notifications */}
            <div className="relative inline-flex items-center">
              <img
                src="notification-bell-on-svgrepo-com.svg"
                alt="Notifications"
                className="w-8 h-8 text-gray-700"
              />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full leading-none">
                3
              </span>
            </div>

            {/* User Info - hidden on small screens */}
            <div className="hidden sm:block text-right">
              <p className="font-semibold truncate max-w-[100px] md:max-w-none">
                {userData.username}
              </p>
              <p className="text-sm text-gray-500">{userData.membership}</p>
            </div>

            {/* Profile Avatar */}
            <div>
              <div
                className="w-10 h-10 flex items-center justify-center border-2 rounded-full bg-gray-200 cursor-pointer"
                onClick={toggleProfile}
              >
                <img
                  src="user-alt-1-svgrepo-com.svg"
                  alt="User"
                  className="w-6 h-6 text-gray-700"
                />
              </div>

              {/* Profile Dropdown */}
              {profileSettings && (
                <div className="absolute top-16 right-16 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5 w-64 flex flex-col gap-4 transition-all duration-200 animate-fade-in">
                  {/* User Info (visible only on mobile) */}
                  <div className="md:hidden flex flex-col space-y-2 border-b border-gray-100 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-semibold text-gray-800">
                        {userData.username}
                      </span>
                      <span className="text-sm text-purple-600 font-medium">
                        {userData.membership}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        Level {userData.level}
                      </span>
                      <span>{userData.points} pts</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-500" />$
                        {userData.amountMade}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-1">
                    <button
                      onClick={() => router.push("/updateProfile")} // your settings handler
                      className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    >
                      <SettingsIcon className="w-5 h-5" />
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    >
                      <LogOutIcon className="w-5 h-5" />
                      Logout
                    </button>
                    <button
                      onClick={() => setProfileSetting(false)}
                      className="text-sm text-gray-400 hover:text-red-500 transition-colors self-end"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="text-xl md:text-2xl font-semibold">
          Welcome back, {userData.username}!
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Ready to earn more points today? Let&apos;s dive into some exciting
          quizzes!
        </p>
      </div>
    </div>
  );
}
