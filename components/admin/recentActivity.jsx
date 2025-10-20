import styles from "@/styles/admin.module.css";

export default function RecentActivity(props) {
  const recentA = props.allActivities;
  const recentActivities = recentA.slice(-5);

  function timeAgo(dateString) {
    // safe guard: handle falsy input
    if (!dateString) return "";

    let pastDate;

    // Try to parse expected format: DD-MM-YYYY HH:mm:ss
    try {
      const parts = dateString.split("-");
      if (parts.length >= 3) {
        const [day, month, yearAndTime] = parts;
        const [year, ...timeParts] = yearAndTime.split(" ");
        const time = timeParts.join(" ") || "00:00:00";
        const formattedDate = `${year}-${month}-${day} ${time}`; // YYYY-MM-DD HH:mm:ss
        pastDate = new Date(formattedDate);
      } else {
        // Fallback: let Date try to parse other formats (ISO, etc.)
        pastDate = new Date(dateString);
      }
    } catch (e) {
      pastDate = new Date(dateString);
    }

    // If parsing failed, return empty string
    if (isNaN(pastDate)) return "";

    const now = new Date();
    const diffMs = now - pastDate; // difference in ms

    // If date is in the future, handle gracefully
    if (diffMs < 0) return "just now";

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return "just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  }

  return (
    <div className={styles.activityList}>
      {recentActivities.map((activity, index) => (
        <div key={index} className={styles.activityItem}>
          <div className={styles.activityInfo}>
            <h3 className={styles.activityTitle}>{activity?.activity}</h3>
            <p className={styles.activityDetail}>{activity?.description}</p>
          </div>
          <span className={styles.activityTime}>
            {timeAgo(activity?.createdAt)}
          </span>
        </div>
      ))}
    </div>
  );
}
