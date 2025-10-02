import styles from "@/styles/admin.module.css";
import { Activity, BookOpen, TrendingUp, Users } from "lucide-react";

export default function DashboardOverview(props) {
  const stats = [
    {
      title: "Total Users",
      value: props.overviewData[1]?.totalUsers,
      change: "+12.5% from last month",
          icon: Users,
    },
    {
      title: "Active Quizzes",
      value: props.overviewData[2]?.totalQuizzes,
      change: "+8.2% from last month",
      icon: BookOpen,
    },
    {
      title: "Engagement Rate",
      value: props.overviewData[0]?.userRate,
      change: "+5.1% from last month",
      icon: TrendingUp,
    },
    {
      title: "Monthly Activity",
      value: props.overviewData[3]?.monthlyActivity,
      change: "+15.3% from last month",
      icon: Activity,
    },
  ];
  
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={styles.statCard}>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardTitle}>{stat.title}</span>
              <div className={styles.statCardIcon}>
                <Icon />
              </div>
            </div>
            <h2 className={styles.statCardValue}>{stat.value}</h2>
            <span className={styles.statCardChange}>{stat.change}</span>
          </div>
        );
      })}
    </div>
  );
}
