import styles from "@/styles/admin.module.css";

 

export default function RecentActivity(props) {
  const recentA = props.allActivities;
  const recentActivities = recentA.slice(-5);

  function timeAgo(dateString) {
    // Convert the string to a Date object (format: DD-MM-YYYY HH:mm:ss)
    const [day, month, yearAndTime] = dateString.split("-");

    let year;
    let time;
      if(yearAndTime){
[year] = yearAndTime.split(" ")
[time] = yearAndTime.split(" ")
      }
 
    const formattedDate = `${year}-${month}-${day} ${time}`; // YYYY-MM-DD HH:mm:ss

    const pastDate = new Date(formattedDate);
    const now = new Date();

    const diffMs = now - pastDate; // difference in ms
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
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
          <span className={styles.activityTime}>{timeAgo(activity?.createdAt)}</span>
        </div>
      ))}
    </div>
  );
}
