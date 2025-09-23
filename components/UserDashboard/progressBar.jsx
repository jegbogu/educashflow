// export default function ProgressBar({ progress }) {
//   return (
//     <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
//       <div
//         className="bg-black h-4 rounded-full "
//         style={{ width: `${progress}%` }}
//       ></div>
//     </div>
//   );
// }
import { cn } from "@/lib/utils";
import styles from "@/styles/userDashboard.module.css";
export function ProgressBar({ progress, className = "" }) {
  return (
    <div className={cn(styles.progressContainer, className)}>
      <div
        className={styles.progressBar}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
