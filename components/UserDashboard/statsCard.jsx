import { cn } from "@/lib/utils";
import styles from "@/styles/userDashboard.module.css";

export function StatsCard({ title, children, badge }) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.statsCardHeader}>
        <div className={styles.statsCardTitleRow}>
          <h3 className={styles.statsCardTitle}>{title}</h3>
          {badge && (
            <span
              className={cn(
                styles.badge,
                badge.variant === styles.active
                  ? styles.badgeActive
                  : styles.badgeDefault
              )}
            >
              {badge.text}
            </span>
          )}
        </div>
      </div>
      <div className={styles.statsCardContent}>{children}</div>
    </div>
  );
}
