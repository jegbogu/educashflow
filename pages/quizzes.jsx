import Userheader from "@/components/UserDashboard/userheader";
import { useSession } from 'next-auth/react';
import { useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/icons/spinner";
import Usernavbar from "@/components/UserDashboard/usernavbar";
import UserQuizzes from "@/components/UserDashboard/userquizzes";
 
export default function Quizzes(){

     const { data: session, status } = useSession();
const userData = session?.user
  
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
    return(
        <div className="p-5">
            <Userheader userData={userData}/>
            <Usernavbar/>
            <UserQuizzes/>
        </div>
)
}