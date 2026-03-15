import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Coins,
  TrendingUp,
  LogOutIcon,
  SettingsIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import CheckOut from "../home/checkOut";

 

export default function Userheader() {
  const [profileSettings, setProfileSetting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: session, status } = useSession();
   
  const[checkout, setCheckOut] = useState(false)
   const userData = session?.user;
  if (status === "loading") {
  return null; // or a loader
}
  
   

  const router = useRouter();
////////////////////////////////////  ///
const [userInfo, setUserInfo] = useState([])
    const allNotification = [
    {
        key:"coupon", 
        msg: "Playing without a coupon limits your earnings. Buy one to unlock full rewards and earn faster",
        link: '/coupons',
        userBtn: 'Buy Coupon'
        
    },
    {
        key:"activate", 
        msg: "You must activate your account for you to have all benefits",
        link: 'activate',
        userBtn: 'Activate Your Account',
    },
    {
        key:"fullname", 
        msg: "Update Your fullname and email",
        link: '#',
        userBtn: 'Update Now'
    },
    ]
    useEffect(()=>{
       const userNotifications =[]
        if(userData?.membership==='Free plan'){
            userNotifications.push(allNotification[0])
        }
        if(userData?.activate==='false'){
            userNotifications.push(allNotification[1])
        }
        if(userData?.email.includes("noemail")){
            userNotifications.push(allNotification[2])
        }
        setUserInfo(userNotifications)

    },[userData])

   console.log(userData)
    //this is for those that click activate
async function activateUser(){
const response = await fetch('api/activateUser',{
  method:'POST',
  body: JSON.stringify({userData}),
  headers:{"Content-Type":"application/json"},
});
let resData = await response.json()
alert(resData.message)
await signOut()
router.push('/login')
}
 


function toggleProfile() {
    setProfileSetting((prev) => !prev);
  }
  function toggleNotifications() {
    setShowNotifications((prev) => !prev);
  }

  function logout() {
    signOut();
    router.replace("/login");
  }

  return (
    <div className="w-full">
      {checkout && <CheckOut onClose={()=>setCheckOut(false)}  />}
      {/* HEADER BAR */}
      <div className="bg-white shadow-md mb-5">
        <div className=" flex flex-wrap justify-between items-center px-4 py-3 md:py-2 max-w-7xl mx-auto gap-3">
          {/* Left Logo */}
          <div className="flex-shrink-0">
            <div>
              <img src="logo.jpg"  alt="logo" width={60} className="border rounded-md"/>
              </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-end">
            {/* Level Badge */}
            <div className="bg-orange-300 hidden sm:block px-2 py-1 rounded-full border text-orange-900 font-medium text-sm md:text-base">
              Level {userData?.level}
            </div>

            {/* Balance Badge */}
            <div className="bg-blue-300 hidden sm:block px-2 py-1 rounded-full border text-blue-900 font-medium text-sm md:text-base">
              {userData?.spaceOne == "Null"? "No Currency":userData?.spaceOne.includes("Naira")? `₦${userData?.amountMade.toFixed(2)}`: `$${userData?.amountMade.toFixed(2)}`}
            </div>

            {/* Points - hidden on very small screens */}
            <p className="font-medium hidden sm:block">{userData?.points} pts</p>

            {/* Notifications */}
            <div
              className="relative inline-flex items-center cursor-pointer"
              onClick={toggleNotifications}
            >
              <img
                src="notification-bell-on-svgrepo-com.svg"
                alt="Notifications"
                className="w-8 h-8 text-gray-700"
              />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full leading-none">
              {userInfo.length}
              </span>

               {showNotifications && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => setShowNotifications(false)}
  >
    {/* Modal */}
    <div
      className="bg-white rounded-2xl shadow-xl w-[360px] max-h-[75vh] overflow-y-auto p-5 relative animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Notifications
        </h2>

        <button
          onClick={() => setShowNotifications(false)}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        {userInfo && userInfo.length > 0 ? (
          userInfo.map((el) => (
            <div
              key={el.key}
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:shadow-sm transition"
            >
              <p className="leading-relaxed">{el.msg}</p>

              {el.link==='#'?
              <button className="mt-4 w-full bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium py-2 rounded-lg transition" onClick={()=>{setCheckOut(true);   setShowNotifications(false)}}>
                  {el.userBtn}
                </button>:
                el.link==='activate'?
              <button className="mt-4 w-full bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium py-2 rounded-lg transition" onClick={()=>{activateUser()}}>
                  {el.userBtn}
                </button>:

              <Link href={el.link}>
                <button className="mt-4 w-full bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium py-2 rounded-lg transition">
                  {el.userBtn}
                </button>
              </Link>
                }
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            No new notifications 🎉
          </div>
        )}
      </div>
    </div>
  </div>
)}
            </div>

            {/* User Info - hidden on small screens */}
            <div className="hidden sm:block text-right">
              <p className="font-semibold truncate max-w-[100px] md:max-w-none">
                {userData?.username}
              </p>
              <p className="text-sm text-gray-500">{userData?.membership}</p>
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
                        {userData?.username}
                      </span>
                      <span className="text-sm text-purple-600 font-medium">
                        {userData?.membership}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        Level {userData?.level}
                      </span>
                      <span>{userData?.points} pts</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-500" />$
                        {userData?.amountMade}
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
          Welcome back, {userData?.username}!
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Ready to earn more points today? Let&apos;s dive into some exciting
          quizzes!
        </p>
      </div>
    </div>
  );
}
