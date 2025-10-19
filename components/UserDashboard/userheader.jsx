import { useState } from "react";
import { SettingsIcon } from "../icons/navBarIcon";
import { LogoutIcon } from "../icons/logouticon";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell, Coins, StepForward, TrendingUp } from "lucide-react";

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

            {/* Settings Icon - hidden on small, visible on md+ */}
            <button aria-label="Settings" className="hidden sm:block">
              <SettingsIcon className="w-6 h-6 text-gray-700" />
            </button>

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
                <div className="absolute top-16 right-16 bg-gray-50 border-gray-100 rounded-lg z-50 shadow-lg p-3 w-60 flex flex-col gap-2">
                  <div className="md:hidden flex flex-col space-y-2">
                    <div className="flex gap-4">
                      <span className="capitalize font-semibold">
                        {userData.username}
                      </span>
                      <span className="flex gap-2">{userData.membership}</span>
                    </div>
                    <span className="flex gap-2">
                      <TrendingUp /> Level {userData.level}
                    </span>
                    <span className="flex gap-2"> {userData.points} pts</span>
                    <span className="flex gap-2">
                      <Coins /> $ {userData.amountMade}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <LogoutIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                  <button
                    onClick={() => setProfileSetting(false)}
                    className="flex items-center justify-center justify-self-end mt-1 text-sm text-gray-500 hover:text-red-500"
                  >
                    Close
                  </button>
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
