import { User, Shield } from "lucide-react";
import styles from "@/styles/settings.module.css";
import DashboardLayout from "@/components/admin/layout";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Spinner from "@/components/icons/spinner";
import { useRouter } from "next/router";

export default function SettingsPage() {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [password, setPassword] = useState({ current: "", new: "" });
  const { data: session, status } = useSession();
  const router  = useRouter()
 // Handle redirects in useEffect
      useEffect(() => {
        if (status === "authenticated" && session?.user.role !== "admin") {
          router.replace("/adminlogin");
        } else if (status === "unauthenticated") {
          router.replace("/adminlogin");
        }
      }, [status, session, router]);
    
      // Show loading state while session is being checked
      if (status === "loading") {
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-3xl font-bold">
              <Spinner className="w-12 h-12" />
            </div>
          </div>
        );
      }
    
      // If user is not allowed, return null to prevent flashing content
      if (status !== "authenticated" || session?.user.role !== "admin") {
        return null;
      }
  
  return (
    <DashboardLayout>
      <div className={styles.settingsPage}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageDescription}>
            Manage your application settings and preferences
          </p>
        </div>

        <div className={styles.settingsSections}>
          {/* Profile Settings */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <User className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Profile Settings</h2>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Admin Username</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Enter username"
                value={profile.username}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, username: e.target.value }))
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                className={styles.formInput}
                placeholder="Enter email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <button className={styles.btnPrimary}>Update Username</button>
          </div>

          {/* Security Settings */}
          <div
            className={`${styles.settingsSection} ${styles.securitySection}`}
          >
            <div className={styles.sectionHeader}>
              <Shield className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Security</h2>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Current Password</label>
              <input
                type="password"
                className={styles.formInput}
                placeholder="Enter current password"
                value={password.current}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, current: e.target.value }))
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>New Password</label>
              <input
                type="password"
                className={styles.formInput}
                placeholder="Enter new password"
                value={password.new}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, new: e.target.value }))
                }
              />
            </div>

            <button className={styles.btnPrimary}>Update Password</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
