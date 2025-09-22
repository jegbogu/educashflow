import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

export default function Usernavbar() {
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

      <div className="border-yellow-400 border rounded-md mt-5 p-5 bg-yellow-100">
        <p className="text-center">
          Playing without a coupon limits your earnings. Buy one to unlock full
          rewards and earn faster
        </p>

        <button className="bg-black text-white rounded-[15px] pt-2 pb-2 pl-4 pr-4 mt-5 ml-[45%]">
          Buy coupon
        </button>
      </div>
    </div>
  );
}
