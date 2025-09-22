import { cn } from "@/lib/utils";
import style from "@/styles/userDashboard.module.css";
export function ActivityItem({ title, timeAgo, amount, status }) {
  let badge;
  let amountTextColor;
  switch (status) {
    case "failed":
      badge = style.badgeFailed;
      amountTextColor = "text-red-600";
      break;
    case "pending":
      badge = style.badgePending;
      amountTextColor = "text-neutral-600";
      break;
    default:
      badge = style.badgeCompleted;
      amountTextColor = "text-green-600";
      break;
  }
  
  
  return (
    <div className={style.activityItem}>
      <div>
        <p className={style.activityTitle}>{title}</p>
        <p className={style.activityTime}>{timeAgo}</p>
      </div>
      <div className={style.activityRight}>
        <span className={cn(style.badge, badge)}>{status}</span>
        <p className={cn(amountTextColor, style.activityAmount)}>{amount}</p>
      </div>
    </div>
  );
}
