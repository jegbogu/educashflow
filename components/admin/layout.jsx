import styles from "@/styles/admin.module.css";
import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Ticket,
  Settings,
  BookOpen,
  Search,
  User,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "educashadmindashboard",
  },
  { id: "payment", label: "Payment", icon: CreditCard, link: "payment" },
  { id: "users", label: "Users", icon: Users, link: "users" },
  { id: "coupons", label: "Coupon", icon: Ticket, link: "ticket" },
  { id: "settings", label: "Settings", icon: Settings, link: "settings" },
  {
    id: "quiz-builder",
    label: "Quiz Builder",
    icon: BookOpen,
    link: "builder",
  },
];

export default function DashboardLayout({ children, onPageChange }) {
  const pathName = useRouter().pathname.split("/")[1];
  console.log(pathName);
  const [activeItem, setActiveItem] = useState(pathName);
  const { data: session } = useSession();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    onPageChange?.(itemId);
    setIsMobileMenuOpen(false);
  };

  const [profileSettings, setProfileSetting] = useState(false);

  function formatCustomDate(date = new Date()) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];

    // Add suffix (st, nd, rd, th)
    const suffix = (d) => {
      if (d > 3 && d < 21) return "th"; // 4th–20th
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${dayName}, ${day}${suffix(day)} ${monthName}`;
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {isMobileMenuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`${styles.adminSidebar} ${
          isMobileMenuOpen ? styles.sidebarMobileOpen : ""
        }`}
      >
        {/* Logo */}
        <div className={styles.sidebarLogo}>
          <div className={styles.logoIcon}>
            <div className={styles.logoDots}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
          <span className={styles.logoText}>EduCashflow</span>
        </div>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                href={`/${item.link}`}
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`${styles.navItem} ${
                  activeItem === item.id ? styles.navItemActive : ""
                }`}
              >
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={styles.sidebarProfile}>
          <div className={styles.profileAvatar}>
            <img
              src="/admin-profile-avatar.png"
              alt="Natalie Johnson"
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{session?.user?.fullname}</div>
            <div className={styles.profileEmail}>{session?.user?.email}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.adminMain}>
        {/* Header */}
        <header className={styles.adminHeader}>
          <div className={styles.headerSearch}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
          </div>

          <div className={styles.headerRight}>
            <div className={styles.headerDate}>{formatCustomDate()}</div>
            <div className={styles.headerUser}>
              <User className={styles.userIcon} />
              <div className={styles.userInfo}>
                <div className={styles.userName}>{session?.user?.fullname}</div>
                <div className={styles.userEmail}>{session?.user?.email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={styles.adminContent}>{children}</main>
      </div>
    </div>
  );
}
