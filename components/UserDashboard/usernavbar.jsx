import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import Buycouponbanner from "./buycuponbanner";
import { useSession } from "next-auth/react";

export default function Usernavbar() {


    const { data: session, status } = useSession();
    const userData = session?.user;

  const menu = [
    { name: "Quizzes", link: "/quizzes" },
    { name: "Dashboard", link: "/dashboard" },

    { name: "Coupons", link: "/coupons" },
    { name: "Earnings", link: "/earnings" },
  ];
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      <nav className="bg-gray-200 mt-5 p-1 rounded-[12px]">
        <ul className="flex justify-between items-center max-sm:text-sm">
          {menu.map((el) => (
            <li
              key={el.name}
              className={cn(
                "px-2 py-2 w-full flex justify-center rounded-lg cursor-pointer",
                router.pathname === el.link
                  ? "bg-white text-black"
                  : "text-black bg-none"
              )}
            >
              <a href={el.link} className="font-medium transition-colors">
                {el.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
{userData?.membership!=="Free plan"?" ": <Buycouponbanner/>}
     
    </div>
  );
}
