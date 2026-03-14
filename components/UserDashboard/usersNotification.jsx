import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react";
export default function UsersNotification(){
       const { data: session, status } = useSession();
       const userData = session?.user;
       
    const [userInfo, setUserInfo] = useState([])
    const allNotification = [
    {
        key:"coupon", 
        msg: "Playing without a coupon limits your earnings. Buy one to unlock full rewards and earn faster"
    },
    {
        key:"activate", 
        msg: "You must activate your account for you to have all benefits"
    },
    {
        key:"fullname", 
        msg: "Your fullname and email is required"
    },
    ]
    useEffect(()=>{
       const userNotifications =[]
        if(userData?.membership==='Free plan'){
            userNotifications.push(allNotification[0].msg)
        }
        if(userData?.active==='null'){
            userNotifications.push(allNotification[1].msg)
        }
        if(userData?.email.includes("noemail")){
            userNotifications.push(allNotification[2].msg)
        }
        setUserInfo(userNotifications)

    },[userData])

    

    return(
       <>
       {userInfo &&
                      userInfo.length > 0 ? (
                        userInfo.map((msg, key) => (
                          <div
                            key={key}
                            className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                          >
                            {msg}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center">
                          No new notifications 🎉
                        </p>
                      )}
       
       
       </>
    )
}