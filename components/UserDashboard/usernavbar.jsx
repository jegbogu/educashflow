export default function Usernavbar() {
  const menu = [
    { name: "Quizzes", link: "/quizzes" },
    { name: "Dashboard", link: "/dashboards" },
    
    { name: "Coupons", link: "/coupons" },
    { name: "Earnings", link: "/earnings" },
  ];

  return (
    <div>
    <nav className="bg-gray-200 mt-5 px-6 py-3 rounded-[12px]">
      <ul className="flex justify-around items-center">
        {menu.map((el) => (
          <li key={el.name}>
            <a
              href={el.link}
              className="text-gray-700 font-medium hover:text-purple-600 transition-colors"
            >
              {el.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>

     <div className="border-yellow-400 border rounded-md mt-5 p-5 bg-yellow-100">
                <p className="text-center">Playing without a coupon limits your earnings. Buy one to unlock full rewards and earn faster</p>

                <button className="bg-black text-white rounded-[15px] pt-2 pb-2 pl-4 pr-4 mt-5 ml-[45%]">Buy coupon</button>
            </div>
            </div>
  );
}
