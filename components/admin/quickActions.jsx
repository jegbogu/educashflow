import CreateQuizModal from "./creqteNewQuiz";
import { useState } from "react";
import styles from "@/styles/admin.module.css";
import { BookOpen, TrendingUp, ActivityIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/router";


export default function QuickActions() {
  const [modalQuiz, setModalQuiz] = useState(false);
  const router = useRouter()
  const quickActions = [
    {
      title: "Create Quiz",
      description: "Build a new Quiz",
      icon: BookOpen,
      onClick: () => setModalQuiz(true),
    },
    {
      title: "Manage Users",
      description: "View all users",
      icon: UsersIcon,
      onClick: () => router.replace("/users"),
    },
    {
      title: "Payment Analytics",
      description: "Check performance",
      icon: TrendingUp,
      onClick: () => router.replace("/payment"),
    },
    {
      title: "Activity Log",
      description: "Recent activities",
      icon: ActivityIcon,
    },
  ];

  return (
    <div className={styles.actionsGrid}>
      {modalQuiz && <CreateQuizModal onClose={() => setModalQuiz(false)} />}
      {quickActions.map((action, index) => {
        const Icon = action.icon;
        return (
          <div key={index} className={styles.actionCard} onClick={action.onClick}>
            <div className={styles.actionIcon}>
              <Icon />
            </div>
            <h3 className={styles.actionTitle}>{action.title}</h3>
            <p className={styles.actionDescription}>{action.description}</p>
          </div>
        );
      })}
    </div>
  );
}
