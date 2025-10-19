import DashboardOverview from "@/components/admin/dashboardOverview";
import RecentActivity from "@/components/admin/recentActivity";
import Spinner from "@/components/icons/spinner";
import QuickActions from "@/components/admin/quickActions";
import DashboardLayout from "@/components/admin/layout";
import styles from "@/styles/admin.module.css";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import connectDB from "@/utils/connectmongo";
import Users from "../model/registerSchema";
import Activity from "../model/recentactivities";
import Quiz from "@/model/quizCreation";

export default function Dashboard(props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthorized users
  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "admin") {
      router.replace("/adminlogin");
    } else if (status === "unauthenticated") {
      router.replace("/adminlogin");
    }
  }, [status, session, router]);

  // Loading spinner while session is checked
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-12 h-12 text-gray-600 animate-spin" />
      </div>
    );
  }

  // Prevent flashing if unauthorized
  if (status !== "authenticated" || session?.user.role !== "admin") {
    return null;
  }

  // ========== DASHBOARD LOGIC ==========

  // Get users
  const users = props.users;
  const totalUsers = users.length;

  // --- Percentage change utility ---
  function calculatePercentageChange(current, previous) {
    if (previous === 0 && current === 0) return "0%";
    if (previous === 0) return "+100%"; // avoid division by zero

    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  }

  // --- Monthly growth calculation ---
  function getCurrentVsLastMonthGrowth(users) {
    const counts = users.reduce((acc, u) => {
      if (!u.createdAt) return acc;

      const d = new Date(u.createdAt);
      if (isNaN(d)) return acc;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const months = Object.keys(counts).sort();
    if (months.length < 2) return "Not enough data";

    const lastMonth = months[months.length - 2];
    const currentMonth = months[months.length - 1];

    const previous = counts[lastMonth] || 0;
    const current = counts[currentMonth] || 0;

    return calculatePercentageChange(current, previous);
  }

  const usersRate = getCurrentVsLastMonthGrowth(users);

  // --- Monthly activities count ---
  function getMonthlyActivitiesCount(activities) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return activities.filter((activity) => {
      const date = new Date(activity.createdAt);
      if (isNaN(date)) return false;
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    }).length;
  }

  // --- Overview Data ---
  const overviewData = [
    { userRate: usersRate },
    { totalUsers },
    { totalQuizzes: props.totalQuizzes.length },
    { monthlyActivity: getMonthlyActivitiesCount(props.activities) },
  ];

  // --- Recent Activities ---
  const allActivities = props.activities;

  // ========== UI SECTION ==========

  return (
    <DashboardLayout>
      <div className={styles.dashboardPage}>
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Dashboard Overview</h1>
          <p className={styles.dashboardSubtitle}>
            Welcome back! Here's what's happening with your platform
          </p>
        </div>

        {/* Overview cards */}
        <DashboardOverview overviewData={overviewData} />

        {/* Content grid */}
        <div className={styles.contentGrid}>
          {/* Recent Activity */}
          <div className={styles.activitySection}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <RecentActivity allActivities={allActivities} />
          </div>

          {/* Quick Actions */}
          <div className={styles.actionsSection}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ========== SERVER SIDE PROPS ==========

export async function getServerSideProps() {
  await connectDB();

  const users = await Users.find({}).lean();
  const activities = await Activity.find({}).lean();
  const totalQuizzes = await Quiz.find({}).lean();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
      activities: JSON.parse(JSON.stringify(activities)),
      totalQuizzes: JSON.parse(JSON.stringify(totalQuizzes)),
    },
  };
}
