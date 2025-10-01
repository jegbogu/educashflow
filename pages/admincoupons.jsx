import Couponssectionone from "@/components/admin/couponssectionone";
import AdminNavBar from "@/components/admin/navBar";

import SideBar from "@/components/admin/sideBar";
import Spinner from "@/components/icons/spinner";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Admincoupons() {
  const { data: session, status } = useSession();

  const router = useRouter();

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
    <div className="bg-gray-300 min-h-screen pl-5 pr-5 flex gap-5">
      {/* Sidebar (25%) */}
      <div className="w-1/5">
        <SideBar data={session} />
      </div>
      {/* Main content (75%) */}
      <div className="w-4/5">
        <AdminNavBar data={session} />
        <Couponssectionone />
      </div>
    </div>
  );
}
