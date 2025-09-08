 
 
import { UsersIcon } from "../icons/navBarIcon";

export default function DashboardOverview(props){
    
    return(
       <div className="mt-5 bg-white p-5 rounded-md">
          <h2 className="font-bold text-lg">Dashboard Overview</h2>
          <p className="font-light">Welcome back! Here’s what’s happening with your platform</p>
          <div className="flex mt-5 gap-5">

            <div className="rounded-[10px] border-2 border-gray-200 p-5 shadow-md">
            <div className="flex gap-[60px]">
                <p className="font-bold">Total Users</p>
                <span><UsersIcon w-4 h-4/></span>
            </div>
            <p className="mt-5 font-bold">{props.overviewData[1].totalUsers}</p>
            <p className="text-green-400">{props.overviewData[0].userRate} from last month</p>
           </div>

            <div className="rounded-[10px] border-2 border-gray-200 p-5 shadow-md">
            <div className="flex gap-[60px]">
                <p className="font-bold">Active Quizzes</p>
                <span><img src="book-album-svgrepo-com.svg" className="w-6 h-6"/></span>
            </div>
            <p className="mt-5 font-bold">1,049</p>
            <p className="text-green-400">+8.2% from last month</p>
           </div>

            <div className="rounded-[10px] border-2 border-gray-200 p-5 shadow-md">
            <div className="flex gap-[60px]">
                <p className="font-bold">Engagement Rate</p>
               <span><img src=" line-chart-up-02-svgrepo-com.svg" className="w-6 h-6"/></span>
            </div>
            <p className="mt-5 font-bold">453</p>
            <p className="text-green-400">+5.1% from last month</p>
           </div>

            <div className="rounded-[10px] border-2 border-gray-200 p-5 shadow-md">
            <div className="flex gap-[60px]">
                <p className="font-bold">Monthly Activity</p>
               <span><img src="line-chart-up-svgrepo-com.svg" className="w-6 h-6"/></span>
            </div>
            <p className="mt-5 font-bold">7,890</p>
            <p className="text-green-400">+15.3% from last month</p>
           </div>

          </div>
        </div>
    )
}