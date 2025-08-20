 
import { useState } from "react";
import MailIcon from "@/components/icons/MailIcon";
import LockIcon from "@/components/icons/LockIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import EyeOffIcon from "@/components/icons/EyeOffIcon";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-[30%] mx-auto border-4 border-gray-100 p-8 rounded-2xl mt-12 bg-white shadow-md">
      {/* Header */}
      <h1 className="text-center text-2xl font-bold text-gray-800">Login</h1>

      <form className="mt-6 space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <MailIcon className="w-5 h-5" />
            </span>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="pl-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <LockIcon className="w-5 h-5" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              className="pl-10 pr-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember me + Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-secondary focus:ring-secondary" />
            <span className="ml-2 text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-secondary hover:underline">
            Forgot Password?
          </a>
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="bg-secondary text-white p-2 rounded-md w-full mt-4 hover:bg-secondary/90 transition"
        >
          Login
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center mt-6">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Register button */}
      <div className="flex justify-center">
        <button className="bg-white text-secondary border-2 border-gray-200 p-2 rounded-md w-1/2 mt-5 hover:bg-gray-50 hover:border-secondary transition">
          Register
        </button>
      </div>
    </div>
  );
}
