import SearchIcon from "../searchIcon";
import UserIcon from "../icons/user";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogoutIcon } from "../icons/logouticon";

export default function AdminNavBar(props) {
  const router = useRouter();
  const [profileSettings, setProfileSettings] = useState(false);

  function formatCustomDate(date = new Date()) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];

    const suffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
  
    return `${dayName}, ${day}${suffix(day)} ${monthName}`;
  }

  function toggleProfileSettings() {
    setProfileSettings((prev) => !prev);
  }

  async function logout() {
    await signOut({ redirect: false });  // prevents full page redirect
    router.push ("/adminlogin");
  }

  return (
    <div className="bg-white p-3 rounded-md mt-5 flex items-center justify-between relative">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
          <SearchIcon className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-100 p-2 pl-10 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <p>{formatCustomDate()}</p>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-2 relative">
        <div
          className="border-2 border-gray-400 w-[30px] p-1 rounded-full bg-gray-300 cursor-pointer"
          onClick={toggleProfileSettings}
        >
          <UserIcon className="w-5 h-5" />
        </div>

        <div>
          <p className="font-bold">Admin User</p>
          <p>{props.data.user.email}</p>
        </div>

        {/* Dropdown */}
        {profileSettings && (
          <div className="p-5 rounded-md bg-gray-100 absolute top-[80px] right-0 shadow-md z-50">
            <div className="flex justify-end">
              <button
                onClick={toggleProfileSettings}
                className="hover:text-red-600 border-2 border-gray-400 px-2 rounded-full"
              >
                x
              </button>
            </div>

            <div
              className="p-5 rounded-md bg-gray-100 flex gap-2 cursor-pointer hover:text-purple-600"
              onClick={logout}
            >
              <LogoutIcon />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
