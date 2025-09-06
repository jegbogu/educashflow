import SearchIcon from "../searchIcon";
import UserIcon from "../icons/user";
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react'; // Changed import here
 


export default function AdminNavBar() {
const router = useRouter();
  const { data: session, status } = useSession();
 

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
 

  return (
    <div className=" bg-white p-3 rounded-md mt-5 flex items-center gap-[50px]">
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
        <div className="border-2 border-gray-400 w-[30px] p-1 rounded-full bg-gray-300">
            <span><UserIcon className="w-5 h-5"/></span>
        </div>
        <div>
            <p className="font-bold">Admin User</p>
            <p>{session.user.email}</p>
        </div>
      </div>
    </div>
  );
}
