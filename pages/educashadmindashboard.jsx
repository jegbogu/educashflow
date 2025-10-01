import DashboardOverview from "@/components/admin/dashboardOverview";
import RecentActivity from "@/components/admin/recentActivity";
import Spinner from "@/components/icons/spinner";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import connectDB from "@/utils/connectmongo";
import Users from "../model/registerSchema";
import Activity from "../model/recentactivities";
import DashboardLayout from "@/components/admin/layout";
import styles from "@/styles/admin.module.css";
import QuickActions from "@/components/admin/quickActions";

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
  //Overview component starts
  //this is to get the number of users
  const users = props.users;
  const totalUsers = users.length;

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
      if (!u.createdAt) return acc;

      // Ensure it's a Date object
      const d = new Date(u.createdAt);
      if (isNaN(d)) return acc;

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0"); // 01-12

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

  const usersRate = getCurrentVsLastMonthGrowth(users);
  const overviewData = [{ userRate: usersRate }, { totalUsers: totalUsers }];
  //Overview component ends

  //this is for recent activities
  const allActivities = props.activities;

  return (
    <DashboardLayout>
      {/* <div className="bg-gray-300 min-h-screen pl-5 pr-5 flex gap-5">
            <QuickActions />
            
    </div> */}
      <div className={styles.dashboardPage}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Dashboard Overview</h1>
          <p className={styles.dashboardSubtitle}>
            Welcome back! Here's what's happening with your platform
          </p>
        </div>

        <DashboardOverview overviewData={overviewData} />

        <div className={styles.contentGrid}>
          <div className={styles.activitySection}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <RecentActivity allActivities={allActivities} />
          </div>

          <div className={styles.actionsSection}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  await connectDB();
  const users = await Users.find({}).lean();
  const activities = await Activity.find({}).lean();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
      activities: JSON.parse(JSON.stringify(activities)),
    },
  };
}
