import DashboardOverview from "@/components/Admin_Dashboard_components/dashboardOverview";
import AdminNavBar from "@/components/Admin_Dashboard_components/navBar";
import QuickActions from "@/components/Admin_Dashboard_components/quickActions";
import RecentActivity from "@/components/Admin_Dashboard_components/recentActivity";
import SideBar from "@/components/Admin_Dashboard_components/sideBar";
import Spinner from "@/components/icons/spinner";
import { connect } from "mongoose";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { useEffect } from "react";

import connectDB from "@/utils/connectmongo";
import Users from "../model/registerSchema"

export default function Dashboard(props) {



  const { data: session, status } = useSession();

  
  const router = useRouter();

  // Handle redirects in useEffect
  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "admin") {
      router.replace("/adminlogin");
    } else if (status === "unauthenticated") {
      router.replace("/adminlogin");
    }
  }, [status, session, router]);

  // Show loading state while session is being checked
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
  <div className="text-3xl font-bold">
    <Spinner className="w-12 h-12" />
  </div>
</div>

    );
  }

  // If user is not allowed, return null to prevent flashing content
  if (status !== "authenticated" || session?.user.role !== "admin") {
    return null;
  }

//this is to get the number of users
const users = props.users
const totalUsers = users.length
 

  /**
 * Calculate percentage change
 */
function calculatePercentageChange(current, previous) {
  if (previous === 0 && current === 0) return "0%";
  if (previous === 0) return "+100%"; // avoid division by zero

  const change = ((current - previous) / previous) * 100;
  return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
}

/**
 * Get percentage change for current month vs last month
 */
function getCurrentVsLastMonthGrowth(users) {
  // Count users per month (YYYY-MM)
  const counts = users.reduce((acc, u) => {
    const [day, month, yearTime] = u.createdAt.split("-");
    const [year] = yearTime.split(" ");
    const key = `${year}-${month}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Sort months chronologically
  const months = Object.keys(counts).sort();

  if (months.length < 2) {
    return "Not enough data";
  }

  const lastMonth = months[months.length - 2];
  const currentMonth = months[months.length - 1];

  const previous = counts[lastMonth] || 0;
  const current = counts[currentMonth] || 0;

  return calculatePercentageChange(current, previous);
}

const usersRate =  getCurrentVsLastMonthGrowth(users);
const overviewData = [
  {userRate:usersRate},
  {totalUsers:totalUsers}
]
 

  return (
    <div className="bg-gray-300 min-h-screen pl-5 pr-5 flex gap-5">
      {/* Sidebar (25%) */}
      <div className="w-1/5">
        <SideBar data={session} />
      </div>

      {/* Main content (75%) */}
      <div className="w-4/5">
        <AdminNavBar data={session} />
        <DashboardOverview overviewData={overviewData}/>
         <div className="flex items-stretch gap-3 mt-5">
  <div className="w-1/2 flex flex-col bg-white p-5 rounded-md">
    <RecentActivity />
  </div>

  <div className="w-1/2 flex flex-col bg-white p-5 rounded-md">
    <QuickActions />
  </div>
</div>

      </div>
    </div>
  );
}

export async function getServerSideProps(){
  await connectDB()
  const users = await Users.find({}).lean()
  

  return{
    props:{
      users:JSON.parse(JSON.stringify(users))
    }
  }
}