import CreateQuizModal from "./createNewQuiz";
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
      description: "View All Users",
      icon: UsersIcon,
      onClick: () => router.replace("/adminusers"),
    },
    {
      title: "Payment Status",
      description: "Manage All Payments From One Place",
      icon: TrendingUp,
      onClick: () => router.replace("/adminpayment"),
    },
    {
      title: "Questions ",
      description: "Delete, Filter, and Edit Questions",
      icon: ActivityIcon,
       onClick: () => router.replace("/adminbuilder"),
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
