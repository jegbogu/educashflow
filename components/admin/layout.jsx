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
  LogOut,
} from "lucide-react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "../icons/logo";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "educashadmindashboard",
  },
  {
    id: "adminpayment",
    label: "Payment",
    icon: CreditCard,
    link: "adminpayment",
  },
  { id: "adminusers", label: "Users", icon: Users, link: "adminusers" },
  { id: "admincoupons", label: "Coupon", icon: Ticket, link: "admincoupons" },
  {
    id: "adminbuilder",
    label: "Quiz Builder",
    icon: BookOpen,
    link: "adminbuilder",
  },
  {
    id: "adminsettings",
    label: "Settings",
    icon: Settings,
    link: "adminsettings",
  },
];

export default function DashboardLayout({ children, onPageChange }) {
  const pathName = useRouter().pathname.split("/")[1];
  const router = useRouter();

  const [activeItem, setActiveItem] = useState(pathName ?? "dashboard");
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

  function shortenEmail(email, mask = "***") {
    if (!email || typeof email !== "string") return "";
    let [local, domain] = email?.split("@");

    let dotIndex = domain.lastIndexOf(".");
    if (dotIndex === -1) return email;

    let extension = domain.slice(dotIndex);
    let mainPart = local + "@" + domain.slice(0, dotIndex);

    if (email.length > 17) {
      return mainPart.slice(0, 6) + mask + extension;
    }

    return email;
  }

  function logout() {
    signOut();
    router.replace("/adminlogin");
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
          <Logo />
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
            <span className={styles.avatarFallback}>
              {session?.user?.fullname.charAt(0)}
            </span>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{session?.user?.fullname}</div>
            <div className={styles.profileEmail}>
              {shortenEmail(session?.user?.email)}
            </div>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className={cn(
            styles.navItem,
            "!bg-slate-800 !text-white !text-center !mt-2 flex justify-between items-center"
          )}
        >
          Logout <LogOut className={styles.navIcon} />
        </button>
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
                <div className={styles.userEmail}>
                  {shortenEmail(session?.user?.email)}
                </div>
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
