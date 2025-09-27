import Userheader from "@/components/UserDashboard/userheader";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/icons/spinner";
import Usernavbar from "@/components/UserDashboard/usernavbar";
import {
  TrendingUp,
  BookOpen,
  ChartLine,
  Wallet,
  Clock,
} from "lucide-react";
import { StatsCard } from "@/components/UserDashboard/statsCard";
import { ProgressBar } from "@/components/UserDashboard/progressBar";
import { QuizCard } from "@/components/UserDashboard/quizCard";
import { ActivityItem } from "@/components/UserDashboard/activityItem";

import UserQuizzes from "@/components/UserDashboard/userquizzes";
import styles from "@/styles/userDashboard.module.css";
import { cn } from "@/lib/utils";
import Recent from "@/components/icons/recent";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const userData = session?.user;

  const router = useRouter();

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

  const quizzes = [
    {
      title: "World Geography Masters",
      difficulty: "Medium",
      subject: "Geography",
      duration: "15 mins",
      questions: "20 questions",
      points: "+250 pts",
      accuracy: "85%",
      completed: true,
      buttonText: "Retry",
    },
    {
      title: "Science Fundamentals",
      difficulty: "Easy",
      subject: "Science",
      duration: "10 mins",
      questions: "15 questions",
      points: "+100 pts",
      buttonText: "Start",
    },
    {
      title: "Advanced Mathematics",
      difficulty: "Hard",
      subject: "Math",
      duration: "30 mins",
      questions: "25 questions",
      points: "+500 pts",
      buttonText: "Start",
    },
  ];
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
      title: "Advanced Math Quiz",
      timeAgo: "2 days ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Advanced Math Quiz",
      timeAgo: "2 days ago",
      amount: "+$4.00",
      status: "completed",
    },
  ];

  return (
    <div>
      <Userheader userData={userData} />
      <div className="p-5">
        <Usernavbar />
        <div className={styles.dashboard}>
          <div className={styles.dashboardContainer}>
            {/* Top Stats Row */}
            <div className={styles.statsGrid}>
              {/* Active Coupon */}
              <StatsCard
                title="Active Coupon"
                badge={{ text: "Active", variant: "active" }}
              >
                <div className={styles.timeRemaining}>
                  <Clock className={styles.timeIcon} />
                  <span>
                    Time Remaining: <strong>26days, 14 hours</strong>
                  </span>
                </div>
                <div className={styles.progressSection}>
                  <div className={styles.progressLabel}>
                    <span>7 of 15 quizzes left</span>
                  </div>
                  <ProgressBar progress={53} />
                </div>
              </StatsCard>

              {/* Today */}
              <StatsCard title="Today">
                <div className={styles.statNumber}>3</div>
                <p className={styles.statDescription}>Quizzes completed</p>
              </StatsCard>

              {/* Earnings */}
              <StatsCard title="Earnings">
                <div className={styles.statNumber}>$45.20</div>
                <p className={styles.statDescription}>Available to withdraw</p>
                <p className={styles.statTotal}>Total earned: $156.35</p>
              </StatsCard>
            </div>

            {/* Main Content Grid */}
            <div className={styles.mainGrid}>
              {/* Left Column */}
              <div className={styles.leftColumn}>
                {/* Available Quizzes */}
                <div className={cn(styles.sectionCard, "border-none")}>
                  <div className={cn(styles.sectionHeader, "!p-0 !pb-2")}>
                    <BookOpen className={styles.sectionIcon} />
                    <h2 className={styles.sectionTitle}>Available Quizzes</h2>
                  </div>
                  <div>
                    <div className={styles.couponNotice}>
                      <p className="">
                        Get more from every game. Purchase a coupon to increase
                        your earnings.
                      </p>
                      <button className={styles.btnPrimary}>Buy Coupon</button>
                    </div>
                  </div>
                </div>

                {/* Daily Progress */}
                <div className={cn("!bg-green-50", styles.sectionCard)}>
                  <div className={cn(styles.sectionHeader, "justify-between")}>
                    <div className="flex items-center gap-2">
                      <ChartLine className={styles.sectionIcon} />
                      <h2 className={styles.sectionTitle}>Daily Progress</h2>
                    </div>
                    <div className={styles.progressLabel}>
                      <span>3/5 completed</span>
                    </div>
                  </div>
                  <div className={styles.sectionContent}>
                    <ProgressBar progress={60} />
                  </div>
                </div>

                {/* Quiz Categories */}
                <div className={styles.quizCategories}>
                  {quizzes.map((quiz, index) => (
                    <QuizCard
                      key={index}
                      title={quiz.title}
                      difficulty={quiz.difficulty}
                      subject={quiz.subject}
                      duration={quiz.duration}
                      questions={quiz.questions}
                      points={quiz.points}
                      accuracy={quiz.accuracy}
                      completed={quiz.completed}
                      buttonText={quiz.buttonText}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column - Earnings & Withdrawals */}
              <div className={styles.rightColumn}>
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <Wallet className={styles.sectionIcon} />
                    <h2 className={styles.sectionTitle}>
                      Earnings & Withdrawals
                    </h2>
                  </div>
                  <div className={styles.sectionContent}>
                    {/* Balance Row */}
                    <div className={styles.balanceRow}>
                      <div
                        className={cn(
                          styles.balanceItem,
                          styles.balanceAvailable
                        )}
                      >
                        <p className={styles.balanceLabel}>Available Balance</p>
                        <p className={cn(styles.balanceAmount)}>$45.20</p>
                        <p className={styles.balanceRate}>
                          Rate 100pts = $1.05
                        </p>
                      </div>
                      <div
                        className={cn(
                          styles.balanceItem,
                          styles.balanceMonthly
                        )}
                      >
                        <p className={styles.balanceLabel}>This Month</p>
                        <p className={cn(styles.balanceAmount)}>$89.50</p>
                        <p className={styles.balanceGrowth}>
                          <TrendingUp className={styles.growthIcon} />
                          +23.0% from last month
                        </p>
                      </div>
                    </div>

                    {/* Withdrawal Progress */}
                    <div className={styles.withdrawalSection}>
                      <div className={styles.withdrawalHeader}>
                        <p className={styles.withdrawalTitle}>
                          Withdrawal Progress
                        </p>
                        <p className={styles.withdrawalMin}>Min. $50.00</p>
                      </div>
                      <ProgressBar progress={90} />
                      <p className={styles.withdrawalNeeded}>
                        $4.80 more needed
                      </p>
                    </div>

                    {/* Minimum Not Reached Button */}
                    <button className={cn(styles.btnDisabled, styles.disable)}>
                      Minimum Not Reached
                    </button>

                    {/* Recent Activity */}
                    <div className={styles.activitySection}>
                      <div className={styles.activityHeader}>
                        <h3 className={styles.activityTitle}>
                          <Recent /> Recent Activity
                        </h3>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
