import { useState } from "react";
import { SettingsIcon } from "../icons/navBarIcon";
import { LogoutIcon } from "../icons/logouticon";
import { useSession, signOut } from "next-auth/react"; // Changed import here
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

export default function Userheader({ userData }) {
  const [profileSettings, setProfileSetting] = useState(false);
  const router = useRouter();
  function closeProfile() {
    setProfileSetting(false);
  }

  function openProfileSettings() {
    setProfileSetting(
      <div className="absolute top-[80px] right-2 bg-gray-100 rounded-md shadow-lg p-4 flex items-center gap-4">
        {/* Logout Button with Icon */}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
        >
          <LogoutIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
        {/* Close Button */}
        <button
          onClick={closeProfile}
          className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-600 hover:text-red-600 hover:border-red-600 transition-colors"
        >
          X
        </button>
      </div>
    );
  }

  function logout() {
    signOut();
    router.replace("/login");
  }

  return (
    <div>
      <div className="bg-white shadow-md mb-5">
        <div className="flex justify-between items-center px-4 py-2  max-w-7xl mx-auto">
          {/* Left Logo */}
          <div>
            <p className="font-bold text-lg">Educash Flow</p>
          </div>

          {/* Right Section */}
          <div className="flex gap-6 items-center">
            {/* Level Badge */}
            <div className="bg-yellow-300 px-3 py-1 rounded-full border text-yellow-900 font-medium">
             Level { userData.level}
            </div>

            {/* Balance Badge */}
            <div className="bg-green-300 px-3 py-1 rounded-full border text-green-900 font-medium">
              ${ userData.amountMade}
            </div>

            {/* Points */}
            <p className="font-medium">{ userData.points}pts</p>

            {/* Settings */}
            <button aria-label="Settings">
              <SettingsIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Notifications with badge */}
            <div className="relative inline-flex items-center">
              <img
                src="notification-bell-on-svgrepo-com.svg"
                alt="Notifications"
                className="w-9 h-9 text-gray-700"
              />
              <span
                className="absolute -top-[-5px] -right-[-2px] bg-red-500 text-white text-xs 
                   px-1.5 py-0.5 rounded-full leading-none"
              >
                3
              </span>
            </div>

            {/* User Info */}
            <div className="text-right ">
              <p className="font-semibold">{userData.username}</p>
              <p className="text-sm text-gray-500">{userData.membership}</p>
            </div>

            {/* Profile Avatar */}
            <div
              className="w-10 h-10 flex items-center justify-center border-2 rounded-full bg-gray-200 cursor-pointer"
              onClick={openProfileSettings}
            >
              <img
                src="user-alt-1-svgrepo-com.svg"
                alt="User"
                className="w-6 h-6 text-gray-700"
              />
            </div>
            {profileSettings}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-5">
        <span className="text-[1.5em] font-semibold mt-5">
          Welcome back, {userData.username}!
        </span>
        <p className="text-gray-500">
          Ready to earn more points today? Let's dive into some exciting
          quizzes!
        </p>
      </div>
    </div>
  );
}
