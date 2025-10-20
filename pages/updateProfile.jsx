import Spinner from "@/components/icons/spinner";
import Userheader from "@/components/UserDashboard/userheader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Settings from "@/components/UserDashboard/settings";

export default function UpdateProfile() {
  const { data: session, status } = useSession();
  const userData = session?.user;

  const router = useRouter();

  // Handle redirects in useEffect
  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "user") {
      router.replace("/login");
    } else if (status === "unauthenticated") {
      router.replace("/login");
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
  if (status !== "authenticated" || session?.user.role !== "user") {
    return null;
  }

  const handleUpdate = (updatedData) => {};
  const handleBack = () => {};

  return (
    <div>
      <Userheader userData={userData} />
      <Settings
        userData={userData}
        onUpdate={handleUpdate}
        onBack={handleBack}
      />
    </div>
  );
}
