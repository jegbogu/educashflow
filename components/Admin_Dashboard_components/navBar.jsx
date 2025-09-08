import SearchIcon from "../searchIcon";
import UserIcon from "../icons/user";
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react'; // Changed import here
import { useState, useEffect } from "react";
import { LogoutIcon } from "../icons/logouticon";
 


export default function AdminNavBar(props) {
const router = useRouter();
 
 const [profileSettings, setProfileSetting] = useState(false)

  function formatCustomDate(date = new Date()) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];

  // Add suffix (st, nd, rd, th)
  const suffix = (d) => {
    if (d > 3 && d < 21) return "th"; // 4th–20th
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${dayName}, ${day}${suffix(day)} ${monthName}`;
}

function closeProfile(){
  setProfileSetting(false)
}


 function openProfileSettings(){
setProfileSetting(
        <div className="p-5 rounded-md bg-gray-100  absolute top-[80px] ">
          <div><button onClick={closeProfile} className="hover:text-red-600 ml-[100px] border-2 border-gray-400 pl-1 pr-1 w-[25px] rounded-full">x</button></div>
        <div className="p-5 rounded-md bg-gray-100 flex gap-2   hover:text-purple-600">
        <span><LogoutIcon/></span>
          <button onClick={logout}>Logout</button>
        </div>
        </div>
        
        )
 }



function logout(){
  signOut()
  router.replace('/adminlogin')
}
  return (
    <div className=" bg-white p-3 rounded-md mt-5 flex items-center justify-between">
      <div className="relative w-full max-w-sm">
        {/* Search icon */}
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
          <SearchIcon className="w-5 h-5" />
        </span>
        {/* Search input */}
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          className="bg-gray-100 p-2 pl-10 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>
      <div>
        <p>{formatCustomDate()}</p>
      </div>
      <div className=" flex items-center gap-2">
        <div className="border-2 border-gray-400 w-[30px] p-1 rounded-full bg-gray-300 cursor-pointer" onClick={openProfileSettings}>
            <span><UserIcon className="w-5 h-5"/></span>
        </div>
        <div>
            <p className="font-bold">Admin User</p>
            <p>{props.data.user.email}</p>
        </div>
       {profileSettings}
      </div>
    </div>
  );
}
