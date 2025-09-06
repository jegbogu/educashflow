import DashboardOverview from "@/components/Admin_Dashboard_components/dashboardOverview";
import AdminNavBar from "@/components/Admin_Dashboard_components/navBar";
import QuickActions from "@/components/Admin_Dashboard_components/quickActions";
import RecentActivity from "@/components/Admin_Dashboard_components/recentActivity";
import SideBar from "@/components/Admin_Dashboard_components/sideBar";
import { useSession, signOut } from 'next-auth/react'; // Changed import here

export default function Dashboard() {

  const { data: session, status } = useSession();
   
  return (
    <div className="bg-gray-300 min-h-screen pl-5 pr-5 flex gap-5">
      {/* Sidebar (25%) */}
      <div className="w-1/4">
        <SideBar />
      </div>

      {/* Main content (75%) */}
      <div className="w-3/4">
        <AdminNavBar />
        <DashboardOverview/>
        <div className=" flex gap-3">
            <div className="w-1/2">
                <RecentActivity/>
            </div>
            <div className="w-1/2">
                 <QuickActions/>   
            </div>
        </div>
        
        
      </div>
    </div>
  );
}
