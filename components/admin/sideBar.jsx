import UserIcon from "../icons/user";
import { DashboardIcon, PaymentIcon, UsersIcon, CouponIcon, SettingsIcon } from "../icons/navBarIcon";
 

 const menuItems = [
  { name: "Dashboard", icon: DashboardIcon },
  { name: "Payment", icon: PaymentIcon },
  { name: "Users", icon: UsersIcon },
  { name: "Coupon", icon: CouponIcon },
  { name: "Settings", icon: SettingsIcon },
];

export default function SideBar(props) {
 
  return (
    <div className="bg-white w-full p-4 rounded-md mt-5 mb-5">
      <div>
        <p className="font-bold text-lg">Educash Flow</p>
      </div>
      <div className="my-2">
        <hr />
      </div>
      <div className="space-y-2 mt-[20px]">
      {menuItems.map(({ name, icon: Icon }) => (
        <div key={name} className="flex items-center space-x-5 mt-[20px] cursor-pointer hover:text-purple-600">
          <Icon className="w-6 h-6 text-gray-700 mt-[40px]" />
          <p className="mt-[40px]">{name}</p>
        </div>
      ))}
    </div>

      <div className="mt-[270px]">
        <div className="border-2 border-gray-400 w-[60px] p-2 rounded-full">
            <span><UserIcon className="w-10 h-10"/></span>
        </div>
        <div>
            <p>{props.data.user.fullname}</p>
          <p>{props.data.user.email}</p>
        </div>
      </div>
    </div>
  );
}
