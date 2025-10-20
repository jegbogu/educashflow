import { TrendingUp, Clock, Wallet, ChartLine } from "lucide-react";
import { ProgressBar } from "@/components/UserDashboard/progressBar";
import { ActivityItem } from "@/components/UserDashboard/activityItem";
import styles from "@/styles/userDashboard.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Userheader from "@/components/UserDashboard/userheader";
import Usernavbar from "@/components/UserDashboard/usernavbar";
import { useEffect, useState } from "react";
import Spinner from "@/components/icons/spinner";
import { cn } from "@/lib/utils";

export default function EarningsPage() {
  const { data: session, status } = useSession();
  const userData = session?.user;

  const router = useRouter();
  const [disabled, setDisabled] = useState(true);

  // Handle redirects in useEffect
  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "user") {
      router.replace("/login");
    } else if (status === "unauthenticated") {
      router.replace("/login");
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
  if (status !== "authenticated" || session?.user.role !== "user") {
    return null;
  }

  const activities = [
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "-$6.00",
      status: "pending",
    },
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "-$10.00",
      status: "failed",
    },
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "+$4.00",
      status: "completed",
    },
  ];

  return (
    <div>
      <Userheader userData={userData} />
      <div className="p-5">
        <Usernavbar />
        <div className={styles.earningsPage}>
          {/* Earnings & Withdrawals Header */}
          <div className={cn("!border-none", styles.sectionCard)}>
            <div className={styles.sectionHeader}>
              <Wallet className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Earnings & Withdrawals</h2>
            </div>
          </div>
          {/* Balance Cards */}
          <div className={styles.balanceCards}>
            <div className={cn(styles.balanceCard, styles.balanceAvailable)}>
              <div className={styles.balanceHeader}>
                <span className={styles.balanceLabel}>Available Balance</span>
                <span className={styles.balanceCurrency}>$</span>
              </div>
              <div className={styles.balanceAmount}>$45.20</div>
              <div className={styles.balanceRate}>Rate 100pts = $1.05</div>
            </div>

            <div className={cn(styles.balanceCard, styles.balanceMonthly)}>
              <div className={styles.balanceHeader}>
                <span className={styles.balanceLabel}>This Month</span>
                <ChartLine className={styles.balanceTrendIcon} />
              </div>
              <div className={styles.balanceAmount}>$89.50</div>
              <div className={styles.balanceGrowth}>
                <TrendingUp className={styles.growthIcon} />
                +33.0% from last month
              </div>
            </div>
          </div>
          {/* Withdrawal Progress */}
          <div className={styles.withdrawalSection}>
            <div className={styles.withdrawalHeader}>
              <span className={styles.withdrawalTitle}>
                Withdrawal Progress
              </span>
              <span className={styles.withdrawalMin}>Min. $50.00</span>
            </div>
            <div className={styles.withdrawalNeeded}>$4.80 more needed</div>
            <ProgressBar progress={90} />

            <button
              className={cn(disabled && styles.btnDisabled, styles.btn)}
              disabled={disabled}
            >
              <Clock className={styles.btnIcon} />
              Minimum Not Reached
            </button>
          </div>
          {/* Recent Activity */}
          <div className={styles.activitySection}>
            <div className={styles.activityHeader}>
              <h3 className={styles.activityTitle}>Recent Activity</h3>
              <button className={styles.btnGhost}>View All</button>
            </div>

            <div className={styles.activityList}>
              {activities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  title={activity.title}
                  timeAgo={activity.timeAgo}
                  amount={activity.amount}
                  status={activity.status}
                />
              ))}
            </div>
          </div>
          <div className={styles.couponSummary}>
            <div>
              <h3 className="py-2">$156.80</h3>
              <p>Total Earned</p>
            </div>
            <div>
              <h3 className="py-2">$12.00</h3>
              <p>Pending Withdrawal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
