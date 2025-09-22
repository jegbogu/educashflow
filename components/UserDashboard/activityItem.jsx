import { cn } from "@/lib/utils";
import style from "@/styles/userDashboard.module.css";
export function ActivityItem({ title, timeAgo, amount, status }) {
  return (
    <div className={style.activityItem}>
      <div>
        <p className={style.activityTitle}>{title}</p>
        <p className={style.activityTime}>{timeAgo}</p>
      </div>
      <div className={style.activityRight}>
        <span className={cn(style.badge, style.badgeCompleted)}>{status}</span>
        <p className={style.activityAmount}>{amount}</p>
      </div>
    </div>
  );
}
