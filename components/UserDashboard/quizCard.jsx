import { Brain, IterationCcw, Play } from "lucide-react";
import style from "@/styles/userDashboard.module.css";
import { cn } from "@/lib/utils";
export function QuizCard({
  title,
  difficulty,
  subject,
  duration,
  questions,
  points,
  accuracy,
  buttonText,
  completed,
}) {
  const difficultyClass = {
    Easy: style.badgeEasy,
    Medium: style.badgeMedium,
    Hard: style.badgeHard,
  }[difficulty];

  return (
    <div className={style.quizCard}>
      <div className={style.quizCardHeader}>
        <div className="flex gap-4 flex-wrap">
          <h3 className={style.quizCardTitle}>{title}</h3>
          <span className={cn(style.badge, difficultyClass)}>{difficulty}</span>
          <span
            className={cn(
              style.badge,
              "bg-neutral-200",
              completed == true ? "block" : "hidden"
            )}
          >
            Completed
          </span>
        </div>
        <button
          className={cn(completed ? style.btnSecondary : style.btnPrimary)}
        >
          {completed ? (
            <IterationCcw className={style.btnIcon} />
            
          ) : (
            <Play className={style.btnIcon} />
          )}
          {buttonText}
        </button>
      </div>
      <div className={style.quizCardMeta}>
        <div className={style.quizCardSubject}>
          <Brain className={style.subjectIcon} />
          <span>{subject}</span>
        </div>
        <span>{duration}</span>
        <span>{questions}</span>
        <span>{points}</span>
      </div>
      {accuracy && (
        <div className={style.quizCardAccuracy}>
          Your accuracy: <strong>{accuracy}</strong>
        </div>
      )}
    </div>
  );
}
